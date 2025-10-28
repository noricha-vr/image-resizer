import { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { DropZone } from '../components/DropZone';
import { SettingsPanel } from '../components/SettingsPanel';
import { ProcessingStatus } from '../components/ProcessingStatus';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useImageProcessor } from '../hooks/useImageProcessor';

/**
 * ホームページコンポーネント
 * 画像リサイズのメイン機能を提供
 */
export function Home() {
  const { settings, updateSettings } = useLocalStorage();
  const {
    queue,
    results,
    isProcessing,
    addToQueue,
    processQueue,
    reset,
    removeResult,
  } = useImageProcessor(settings);

  // ファイルが追加されたら自動的に処理を開始
  useEffect(() => {
    if (queue.length > 0 && !isProcessing) {
      processQueue();
    }
  }, [queue.length, isProcessing, processQueue]);

  const handleFilesAccepted = (files: File[]) => {
    addToQueue(files);
  };

  const handleFilesRejected = (
    invalidFiles: { file: File; errors: string[] }[]
  ) => {
    invalidFiles.forEach(({ file, errors }) => {
      console.error(`Failed to process ${file.name}:`, errors);
      alert(`${file.name}: ${errors.join(', ')}`);
    });
  };

  return (
    <>
      <SEOHead />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: アップロードエリアと処理状況 */}
          <div className="lg:col-span-2 space-y-6">
            <DropZone
              onFilesAccepted={handleFilesAccepted}
              onFilesRejected={handleFilesRejected}
            />
            <ProcessingStatus
              queue={queue}
              results={results}
              maxSize={settings.maxSize}
              onRemove={removeResult}
              onReset={reset}
            />
          </div>

          {/* 右カラム: 設定パネル */}
          <div className="space-y-6">
            <SettingsPanel settings={settings} onChange={updateSettings} />
          </div>
        </div>
      </div>
    </>
  );
}
