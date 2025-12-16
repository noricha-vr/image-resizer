import { useState, useCallback, useEffect, useRef } from 'react';
import type { ImageFile, ProcessedImage, ResizeSettings } from '../types';
import { ProcessingStatus } from '../types';
import { createDownloadUrl } from '../utils/downloadHelper';
import {
  trackImageConverted,
  trackImageConvertError,
} from '../utils/analytics';
import type { WorkerResponse, ProcessImageResult } from '../workers/imageProcessor.types';
import ImageProcessorWorker from '../workers/imageProcessor.worker?worker';

// ============================================================================
// ヘルパー関数
// ============================================================================

/**
 * ProcessedImageオブジェクトを作成
 */
function createProcessedImage(
  response: ProcessImageResult,
  originalFile: ImageFile,
  settings: ResizeSettings
): ProcessedImage {
  return {
    id: response.id,
    originalFile: { ...originalFile, status: ProcessingStatus.COMPLETED, progress: 100 },
    resizedBlob: response.resizedBlob,
    thumbnailBlob: response.thumbnailBlob,
    width: response.width,
    height: response.height,
    originalWidth: response.originalWidth,
    originalHeight: response.originalHeight,
    downloadUrl: createDownloadUrl(response.resizedBlob),
    thumbnailUrl: createDownloadUrl(response.thumbnailBlob),
    outputFormat: settings.outputFormat,
    resizeEnabled: settings.resizeEnabled,
    maxSize: settings.maxSize,
    quality: settings.quality,
    cropped: response.cropped,
    cropAspectRatio: response.cropped ? settings.crop.aspectRatio : undefined,
  };
}

/**
 * キュー処理後の共通ロジック（待機中ファイル送信・完了チェック）
 */
function processQueueAfterCompletion(
  queue: ImageFile[],
  completedId: string,
  newStatus: ProcessingStatus,
  error: string | undefined,
  sendToWorker: (file: ImageFile) => boolean,
  setIsProcessing: (value: boolean) => void
): ImageFile[] {
  // ステータス更新
  const updated = queue.map((item) =>
    item.id === completedId
      ? { ...item, status: newStatus, progress: newStatus === ProcessingStatus.COMPLETED ? 100 : item.progress, error }
      : item
  );

  // 待機中ファイルを送信
  const waitingFiles = updated.filter((item) => item.status === ProcessingStatus.WAITING);
  for (const file of waitingFiles) {
    sendToWorker(file);
  }

  // 処理完了チェック
  const hasActiveFiles = updated.some(
    (item) => item.status === ProcessingStatus.WAITING || item.status === ProcessingStatus.PROCESSING
  );
  if (!hasActiveFiles) {
    setIsProcessing(false);
  }

  // 待機中→処理中に更新
  return updated.map((item) =>
    waitingFiles.some((w) => w.id === item.id)
      ? { ...item, status: ProcessingStatus.PROCESSING }
      : item
  );
}

// ============================================================================
// メインフック
// ============================================================================

/**
 * 画像処理管理カスタムフック（Web Worker版）
 */
