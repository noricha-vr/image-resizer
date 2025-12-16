import type { ImageFile, ProcessedImage, OutputFormat } from '../types';
import { ProcessingStatus as Status, FILE_EXTENSIONS, OutputFormat as Format } from '../types';
import { downloadProcessedImage, downloadAll, removeFileExtension } from '../utils/downloadHelper';
import { formatBytes } from '../utils/size';

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

  const getFormatBadgeColor = (format: OutputFormat) => {
    switch (format) {
      case Format.JPEG:
        return 'bg-golden';
      case Format.PNG:
        return 'bg-teal';
      case Format.AVIF:
        return 'bg-orange';
      default:
        return 'bg-golden';
    }
  };

  const handleDownloadAll = () => {
    downloadAll(results, maxSize);
  };

  // 未完了のアイテム数をカウント
  const pendingCount = queue.filter((item) => item.status !== Status.COMPLETED).length;
  const totalCount = pendingCount + results.length;

  return (
    <div className="bg-cream/30 rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            処理結果 ({totalCount}件)
          </h3>
          <div className="flex gap-2">
            {onReset && (queue.length > 0 || results.length > 0) && (
              <button
                onClick={onReset}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                リセット
              </button>
            )}
            {results.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="flex-1 sm:flex-none px-4 py-2 bg-golden text-white rounded-md hover:bg-orange transition-colors text-sm font-medium"
              >
                すべてダウンロード
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* 待機中・処理中のアイテム */}
        {queue
          .filter((item) => item.status !== Status.COMPLETED)
          .slice()
          .reverse()
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
                    {formatBytes(item.size)}
                  </p>
                  {item.error && (
                    <p className="text-xs text-red mt-1">{item.error}</p>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {item.status === Status.PROCESSING && (
                    <svg
                      className="animate-spin h-4 w-4 text-orange"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
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
        {results
          .slice()
          .reverse()
          .map((result) => (
            <div
              key={result.id}
              className="bg-golden/10 rounded-md p-3"
            >
              <div className="flex flex-col sm:flex-row items-start gap-3">
                {/* サムネイルと情報 */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* サムネイル */}
                  <div className="w-20 h-20 sm:w-25 sm:h-25 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={result.thumbnailUrl}
                      alt={result.originalFile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    {/* 形式バッジ */}
                    <div className="mb-1">
                      <span className={`px-2 py-0.5 text-white rounded font-medium text-xs sm:text-sm inline-block ${getFormatBadgeColor(result.outputFormat)}`}>
                        {result.outputFormat}
                      </span>
                    </div>

                    {/* ファイル名（変換後の拡張子で表示） */}
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate mb-1">
                      {removeFileExtension(result.originalFile.name)}{FILE_EXTENSIONS[result.outputFormat]}
                    </p>

                    {/* 元画像の縦横px → 変換後の縦横px */}
                    <div className="text-xs sm:text-sm text-gray-600 mb-0.5">
                      {result.originalWidth === result.width && result.originalHeight === result.height ? (
                        <span>
                          {result.originalWidth} × {result.originalHeight}
                        </span>
                      ) : (
                        <span>
                          {result.originalWidth} × {result.originalHeight} → {result.width} × {result.height}
                        </span>
                      )}
                    </div>

                    {/* 元画像のファイルサイズ → 変換後画像のファイルサイズ（減少率%） */}
                    <div className="text-xs sm:text-sm text-gray-700">
                      {(() => {
                        const originalSize = result.originalFile.size;
                        const resultSize = result.resizedBlob.size;
                        const reduction =
                          originalSize > 0
                            ? ((1 - resultSize / originalSize) * 100).toFixed(1)
                            : '0.0';
                        return (
                          <>
                            <span>
                              {formatBytes(originalSize)} → <span className="text-gray-900 font-semibold">{formatBytes(resultSize)}</span>
                            </span>
                            <span className="text-orange font-semibold ml-1">
                              （-{reduction}%）
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* アクションボタン - モバイルは横並び、PCは縦並び */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto sm:min-w-[100px]">
                  <button
                    onClick={() => downloadProcessedImage(result, maxSize)}
                    className="flex-1 sm:flex-none px-2 py-1 sm:py-1.5 bg-golden text-white rounded text-xs font-medium hover:bg-orange transition-colors"
                  >
                    ダウンロード
                  </button>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(result.id)}
                      className="flex-1 sm:flex-none px-2 py-1 sm:py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-red hover:text-white transition-colors"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
            ))}
      </div>
    </div>
  );
}
