import type { ProcessedImage, OutputFormat } from '../types';
import { FILE_EXTENSIONS } from '../types';

/**
 * ファイル名から拡張子を除去
 */
export function removeFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName;
  return fileName.substring(0, lastDotIndex);
}

/**
 * リサイズ後のファイル名を生成
 */
export function generateFileName(
  originalName: string,
  maxSize: number,
  format: OutputFormat
): string {
  const nameWithoutExt = removeFileExtension(originalName);
  const extension = FILE_EXTENSIONS[format];
  return `${nameWithoutExt}_${maxSize}px${extension}`;
}

/**
 * Blobからダウンロード可能なURLを生成
 */
export function createDownloadUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * URLをrevoke（メモリリーク防止）
 */
export function revokeUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * 単一ファイルをダウンロード
 */
export function downloadSingle(
  blob: Blob,
  fileName: string
): void {
  const url = createDownloadUrl(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // URLをrevoke
  setTimeout(() => revokeUrl(url), 100);
}

/**
 * 処理済み画像をダウンロード
 */
export function downloadProcessedImage(
  image: ProcessedImage,
  maxSize: number
): void {
  const fileName = generateFileName(
    image.originalFile.name,
    maxSize,
    image.outputFormat
  );
  downloadSingle(image.resizedBlob, fileName);
}

/**
 * 複数ファイルを個別にダウンロード
 * （注: 一括ダウンロードはブラウザのポップアップブロックの問題があるため、
 * ユーザーアクション1回につき1ファイルずつダウンロードすることを推奨）
 */
export function downloadAll(
  images: ProcessedImage[],
  maxSize: number
): void {
  images.forEach((image, index) => {
    setTimeout(() => {
      downloadProcessedImage(image, maxSize);
    }, index * 100); // 100msずつ遅延させて順次ダウンロード
  });
}

/**
 * ProcessedImageのURL群をクリーンアップ
 */
export function cleanupProcessedImage(image: ProcessedImage): void {
  if (image.downloadUrl) {
    revokeUrl(image.downloadUrl);
  }
  if (image.thumbnailUrl) {
    revokeUrl(image.thumbnailUrl);
  }
}

/**
 * 複数のProcessedImageをクリーンアップ
 */
export function cleanupProcessedImages(images: ProcessedImage[]): void {
  images.forEach(cleanupProcessedImage);
}
