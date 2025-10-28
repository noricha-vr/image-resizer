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
        {/* ページタイトルと説明 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            画像リサイズ・圧縮ツール - ブラウザ完結で安心・無料
          </h1>
          <p className="text-gray-600 text-lg">
            サーバーアップロード不要。JPEG/PNG/AVIF形式に対応し、Instagram・SNS最適サイズに一発変換。プライバシー保護で安心してご利用いただけます。
          </p>
        </div>

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
