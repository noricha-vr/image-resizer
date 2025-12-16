import { useState, useCallback } from 'react';
import type { ImageFile, ProcessedImage, ResizeSettings } from '../types';
import { ProcessingStatus } from '../types';
import { processImage } from '../utils/imageResizer';
import { createDownloadUrl } from '../utils/downloadHelper';
import {
  trackImageConverted,
  trackImageConvertError,
} from '../utils/analytics';

/**
 * 画像処理管理カスタムフック
 */
export function useImageProcessor(settings: ResizeSettings) {
  const [queue, setQueue] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  /**
   * 単一ファイルを処理
   */
  const processSingleFile = useCallback(
    async (imageFile: ImageFile): Promise<ProcessedImage | null> => {
      const startTime = performance.now();
      try {
        // ステータスを処理中に更新
        setQueue((prev) =>
          prev.map((item) =>
            item.id === imageFile.id
              ? { ...item, status: ProcessingStatus.PROCESSING, progress: 50 }
              : item
          )
        );

        // 画像処理を実行
        const {
          resizedBlob,
          thumbnailBlob,
          originalWidth,
          originalHeight,
          cropped,
        } = await processImage(imageFile.file, settings);

        // Canvasから画像サイズを取得
        const img = new Image();
        const url = URL.createObjectURL(resizedBlob);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
        URL.revokeObjectURL(url);

        // ProcessedImageを作成
        const processedImage: ProcessedImage = {
          id: imageFile.id,
          originalFile: imageFile,
          resizedBlob,
          thumbnailBlob,
          width: img.naturalWidth,
          height: img.naturalHeight,
          originalWidth,
          originalHeight,
          downloadUrl: createDownloadUrl(resizedBlob),
          thumbnailUrl: createDownloadUrl(thumbnailBlob),
          outputFormat: settings.outputFormat,
          resizeEnabled: settings.resizeEnabled,
          maxSize: settings.maxSize,
          quality: settings.quality,
          cropped,
          cropAspectRatio: cropped ? settings.crop.aspectRatio : undefined,
        };

        // ステータスを完了に更新
        setQueue((prev) =>
          prev.map((item) =>
            item.id === imageFile.id
              ? { ...item, status: ProcessingStatus.COMPLETED, progress: 100 }
              : item
          )
        );

        // トラッキングイベントを送信
        const durationMs = Math.round(performance.now() - startTime);
        trackImageConverted({
          outputFormat: settings.outputFormat,
          resizeEnabled: settings.resizeEnabled,
          maxSize: settings.maxSize,
          quality: settings.quality,
          originalBytes: imageFile.size,
          resultBytes: resizedBlob.size,
          resultWidth: img.naturalWidth,
          resultHeight: img.naturalHeight,
          durationMs,
        });

        return processedImage;
      } catch (error) {
        // エラー時のステータス更新
        setQueue((prev) =>
          prev.map((item) =>
            item.id === imageFile.id
              ? {
                  ...item,
                  status: ProcessingStatus.ERROR,
                  error:
                    error instanceof Error
                      ? error.message
                      : '画像の処理に失敗しました',
                }
              : item
          )
        );

        // エラートラッキングイベントを送信
        const errorMessage =
          error instanceof Error
            ? error.message
            : '画像の処理に失敗しました';
        trackImageConvertError({
          message: errorMessage.slice(0, 100),
          outputFormat: settings.outputFormat,
          resizeEnabled: settings.resizeEnabled,
          maxSize: settings.maxSize,
          quality: settings.quality,
        });

        return null;
      }
    },
    [settings]
  );

  /**
   * キュー内の全ファイルを順次処理
   */
  const processQueue = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const waitingFiles = queue.filter(
      (item) => item.status === ProcessingStatus.WAITING
    );

    for (const imageFile of waitingFiles) {
      const result = await processSingleFile(imageFile);
      if (result) {
        setResults((prev) => [...prev, result]);
      }
    }

    setIsProcessing(false);
  }, [queue, isProcessing, processSingleFile]);

  /**
   * キューをクリア
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  /**
   * 結果をクリア
   */
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  /**
   * すべてをリセット
   */
  const reset = useCallback(() => {
    setQueue([]);
    setResults([]);
    setIsProcessing(false);
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
