import type { ImageFile, ProcessedImage } from '../types';
import { ProcessingStatus as Status } from '../types';
import { downloadProcessedImage, downloadAll } from '../utils/downloadHelper';

interface ProcessingStatusProps {
  queue: ImageFile[];
  results: ProcessedImage[];
  maxSize: number;
  onRemove?: (id: string) => void;
  onReset?: () => void;
}

/**
 * 処理キューと処理結果を統合表示するコンポーネント
 */
export function ProcessingStatus({
  queue,
  results,
  maxSize,
  onRemove,
  onReset,
}: ProcessingStatusProps) {
  if (queue.length === 0 && results.length === 0) {
    return null;
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.WAITING:
        return 'text-gray-500';
      case Status.PROCESSING:
        return 'text-orange';
      case Status.COMPLETED:
        return 'text-golden';
      case Status.ERROR:
        return 'text-red';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case Status.WAITING:
        return '待機中';
      case Status.PROCESSING:
        return '処理中';
      case Status.COMPLETED:
        return '完了';
      case Status.ERROR:
        return 'エラー';
      default:
        return '不明';
    }
  };

  const getStatusBgColor = (status: Status) => {
    switch (status) {
      case Status.WAITING:
        return 'bg-gray-100';
      case Status.PROCESSING:
        return 'bg-orange/10';
      case Status.COMPLETED:
        return 'bg-golden/10';
      case Status.ERROR:
        return 'bg-red/10';
      default:
        return 'bg-gray-100';
    }
  };

  // キューと結果を結合してマップを作成
  const resultMap = new Map(results.map((r) => [r.id, r]));

  const handleDownloadAll = () => {
    downloadAll(results, maxSize);
  };

  // 未完了のアイテム数をカウント
  const pendingCount = queue.filter((item) => item.status !== Status.COMPLETED).length;
  const totalCount = pendingCount + results.length;

  return (
    <div className="bg-cream/30 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          処理状況 ({totalCount}件)
        </h3>
        <div className="flex items-center gap-2">
          {onReset && (queue.length > 0 || results.length > 0) && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              リセット
            </button>
          )}
          {results.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-golden text-white rounded-md hover:bg-orange transition-colors text-sm font-medium"
            >
              すべてダウンロード
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* 待機中・処理中のアイテム */}
        {queue
          .filter((item) => item.status !== Status.COMPLETED)
          .map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md ${getStatusBgColor(item.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                  {item.error && (
                    <p className="text-xs text-red mt-1">{item.error}</p>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {item.status === Status.PROCESSING && (
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  <span
                    className={`text-xs font-medium ${getStatusColor(item.status)}`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {/* 完了したアイテム */}
        {queue
          .filter((item) => item.status === Status.COMPLETED)
          .map((item) => {
            const result = resultMap.get(item.id);
            if (!result) return null;

            return (
              <div
                key={item.id}
                className="bg-golden/10 rounded-md p-3 space-y-2"
              >
                <div className="flex items-start gap-3">
                  {/* サムネイル */}
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={result.thumbnailUrl}
                      alt={result.originalFile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* ファイル名 */}
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.originalFile.name}
                    </p>

                    {/* 設定 */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>最大{result.maxSize}px</span>
                      {result.outputFormat !== 'PNG' && (
                        <span>品質{result.quality}%</span>
                      )}
                      <span className="px-2 py-0.5 bg-golden text-white rounded font-medium">
                        {result.outputFormat}
                      </span>
                    </div>

                    {/* 出力後の情報 */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{result.width} × {result.height}</span>
                      <span>•</span>
                      <span>{(result.resizedBlob.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => downloadProcessedImage(result, maxSize)}
                      className="px-3 py-1.5 bg-golden text-white rounded text-xs font-medium hover:bg-orange transition-colors"
                    >
                      ダウンロード
                    </button>
                    {onRemove && (
                      <button
                        onClick={() => onRemove(result.id)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-red hover:text-white transition-colors"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
