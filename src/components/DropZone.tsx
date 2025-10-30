import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateFiles } from '../utils/fileValidator';

interface DropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  onFilesRejected?: (files: { file: File; errors: string[] }[]) => void;
}

export function DropZone({ onFilesAccepted, onFilesRejected }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const { validFiles, invalidFiles } = validateFiles(acceptedFiles);

      if (validFiles.length > 0) {
        onFilesAccepted(validFiles);
      }

      if (invalidFiles.length > 0 && onFilesRejected) {
        onFilesRejected(invalidFiles);
      }
    },
    [onFilesAccepted, onFilesRejected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 min-h-[300px] flex items-center justify-center text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-golden bg-golden-light/30'
          : 'border-gray-300 hover:border-orange bg-white'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <svg
          className={`mx-auto h-16 w-16 transition-colors ${
            isDragActive ? 'text-golden' : 'text-gray-400'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg text-golden font-medium">
            ドロップして画像を追加
          </p>
        ) : (
          <>
            <p className="text-lg text-gray-700 font-medium">
              画像をドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-500">
              または
              <span className="text-golden font-medium ml-1">
                クリックして選択
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              対応形式: JPEG、PNG、WebP、GIF（最大1GB）
            </p>
          </>
        )}
      </div>
    </div>
  );
}
