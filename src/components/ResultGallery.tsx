import type { ProcessedImage } from '../types';
import { downloadProcessedImage, downloadAll } from '../utils/downloadHelper';

interface ResultGalleryProps {
  results: ProcessedImage[];
  maxSize: number;
  onRemove?: (id: string) => void;
}

export function ResultGallery({
  results,
  maxSize,
  onRemove,
}: ResultGalleryProps) {
  if (results.length === 0) {
    return null;
  }

  const handleDownloadAll = () => {
    downloadAll(results, maxSize);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          処理結果 ({results.length}件)
        </h3>
        {results.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2 bg-golden text-white rounded-md hover:bg-orange transition-colors text-sm font-medium"
          >
            すべてダウンロード
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((image) => (
          <div
            key={image.id}
            className="bg-gray-50 rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow"
          >
            {/* サムネイル */}
            <div className="aspect-square bg-gray-200 rounded-md overflow-hidden">
              <img
                src={image.thumbnailUrl}
                alt={image.originalFile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* ファイル情報 */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900 truncate">
                {image.originalFile.name}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {image.width} × {image.height}
                </span>
                <span className="px-2 py-0.5 bg-golden-light text-golden-dark rounded font-medium">
                  {image.outputFormat}
                </span>
              </div>
            </div>

            {/* アクション */}
            <div className="flex space-x-2">
              <button
                onClick={() => downloadProcessedImage(image, maxSize)}
                className="flex-1 px-3 py-1.5 bg-golden text-white rounded text-xs font-medium hover:bg-orange transition-colors"
              >
                ダウンロード
              </button>
              {onRemove && (
                <button
                  onClick={() => onRemove(image.id)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-red hover:text-white transition-colors"
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
