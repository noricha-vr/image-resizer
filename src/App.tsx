import { useEffect } from 'react';
import { SEOHead } from './components/SEOHead';
import { DropZone } from './components/DropZone';
import { SettingsPanel } from './components/SettingsPanel';
import { ProcessingQueue } from './components/ProcessingQueue';
import { ResultGallery } from './components/ResultGallery';
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
      <div className="min-h-screen bg-cream flex flex-col">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Image Resizer</h1>
            <p className="text-sm text-gray-500">
              画像を簡単にリサイズ | JPEG / PNG / AVIF
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: アップロードエリアと設定 */}
          <div className="lg:col-span-2 space-y-6">
            <DropZone
              onFilesAccepted={handleFilesAccepted}
              onFilesRejected={handleFilesRejected}
            />
            <ProcessingQueue queue={queue} />
            <ResultGallery
              results={results}
              maxSize={settings.maxSize}
              onRemove={removeResult}
            />
          </div>

          {/* 右カラム: 設定パネル */}
          <div className="space-y-6">
            <SettingsPanel settings={settings} onChange={updateSettings} />

            {/* リセットボタン */}
            {(queue.length > 0 || results.length > 0) && (
              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-red text-white rounded-md hover:bg-red-dark transition-colors font-medium"
              >
                すべてリセット
              </button>
            )}

            {/* 統計情報 */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  統計
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>処理済み:</span>
                    <span className="font-medium">{results.length}件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>待機中:</span>
                    <span className="font-medium">
                      {
                        queue.filter((item) => item.status === 'WAITING').length
                      }
                      件
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>エラー:</span>
                    <span className="font-medium text-red">
                      {queue.filter((item) => item.status === 'ERROR').length}件
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>&copy; 2025 Image Resizer. All rights reserved.</p>
            <p>Chrome推奨 | ブラウザ完結処理</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;
