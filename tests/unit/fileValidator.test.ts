import { describe, it, expect } from 'vitest';
import {
  isImageFile,
  checkFileSize,
  checkFileExtension,
  validateFile,
  validateFiles,
} from '../../src/utils/fileValidator';
import { MAX_FILE_SIZE } from '../../src/types';

/**
 * テスト用のFileオブジェクトを作成するヘルパー関数
 */
function makeFile(name: string, type: string, sizeBytes = 1024): File {
  const blob = new Blob([new Uint8Array(sizeBytes)], { type });
  return new File([blob], name, { type });
}

describe('fileValidator', () => {
  describe('isImageFile', () => {
    it('画像MIMEタイプを正しく判定できる', () => {
      expect(isImageFile(makeFile('a.jpg', 'image/jpeg'))).toBe(true);
      expect(isImageFile(makeFile('a.png', 'image/png'))).toBe(true);
      expect(isImageFile(makeFile('a.webp', 'image/webp'))).toBe(true);
      expect(isImageFile(makeFile('a.gif', 'image/gif'))).toBe(true);
      expect(isImageFile(makeFile('a.txt', 'text/plain'))).toBe(false);
      expect(isImageFile(makeFile('a.pdf', 'application/pdf'))).toBe(false);
    });
  });

  describe('checkFileSize', () => {
    it('ファイルサイズが上限内の場合はtrueを返す', () => {
      const smallFile = makeFile('small.jpg', 'image/jpeg', 1024);
      expect(checkFileSize(smallFile)).toBe(true);
    });

    it('ファイルサイズが上限ちょうどの場合はtrueを返す', () => {
      const maxFile = makeFile('max.jpg', 'image/jpeg', MAX_FILE_SIZE);
      expect(checkFileSize(maxFile)).toBe(true);
    });

    it('ファイルサイズが上限を超える場合はfalseを返す', () => {
      const largeFile = makeFile('large.jpg', 'image/jpeg', MAX_FILE_SIZE + 1);
      expect(checkFileSize(largeFile)).toBe(false);
    });
  });

  describe('checkFileExtension', () => {
    it('有効な拡張子を正しく判定できる', () => {
      expect(checkFileExtension(makeFile('a.jpg', 'image/jpeg'))).toBe(true);
      expect(checkFileExtension(makeFile('a.JPEG', 'image/jpeg'))).toBe(true);
      expect(checkFileExtension(makeFile('a.PNG', 'image/png'))).toBe(true);
      expect(checkFileExtension(makeFile('a.webp', 'image/webp'))).toBe(true);
      expect(checkFileExtension(makeFile('a.gif', 'image/gif'))).toBe(true);
    });

    it('無効な拡張子の場合はfalseを返す', () => {
      expect(checkFileExtension(makeFile('a.pdf', 'application/pdf'))).toBe(
        false
      );
      expect(checkFileExtension(makeFile('a.txt', 'text/plain'))).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('有効な画像ファイルはisValid=trueになる', () => {
      const validFile = makeFile('pic.webp', 'image/webp', 2048);
      const result = validateFile(validFile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('無効なMIMEタイプの場合はエラーを返す', () => {
      const invalidFile = makeFile('doc.pdf', 'application/pdf', 1024);
      const result = validateFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        '画像ファイルを選択してください（JPEG、PNG、WebP、GIF）'
      );
    });

    it('ファイルサイズが大きすぎる場合はエラーを返す', () => {
      const largeFile = makeFile(
        'large.jpg',
        'image/jpeg',
        MAX_FILE_SIZE + 1
      );
      const result = validateFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ファイルサイズが大きすぎます（最大10MB）');
    });

    it('複数のエラーがある場合は全て含まれる', () => {
      const invalidFile = makeFile('doc.pdf', 'application/pdf', MAX_FILE_SIZE + 1);
      const result = validateFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateFiles', () => {
    it('複数のファイルを正しく検証できる', () => {
      const validFile = makeFile('pic1.jpg', 'image/jpeg', 1024);
      const invalidFile = makeFile('doc.pdf', 'application/pdf', 1024);
      const result = validateFiles([validFile, invalidFile]);

      expect(result.validFiles).toHaveLength(1);
      expect(result.validFiles[0]).toBe(validFile);
      expect(result.invalidFiles).toHaveLength(1);
      expect(result.invalidFiles[0].file).toBe(invalidFile);
    });

    it('全て有効なファイルの場合は全てvalidFilesに含まれる', () => {
      const file1 = makeFile('pic1.jpg', 'image/jpeg', 1024);
      const file2 = makeFile('pic2.png', 'image/png', 2048);
      const result = validateFiles([file1, file2]);

      expect(result.validFiles).toHaveLength(2);
      expect(result.invalidFiles).toHaveLength(0);
    });
  });
});
