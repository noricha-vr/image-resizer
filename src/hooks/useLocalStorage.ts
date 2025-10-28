import { useState, useEffect } from 'react';
import type { ResizeSettings } from '../types';
import { loadSettings, saveSettings } from '../utils/storageHelper';

/**
 * localStorage管理カスタムフック
 */
export function useLocalStorage() {
  const [settings, setSettings] = useState<ResizeSettings>(loadSettings());

  // 設定を更新してlocalStorageに保存
  const updateSettings = (newSettings: ResizeSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // 初回マウント時にlocalStorageから読み込み
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  return {
    settings,
    updateSettings,
  };
}
