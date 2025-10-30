/**
 * 出力形式
 */
export const OutputFormat = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  AVIF: 'AVIF',
} as const;

export type OutputFormat = (typeof OutputFormat)[keyof typeof OutputFormat];

/**
 * 処理ステータス
 */
export const ProcessingStatus = {
  WAITING: 'WAITING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type ProcessingStatus =
  (typeof ProcessingStatus)[keyof typeof ProcessingStatus];

/**
 * 画像ファイル情報
 */
export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: ProcessingStatus;
  progress: number;
  error?: string;
}

/**
 * 処理済み画像情報
 */
export interface ProcessedImage {
  id: string;
  originalFile: ImageFile;
  resizedBlob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  downloadUrl: string;
  thumbnailUrl: string;
  outputFormat: OutputFormat;
  resizeEnabled: boolean;
  maxSize: number;
  quality: number;
}

/**
 * リサイズ設定
 */
export interface ResizeSettings {
  resizeEnabled: boolean;
  maxSize: number;
  quality: number;
  outputFormat: OutputFormat;
}

/**
 * ファイル検証結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * MIMEタイプマッピング
 */
export const MIME_TYPES: Record<OutputFormat, string> = {
  [OutputFormat.JPEG]: 'image/jpeg',
  [OutputFormat.PNG]: 'image/png',
  [OutputFormat.AVIF]: 'image/avif',
};

/**
 * ファイル拡張子マッピング
 */
export const FILE_EXTENSIONS: Record<OutputFormat, string> = {
  [OutputFormat.JPEG]: '.jpg',
  [OutputFormat.PNG]: '.png',
  [OutputFormat.AVIF]: '.avif',
};

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: ResizeSettings = {
  resizeEnabled: true,
  maxSize: 720,
  quality: 80,
  outputFormat: OutputFormat.JPEG,
};

/**
 * ファイルサイズの上限（1GB）
 */
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;

/**
 * サムネイルサイズ
 */
export const THUMBNAIL_SIZE = 150;

/**
 * サポートされている入力画像形式
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];
