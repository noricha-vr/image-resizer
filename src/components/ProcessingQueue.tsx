import type { ImageFile } from '../types';
import { ProcessingStatus } from '../types';

interface ProcessingQueueProps {
  queue: ImageFile[];
}

export function ProcessingQueue({ queue }: ProcessingQueueProps) {
  if (queue.length === 0) {
    return null;
  }

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.WAITING:
        return 'text-gray-500';
      case ProcessingStatus.PROCESSING:
        return 'text-orange';
      case ProcessingStatus.COMPLETED:
        return 'text-golden';
      case ProcessingStatus.ERROR:
        return 'text-red';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.WAITING:
        return '待機中';
      case ProcessingStatus.PROCESSING:
        return '処理中';
      case ProcessingStatus.COMPLETED:
        return '完了';
      case ProcessingStatus.ERROR:
        return 'エラー';
      default:
        return '不明';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        処理キュー ({queue.length}件)
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queue.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
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
              {item.status === ProcessingStatus.PROCESSING && (
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
        ))}
      </div>
    </div>
  );
}
