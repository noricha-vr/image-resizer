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
 * サイズ選択モード
 */
export const SizeMode = {
  SLIDER: 'SLIDER',
  PRESET: 'PRESET',
} as const;

export type SizeMode = (typeof SizeMode)[keyof typeof SizeMode];

/**
 * プリセットサイズ（長辺のピクセル数）
 */
export const PresetSize = {
  SD: 640,
  HD: 1280,
  FHD: 1920,
  '2K': 2560,
  '4K': 3840,
} as const;

export type PresetSizeKey = keyof typeof PresetSize;
export type PresetSizeValue = (typeof PresetSize)[PresetSizeKey];

/**
 * クロップ用アスペクト比
 */
export const CropAspectRatio = {
  '16:9': { width: 16, height: 9 },
  '4:3': { width: 4, height: 3 },
  '1:1': { width: 1, height: 1 },
  '9:16': { width: 9, height: 16 },
} as const;

export type CropAspectRatioKey = keyof typeof CropAspectRatio;

/**
 * クロップ設定
 */
export interface CropSettings {
  enabled: boolean;
  aspectRatio: CropAspectRatioKey;
}

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
  cropped: boolean;
  cropAspectRatio?: CropAspectRatioKey;
}

/**
 * リサイズ設定
 */
export interface ResizeSettings {
  resizeEnabled: boolean;
  maxSize: number;
  quality: number;
  outputFormat: OutputFormat;
  sizeMode: SizeMode;
  crop: CropSettings;
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
  sizeMode: SizeMode.SLIDER,
  crop: {
    enabled: false,
    aspectRatio: '16:9',
  },
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
