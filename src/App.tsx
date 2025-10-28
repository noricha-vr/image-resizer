import { useEffect } from 'react';
import { SEOHead } from './components/SEOHead';
import { DropZone } from './components/DropZone';
import { SettingsPanel } from './components/SettingsPanel';
import { ProcessingStatus } from './components/ProcessingStatus';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useImageProcessor } from './hooks/useImageProcessor';

function App() {
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
      <div className="min-h-screen bg-white flex flex-col">
        {/* ヘッダー */}
        <header className="bg-golden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="リサイズくん ロゴ"
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-white">リサイズくん</h1>
            </div>
            <p className="text-sm text-white/90">
              ブラウザ完結・プライバシー保護 | JPEG / PNG / AVIF
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
      </main>

      {/* フッター */}
      <footer className="bg-golden border-t border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-white/90">
            <p>&copy; 2025 リサイズくん. All rights reserved.</p>
            <p>Chrome推奨 | サーバーアップロード不要</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;
