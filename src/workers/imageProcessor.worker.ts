import { encode as encodeAvif } from '@jsquash/avif';
import { optimise as optimisePng } from '@jsquash/oxipng';
import type {
  WorkerRequest,
  WorkerResponse,
  ProcessImageRequest,
} from './imageProcessor.types';

const THUMBNAIL_SIZE = 150;

const MIME_TYPES: Record<string, string> = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  AVIF: 'image/avif',
};

const CropAspectRatio: Record<string, { width: number; height: number }> = {
  '16:9': { width: 16, height: 9 },
  '4:3': { width: 4, height: 3 },
  '1:1': { width: 1, height: 1 },
  '9:16': { width: 9, height: 16 },
};

/**
 * メインスレッドにメッセージを送信
 */
function postMessage(message: WorkerResponse) {
  self.postMessage(message);
}

/**
 * 進捗を報告
 */
function reportProgress(
  id: string,
  progress: number,
  stage: 'loading' | 'cropping' | 'resizing' | 'encoding' | 'thumbnail'
) {
  postMessage({ type: 'progress', id, progress, stage });
}

/**
 * 画像ファイルをImageBitmapとして読み込み
 */
async function loadImage(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

/**
 * アスペクト比を維持したリサイズサイズを計算
 */
function calculateResizeSize(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxSize || originalHeight > maxSize) {
    if (aspectRatio > 1) {
      newWidth = maxSize;
      newHeight = Math.round(maxSize / aspectRatio);
    } else {
      newHeight = maxSize;
      newWidth = Math.round(maxSize * aspectRatio);
    }
  }

  return { width: newWidth, height: newHeight };
}

/**
 * 中央クロップのサイズと座標を計算
 */
function calculateCropSize(
  originalWidth: number,
  originalHeight: number,
  targetAspect: { width: number; height: number }
): { sx: number; sy: number; sw: number; sh: number } {
  const originalAspect = originalWidth / originalHeight;
  const targetAspectRatio = targetAspect.width / targetAspect.height;

  let sw: number;
  let sh: number;
  let sx: number;
  let sy: number;

  if (originalAspect > targetAspectRatio) {
    sh = originalHeight;
    sw = Math.round(originalHeight * targetAspectRatio);
    sx = Math.round((originalWidth - sw) / 2);
    sy = 0;
  } else {
    sw = originalWidth;
    sh = Math.round(originalWidth / targetAspectRatio);
    sx = 0;
    sy = Math.round((originalHeight - sh) / 2);
  }

  return { sx, sy, sw, sh };
}

/**
 * 品質パラメータを圧縮レベルに変換
 */
function qualityToCompressionLevel(quality: number): number {
  return Math.round(((quality - 50) / 50) * 5) + 1;
}

/**
 * OffscreenCanvasを指定形式のBlobに変換
 */
async function convertCanvasToBlob(
  canvas: OffscreenCanvas,
  format: string,
  quality: number
): Promise<Blob> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // AVIF形式
  if (format === 'AVIF') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const avifData = await encodeAvif(imageData, { quality });
    return new Blob([avifData], { type: MIME_TYPES[format] });
  }

  // PNG形式
  if (format === 'PNG') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const level = qualityToCompressionLevel(quality);
    const pngData = await optimisePng(imageData, { level });
    return new Blob([pngData], { type: MIME_TYPES[format] });
  }

  // JPEG形式
  const blob = await canvas.convertToBlob({
    type: MIME_TYPES[format],
    quality: quality / 100,
  });
  return blob;
}

/**
 * 画像を処理（クロップ、リサイズ、エンコード）
 */
async function processImage(request: ProcessImageRequest) {
  const { id, file, settings } = request;

  try {
    // 1. 画像を読み込み
    reportProgress(id, 10, 'loading');
    const bitmap = await loadImage(file);
    const originalWidth = bitmap.width;
    const originalHeight = bitmap.height;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = originalWidth;
    let sourceHeight = originalHeight;
    let cropped = false;

    // 2. クロップ処理
    if (settings.sizeMode === 'PRESET' && settings.crop.enabled) {
      reportProgress(id, 20, 'cropping');
      const aspectRatio = CropAspectRatio[settings.crop.aspectRatio];
      const cropSize = calculateCropSize(originalWidth, originalHeight, aspectRatio);
      sourceX = cropSize.sx;
      sourceY = cropSize.sy;
      sourceWidth = cropSize.sw;
      sourceHeight = cropSize.sh;
      cropped = true;
    }

    // 3. リサイズサイズを計算
    reportProgress(id, 30, 'resizing');
    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    if (settings.resizeEnabled) {
      const resized = calculateResizeSize(sourceWidth, sourceHeight, settings.maxSize);
      targetWidth = resized.width;
      targetHeight = resized.height;
    }

    // 4. メイン画像をOffscreenCanvasで描画
    const mainCanvas = new OffscreenCanvas(targetWidth, targetHeight);
    const mainCtx = mainCanvas.getContext('2d');
    if (!mainCtx) {
      throw new Error('Canvas context not available');
    }
    mainCtx.drawImage(
      bitmap,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    );

    // 5. エンコード
    reportProgress(id, 50, 'encoding');
    const resizedBlob = await convertCanvasToBlob(
      mainCanvas,
      settings.outputFormat,
      settings.quality
    );

    // 6. サムネイル生成
    reportProgress(id, 80, 'thumbnail');
    const thumbSize = calculateResizeSize(originalWidth, originalHeight, THUMBNAIL_SIZE);
    const thumbCanvas = new OffscreenCanvas(thumbSize.width, thumbSize.height);
    const thumbCtx = thumbCanvas.getContext('2d');
    if (!thumbCtx) {
      throw new Error('Thumbnail canvas context not available');
    }
    thumbCtx.drawImage(bitmap, 0, 0, thumbSize.width, thumbSize.height);
    const thumbnailBlob = await convertCanvasToBlob(
      thumbCanvas,
      settings.outputFormat,
      settings.quality
    );

    // 7. 結果を返す
    reportProgress(id, 100, 'encoding');
    postMessage({
      type: 'result',
      id,
      resizedBlob,
      thumbnailBlob,
      originalWidth,
      originalHeight,
      width: targetWidth,
      height: targetHeight,
      cropped,
    });
  } catch (error) {
    postMessage({
      type: 'error',
      id,
      message: error instanceof Error ? error.message : '画像の処理に失敗しました',
    });
  }
}

// メッセージハンドラ
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;

  switch (request.type) {
    case 'processImage':
      await processImage(request);
      break;
  }
};

export {};
