import type { OutputFormat } from '../types';
import { FILE_EXTENSIONS } from '../types';

/**
 * バイト数を適切な単位にフォーマット
 * @param bytes バイト数
 * @returns フォーマットされた文字列（例: "1.2 MB"）
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  const value = Math.max(0, bytes);
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 出力形式から拡張子を取得
 * @param format 出力形式
 * @returns 拡張子（例: ".jpg"）
 */
export function getExtensionFromFormat(format: OutputFormat): string {
  return FILE_EXTENSIONS[format];
}

