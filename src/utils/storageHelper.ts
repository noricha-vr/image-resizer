import type { ResizeSettings, CropAspectRatioKey } from '../types';
import {
  DEFAULT_SETTINGS,
  OutputFormat,
  SizeMode,
  CropAspectRatio,
} from '../types';

const STORAGE_KEY = 'imageResizerSettings';

/**
 * 設定をlocalStorageに保存
 */
export function saveSettings(settings: ResizeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

/**
 * localStorageから設定を読み込み
 */
export function loadSettings(): ResizeSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved);

    // バリデーション: 必須フィールドのチェック
    const settings: ResizeSettings = {
      resizeEnabled:
        typeof parsed.resizeEnabled === 'boolean'
          ? parsed.resizeEnabled
          : DEFAULT_SETTINGS.resizeEnabled,
      maxSize:
        typeof parsed.maxSize === 'number' &&
        parsed.maxSize >= 10 &&
        parsed.maxSize <= 3840
          ? parsed.maxSize
          : DEFAULT_SETTINGS.maxSize,
      quality:
        typeof parsed.quality === 'number' &&
        parsed.quality >= 50 &&
        parsed.quality <= 100
          ? parsed.quality
          : DEFAULT_SETTINGS.quality,
      outputFormat:
        Object.values(OutputFormat).includes(parsed.outputFormat)
          ? parsed.outputFormat
          : DEFAULT_SETTINGS.outputFormat,
      sizeMode:
        Object.values(SizeMode).includes(parsed.sizeMode)
          ? parsed.sizeMode
          : DEFAULT_SETTINGS.sizeMode,
      crop: {
        enabled:
          typeof parsed.crop?.enabled === 'boolean'
            ? parsed.crop.enabled
            : DEFAULT_SETTINGS.crop.enabled,
        aspectRatio:
          parsed.crop?.aspectRatio &&
          Object.keys(CropAspectRatio).includes(parsed.crop.aspectRatio)
            ? (parsed.crop.aspectRatio as CropAspectRatioKey)
            : DEFAULT_SETTINGS.crop.aspectRatio,
      },
      autoDownload:
        typeof parsed.autoDownload === 'boolean'
          ? parsed.autoDownload
          : DEFAULT_SETTINGS.autoDownload,
    };

    return settings;
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 設定をデフォルトにリセット
 */
export function resetSettings(): ResizeSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * localStorageが利用可能かチェック
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