export function useImageProcessor(settings: ResizeSettings) {
  const [queue, setQueue] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const workerRef = useRef<Worker | null>(null);
  const startTimesRef = useRef<Map<string, number>>(new Map());
  const sentIdsRef = useRef<Set<string>>(new Set());
  const processedIdsRef = useRef<Set<string>>(new Set());
  const fileInfoRef = useRef<Map<string, ImageFile>>(new Map());
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // ---------------------------------------------------------------------------
  // Worker通信
  // ---------------------------------------------------------------------------

  /**
   * ファイルをWorkerに送信（重複チェック付き）
   */
  const sendToWorker = useCallback((file: ImageFile) => {
    if (!workerRef.current) return false;
    if (sentIdsRef.current.has(file.id)) return false;

    sentIdsRef.current.add(file.id);
    startTimesRef.current.set(file.id, performance.now());

    workerRef.current.postMessage({
      type: 'processImage',
      id: file.id,
      file: file.file,
      settings: {
        resizeEnabled: settingsRef.current.resizeEnabled,
        maxSize: settingsRef.current.maxSize,
        quality: settingsRef.current.quality,
        outputFormat: settingsRef.current.outputFormat,
        sizeMode: settingsRef.current.sizeMode,
        crop: {
          enabled: settingsRef.current.crop.enabled,
          aspectRatio: settingsRef.current.crop.aspectRatio,
        },
      },
    });

    return true;
  }, []);

  // ---------------------------------------------------------------------------
  // メッセージハンドラ
  // ---------------------------------------------------------------------------

  const handleProgress = useCallback((id: string, progress: number) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: ProcessingStatus.PROCESSING, progress }
          : item
      )
    );
  }, []);

  const handleResult = useCallback((response: ProcessImageResult) => {
    // 重複防止
    if (processedIdsRef.current.has(response.id)) return;
    processedIdsRef.current.add(response.id);

    // 処理時間計測
    const startTime = startTimesRef.current.get(response.id);
    const durationMs = startTime ? Math.round(performance.now() - startTime) : 0;
    startTimesRef.current.delete(response.id);

    // ファイル情報取得
    const cachedFileInfo = fileInfoRef.current.get(response.id);
    const originalFile: ImageFile = cachedFileInfo || {
      id: response.id,
      file: new File([], ''),
      name: response.id.split('-')[0] || '',
      size: 0,
      type: '',
      status: ProcessingStatus.COMPLETED,
      progress: 100,
    };

    // 結果オブジェクト作成
    const processedImage = createProcessedImage(response, originalFile, settingsRef.current);

    // アナリティクス送信
    if (cachedFileInfo) {
      trackImageConverted({
        outputFormat: settingsRef.current.outputFormat,
        resizeEnabled: settingsRef.current.resizeEnabled,
        maxSize: settingsRef.current.maxSize,
        quality: settingsRef.current.quality,
        originalBytes: cachedFileInfo.size,
        resultBytes: response.resizedBlob.size,
        resultWidth: response.width,
        resultHeight: response.height,
        durationMs,
      });
    }

    // 結果追加
    setResults((prev) => {
      if (prev.some((r) => r.id === response.id)) return prev;
      return [...prev, processedImage];
    });

    // キュー更新
    setQueue((prev) =>
      processQueueAfterCompletion(
        prev,
        response.id,
        ProcessingStatus.COMPLETED,
        undefined,
        sendToWorker,
        setIsProcessing
      )
    );
  }, [sendToWorker]);

  const handleError = useCallback((id: string, message: string) => {
    startTimesRef.current.delete(id);

    // エラー追跡
    const imageFile = fileInfoRef.current.get(id);
    if (imageFile) {
      trackImageConvertError({
        message: message.slice(0, 100),
        outputFormat: settingsRef.current.outputFormat,
        resizeEnabled: settingsRef.current.resizeEnabled,
        maxSize: settingsRef.current.maxSize,
        quality: settingsRef.current.quality,
      });
    }

    // キュー更新
    setQueue((prev) =>
      processQueueAfterCompletion(
        prev,
        id,
        ProcessingStatus.ERROR,
        message,
        sendToWorker,
        setIsProcessing
      )
    );
  }, [sendToWorker]);

  // ---------------------------------------------------------------------------
  // Worker初期化
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const worker = new ImageProcessorWorker();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      switch (response.type) {
        case 'progress':
          handleProgress(response.id, response.progress);
          break;
        case 'result':
          handleResult(response);
          break;
        case 'error':
          handleError(response.id, response.message);
          break;
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, [handleProgress, handleResult, handleError]);

  // ---------------------------------------------------------------------------
  // 公開API
  // ---------------------------------------------------------------------------

  const addToQueue = useCallback((files: File[]) => {
    const newItems: ImageFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: ProcessingStatus.WAITING,
      progress: 0,
    }));

    for (const item of newItems) {
      fileInfoRef.current.set(item.id, item);
    }

    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessing || !workerRef.current) return;

    const waitingFiles = queue.filter((item) => item.status === ProcessingStatus.WAITING);
    if (waitingFiles.length === 0) return;

    setIsProcessing(true);

    const sentFiles: string[] = [];
    for (const file of waitingFiles) {
      if (sendToWorker(file)) {
        sentFiles.push(file.id);
      }
    }

    if (sentFiles.length > 0) {
      const sentIds = new Set(sentFiles);
      setQueue((prev) =>
        prev.map((item) =>
          sentIds.has(item.id) ? { ...item, status: ProcessingStatus.PROCESSING } : item
        )
      );
    }
  }, [queue, isProcessing, sendToWorker]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    fileInfoRef.current.clear();
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    processedIdsRef.current.clear();
  }, []);

  const reset = useCallback(() => {
    setQueue([]);
    setResults([]);
    setIsProcessing(false);
    sentIdsRef.current.clear();
    processedIdsRef.current.clear();
    fileInfoRef.current.clear();
    startTimesRef.current.clear();
  }, []);

  const removeResult = useCallback((id: string) => {
    setResults((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    queue,
    results,
    isProcessing,
    addToQueue,
    processQueue,
    clearQueue,
    clearResults,
    reset,
    removeResult,
  };
}
