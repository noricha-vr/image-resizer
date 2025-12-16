import type { OutputFormat, SizeMode, CropAspectRatioKey } from '../types';

/**
 * Worker に送信する処理リクエスト
 */
export interface ProcessImageRequest {
  type: 'processImage';
  id: string;
  file: File;
  settings: {
    resizeEnabled: boolean;
    maxSize: number;
    quality: number;
    outputFormat: OutputFormat;
    sizeMode: SizeMode;
    crop: {
      enabled: boolean;
      aspectRatio: CropAspectRatioKey;
    };
  };
}

/**
 * Worker からの進捗通知
 */
export interface ProcessImageProgress {
  type: 'progress';
  id: string;
  progress: number;
  stage: 'loading' | 'cropping' | 'resizing' | 'encoding' | 'thumbnail';
}

/**
 * Worker からの処理完了通知
 */
export interface ProcessImageResult {
  type: 'result';
  id: string;
  resizedBlob: Blob;
  thumbnailBlob: Blob;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  cropped: boolean;
}

/**
 * Worker からのエラー通知
 */
export interface ProcessImageError {
  type: 'error';
  id: string;
  message: string;
}

export type WorkerRequest = ProcessImageRequest;
export type WorkerResponse = ProcessImageProgress | ProcessImageResult | ProcessImageError;
