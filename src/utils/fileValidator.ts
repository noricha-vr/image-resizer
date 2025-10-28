import type { ValidationResult } from '../types';
import { SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../types';

/**
 * 画像ファイルかどうかを判定
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

/**
 * ファイルサイズが制限内かチェック
 */
export function checkFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * ファイルの拡張子をチェック
 */
export function checkFileExtension(file: File): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some((ext) => fileName.endsWith(ext));
}

/**
 * ファイルを検証
 */
export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];

  // ファイルタイプチェック
  if (!isImageFile(file)) {
    errors.push('画像ファイルを選択してください（JPEG、PNG、WebP、GIF）');
  }

  // ファイルサイズチェック
  if (!checkFileSize(file)) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    errors.push(`ファイルサイズが大きすぎます（最大${maxSizeMB}MB）`);
  }

  // 拡張子チェック
  if (!checkFileExtension(file)) {
    errors.push('サポートされていないファイル形式です');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 複数ファイルを検証
 */
export function validateFiles(files: File[]): {
  validFiles: File[];
  invalidFiles: { file: File; errors: string[] }[];
} {
  const validFiles: File[] = [];
  const invalidFiles: { file: File; errors: string[] }[] = [];

  files.forEach((file) => {
    const result = validateFile(file);
    if (result.isValid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({ file, errors: result.errors });
    }
  });

  return { validFiles, invalidFiles };
}
