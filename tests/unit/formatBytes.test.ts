import { describe, it, expect } from 'vitest';
import { formatBytes, getExtensionFromFormat } from '../../src/utils/size';
import { OutputFormat } from '../../src/types';

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0.0 B');
    expect(formatBytes(500)).toBe('500.0 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.0 GB');
  });

  it('should handle large values', () => {
    expect(formatBytes(1024 * 1024 * 1024 * 2)).toBe('2.0 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1.5)).toBe('1.5 GB');
  });

  it('should handle negative values', () => {
    expect(formatBytes(-100)).toBe('0.0 B');
    expect(formatBytes(-1024)).toBe('0.0 B');
  });

  it('should format decimal values correctly', () => {
    expect(formatBytes(512)).toBe('512.0 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1536.5)).toBe('1.5 KB');
    expect(formatBytes(1048576.5)).toBe('1.0 MB');
  });
});

describe('getExtensionFromFormat', () => {
  it('should return correct extension for JPEG', () => {
    expect(getExtensionFromFormat(OutputFormat.JPEG)).toBe('.jpg');
  });

  it('should return correct extension for PNG', () => {
    expect(getExtensionFromFormat(OutputFormat.PNG)).toBe('.png');
  });

  it('should return correct extension for AVIF', () => {
    expect(getExtensionFromFormat(OutputFormat.AVIF)).toBe('.avif');
  });
});

