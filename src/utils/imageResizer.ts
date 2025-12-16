import type { ResizeSettings } from '../types';
import {
  OutputFormat,
  MIME_TYPES,
  THUMBNAIL_SIZE,
  SizeMode,
  CropAspectRatio,
} from '../types';
import { encode as encodeAvif } from '@jsquash/avif';
import { optimise as optimisePng } from '@jsquash/oxipng';

/**
 * アスペクト比を維持したリサイズサイズを計算
 */
export function calculateResizeSize(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // 画像が最大サイズより大きい場合のみリサイズ
  if (originalWidth > maxSize || originalHeight > maxSize) {
    if (aspectRatio > 1) {
      // 横長の画像
      newWidth = maxSize;
      newHeight = Math.round(maxSize / aspectRatio);
    } else {
      // 縦長の画像
      newHeight = maxSize;
      newWidth = Math.round(maxSize * aspectRatio);
    }
  }

  return { width: newWidth, height: newHeight };
}

/**
 * 画像をCanvasに読み込み
 */
export async function loadImageToCanvas(
  file: File
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      resolve({
        canvas,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Canvasを指定サイズにリサイズ
 */
export function resizeCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  return canvas;
}

/**
 * 中央クロップのサイズと座標を計算
 */
export function calculateCropSize(
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
    // 元画像の方が横長 → 左右をカット
    sh = originalHeight;
    sw = Math.round(originalHeight * targetAspectRatio);
    sx = Math.round((originalWidth - sw) / 2);
    sy = 0;
  } else {
    // 元画像の方が縦長 → 上下をカット
    sw = originalWidth;
    sh = Math.round(originalWidth / targetAspectRatio);
    sx = 0;
    sy = Math.round((originalHeight - sh) / 2);
  }

  return { sx, sy, sw, sh };
}

/**
 * Canvasを指定アスペクト比で中央クロップ
 */
export function cropCanvas(
  sourceCanvas: HTMLCanvasElement,
  aspectRatio: { width: number; height: number }
): HTMLCanvasElement {
  const { sx, sy, sw, sh } = calculateCropSize(
    sourceCanvas.width,
    sourceCanvas.height,
    aspectRatio
  );

  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  return canvas;
}

/**
 * 品質パラメータ（50-100%）を@jsquash/pngのlevel（1-6）に変換
 * 50% → level 1 (最速、最小圧縮)
 * 100% → level 6 (最遅、最大圧縮)
 */
function qualityToCompressionLevel(quality: number): number {
  return Math.round(((quality - 50) / 50) * 5) + 1;
}

/**
 * Canvasを指定形式のBlobに変換
 */
export async function convertCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // AVIF形式の場合は@jsquash/avifを使用
  if (format === OutputFormat.AVIF) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const avifData = await encodeAvif(imageData, { quality });
    return new Blob([avifData], { type: MIME_TYPES[format] });
  }

  // PNG形式の場合は@jsquash/oxipngを使用
  if (format === OutputFormat.PNG) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const level = qualityToCompressionLevel(quality);
    console.log(`PNG compression - quality: ${quality}%, level: ${level}`);
    const pngData = await optimisePng(imageData, { level });
    console.log(`PNG output size: ${pngData.byteLength} bytes`);
    return new Blob([pngData], { type: MIME_TYPES[format] });
  }

  // JPEG形式は従来通りCanvas APIを使用
  return new Promise((resolve, reject) => {
    const mimeType = MIME_TYPES[format];
    const qualityValue = quality / 100;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      qualityValue
    );
  });
}

/**
 * 画像をリサイズして指定形式に変換
 */
export async function resizeImage(
  file: File,
  settings: ResizeSettings
): Promise<{
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  cropped: boolean;
}> {
  // 画像をCanvasに読み込み
  const { canvas, width, height } = await loadImageToCanvas(file);
  const originalWidth = width;
  const originalHeight = height;

  let targetCanvas = canvas;
  let cropped = false;

  // クロップ処理（規格サイズモード && クロップ有効時のみ）
  if (settings.sizeMode === SizeMode.PRESET && settings.crop.enabled) {
    const aspectRatio = CropAspectRatio[settings.crop.aspectRatio];
    targetCanvas = cropCanvas(targetCanvas, aspectRatio);
    cropped = true;
  }

  // リサイズ処理
  if (settings.resizeEnabled) {
    // リサイズサイズを計算
    const { width: newWidth, height: newHeight } = calculateResizeSize(
      targetCanvas.width,
      targetCanvas.height,
      settings.maxSize
    );

    // リサイズが必要な場合
    if (newWidth !== targetCanvas.width || newHeight !== targetCanvas.height) {
      targetCanvas = resizeCanvas(targetCanvas, newWidth, newHeight);
    }
  }

  // 指定形式のBlobに変換
  const blob = await convertCanvasToBlob(
    targetCanvas,
    settings.outputFormat,
    settings.quality
  );

  return { blob, originalWidth, originalHeight, cropped };
}

/**
 * サムネイルを生成
 */
export async function createThumbnail(
  file: File,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  // 画像をCanvasに読み込み
  const { canvas, width, height } = await loadImageToCanvas(file);

  // サムネイルサイズを計算
  const { width: thumbWidth, height: thumbHeight } = calculateResizeSize(
    width,
    height,
    THUMBNAIL_SIZE
  );

  // サムネイルサイズにリサイズ
  const thumbnailCanvas = resizeCanvas(canvas, thumbWidth, thumbHeight);

  // 指定形式のBlobに変換
  const blob = await convertCanvasToBlob(thumbnailCanvas, format, quality);

  return blob;
}

/**
 * 画像処理のメイン関数
 * リサイズ画像とサムネイルを同時に生成
 */
export async function processImage(
  file: File,
  settings: ResizeSettings
): Promise<{
  resizedBlob: Blob;
  thumbnailBlob: Blob;
  originalWidth: number;
  originalHeight: number;
  cropped: boolean;
}> {
  const [resizedResult, thumbnailBlob] = await Promise.all([
    resizeImage(file, settings),
    createThumbnail(file, settings.outputFormat, settings.quality),
  ]);

  return {
    resizedBlob: resizedResult.blob,
    thumbnailBlob,
    originalWidth: resizedResult.originalWidth,
    originalHeight: resizedResult.originalHeight,
    cropped: resizedResult.cropped,
  };
}
