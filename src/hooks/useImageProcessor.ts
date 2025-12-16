import { useState, useCallback, useEffect, useRef } from 'react';
import type { ImageFile, ProcessedImage, ResizeSettings } from '../types';
import { ProcessingStatus } from '../types';
import { createDownloadUrl } from '../utils/downloadHelper';
import {
  trackImageConverted,
  trackImageConvertError,
} from '../utils/analytics';
import type { WorkerResponse } from '../workers/imageProcessor.types';
import ImageProcessorWorker from '../workers/imageProcessor.worker?worker';

/**
 * 画像処理管理カスタムフック（Web Worker版）
 */
export function useImageProcessor(settings: ResizeSettings) {
  const [queue, setQueue] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Worker インスタンス
  const workerRef = useRef<Worker | null>(null);
  // 処理開始時刻（トラッキング用）
  const startTimesRef = useRef<Map<string, number>>(new Map());
  // 送信済みファイルID（重複送信防止）
  const sentIdsRef = useRef<Set<string>>(new Set());
  // 処理済みファイルID（重複結果防止）
  const processedIdsRef = useRef<Set<string>>(new Set());
  // ファイル情報のキャッシュ（状態に依存せずアクセス可能）
  const fileInfoRef = useRef<Map<string, ImageFile>>(new Map());
  // 設定の最新値
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  /**
   * ファイルをWorkerに送信（重複チェック付き）
   */
  const sendToWorker = useCallback((file: ImageFile) => {
    if (!workerRef.current) return false;
    if (sentIdsRef.current.has(file.id)) {
      console.warn(`[Worker] Already sent: ${file.id}`);
      return false;
    }

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

  /**
   * Worker を初期化
   */
  useEffect(() => {
    const worker = new ImageProcessorWorker();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      switch (response.type) {
        case 'progress':
          setQueue((prev) =>
            prev.map((item) =>
              item.id === response.id
                ? { ...item, status: ProcessingStatus.PROCESSING, progress: response.progress }
                : item
            )
          );
          break;

        case 'result': {
          // 重複結果防止チェック（メッセージハンドラレベルで早期リターン）
          if (processedIdsRef.current.has(response.id)) {
            return;
          }
          processedIdsRef.current.add(response.id);

          const startTime = startTimesRef.current.get(response.id);
          const durationMs = startTime ? Math.round(performance.now() - startTime) : 0;
          startTimesRef.current.delete(response.id);

          // ファイル情報をrefから取得（状態に依存しない）
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

          // 処理結果オブジェクトを作成
          const processedImage: ProcessedImage = {
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
            outputFormat: settingsRef.current.outputFormat,
            resizeEnabled: settingsRef.current.resizeEnabled,
            maxSize: settingsRef.current.maxSize,
            quality: settingsRef.current.quality,
            cropped: response.cropped,
            cropAspectRatio: response.cropped ? settingsRef.current.crop.aspectRatio : undefined,
          };

          // アナリティクス送信（状態更新の外で実行）
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

          // 結果追加（純粋な状態更新のみ）
          setResults((prevResults) => {
            if (prevResults.some((r) => r.id === response.id)) {
              return prevResults;
            }
            return [...prevResults, processedImage];
          });

          // キューのステータス更新（純粋な状態更新のみ）
          setQueue((prev) => {
            const updated = prev.map((item) =>
              item.id === response.id
                ? { ...item, status: ProcessingStatus.COMPLETED, progress: 100 }
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

            return updated.map((item) =>
              waitingFiles.some((w) => w.id === item.id)
                ? { ...item, status: ProcessingStatus.PROCESSING }
                : item
            );
          });
          break;
        }

        case 'error': {
          startTimesRef.current.delete(response.id);

          setQueue((prev) => {
            const imageFile = prev.find((item) => item.id === response.id);

            if (imageFile) {
              trackImageConvertError({
                message: response.message.slice(0, 100),
                outputFormat: settingsRef.current.outputFormat,
                resizeEnabled: settingsRef.current.resizeEnabled,
                maxSize: settingsRef.current.maxSize,
                quality: settingsRef.current.quality,
              });
            }

            // ステータス更新と待機中ファイルの処理を1回のsetQueueで行う
            const updated = prev.map((item) =>
              item.id === response.id
                ? { ...item, status: ProcessingStatus.ERROR, error: response.message }
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

            return updated.map((item) =>
              waitingFiles.some((w) => w.id === item.id)
                ? { ...item, status: ProcessingStatus.PROCESSING }
                : item
            );
          });
          break;
        }
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, [sendToWorker]);

  /**
   * キューにファイルを追加
   */
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

    // ファイル情報をrefにキャッシュ（状態に依存せずアクセス可能にする）
    for (const item of newItems) {
      fileInfoRef.current.set(item.id, item);
    }

    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  /**
   * キュー内の待機中ファイルを処理開始
   */
  const processQueue = useCallback(() => {
    if (isProcessing || !workerRef.current) return;

    const waitingFiles = queue.filter((item) => item.status === ProcessingStatus.WAITING);
    if (waitingFiles.length === 0) return;

    setIsProcessing(true);

    // Workerに送信してステータスを更新
    const sentFiles: string[] = [];
    for (const file of waitingFiles) {
      if (sendToWorker(file)) {
        sentFiles.push(file.id);
      }
    }

    // ステータスをPROCESSINGに更新
    if (sentFiles.length > 0) {
      const sentIds = new Set(sentFiles);
      setQueue((prev) =>
        prev.map((item) =>
          sentIds.has(item.id) ? { ...item, status: ProcessingStatus.PROCESSING } : item
        )
      );
    }
  }, [queue, isProcessing, sendToWorker]);

  /**
   * キューをクリア
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
    fileInfoRef.current.clear();
  }, []);

  /**
   * 結果をクリア
   */
  const clearResults = useCallback(() => {
    setResults([]);
    processedIdsRef.current.clear();
  }, []);

  /**
   * すべてをリセット
   */
  const reset = useCallback(() => {
    setQueue([]);
    setResults([]);
    setIsProcessing(false);
    sentIdsRef.current.clear();
    processedIdsRef.current.clear();
    fileInfoRef.current.clear();
    startTimesRef.current.clear();
  }, []);

  /**
   * 特定の結果を削除
   */
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
