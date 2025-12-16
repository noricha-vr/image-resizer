import { useState, useEffect } from 'react';
import type { ResizeSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { loadSettings, saveSettings } from '../utils/storageHelper';

/**
 * localStorage管理カスタムフック（SSR対応）
 *
 * 初期値はDEFAULT_SETTINGSを使用し、クライアントサイドでlocalStorageから読み込む。
 */
export function useLocalStorage() {
  const [settings, setSettings] = useState<ResizeSettings>(DEFAULT_SETTINGS);

  // 設定を更新してlocalStorageに保存
  const updateSettings = (newSettings: ResizeSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // クライアントサイドでのみlocalStorageから読み込み
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  return {
    settings,
    updateSettings,
  };
}
