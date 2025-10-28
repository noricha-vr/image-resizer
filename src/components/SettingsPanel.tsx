import type { ResizeSettings } from '../types';
import { OutputFormat } from '../types';

interface SettingsPanelProps {
  settings: ResizeSettings;
  onChange: (settings: ResizeSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const handleMaxSizeChange = (value: string) => {
    const maxSize = parseInt(value);
    if (!isNaN(maxSize) && maxSize > 0) {
      onChange({ ...settings, maxSize });
    }
  };

  const handleQualityChange = (value: string) => {
    const quality = parseInt(value);
    if (!isNaN(quality)) {
      onChange({ ...settings, quality });
    }
  };

  const handleFormatChange = (format: OutputFormat) => {
    onChange({ ...settings, outputFormat: format });
  };

  const isQualityDisabled = settings.outputFormat === OutputFormat.PNG;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">設定</h3>

      {/* 最大サイズ設定 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          最大サイズ (px)
        </label>
        <input
          type="number"
          value={settings.maxSize}
          onChange={(e) => handleMaxSizeChange(e.target.value)}
          min="100"
          max="5000"
          step="10"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          画像の長辺がこのサイズにリサイズされます
        </p>
      </div>

      {/* 出力形式選択 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          出力形式
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(OutputFormat).map((format) => (
            <button
              key={format}
              onClick={() => handleFormatChange(format)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                settings.outputFormat === format
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          JPEG/AVIF: 高圧縮 | PNG: 可逆圧縮（透過対応）
        </p>
      </div>

      {/* 品質設定 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          品質: {settings.quality}%
          {isQualityDisabled && (
            <span className="text-xs text-gray-500 ml-2">
              （PNGは可逆圧縮のため調整不可）
            </span>
          )}
        </label>
        <input
          type="range"
          value={settings.quality}
          onChange={(e) => handleQualityChange(e.target.value)}
          min="50"
          max="100"
          step="5"
          disabled={isQualityDisabled}
          className={`w-full ${isQualityDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>低品質（小サイズ）</span>
          <span>高品質（大サイズ）</span>
        </div>
      </div>

      {/* 設定プレビュー */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">現在の設定</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>最大サイズ: {settings.maxSize}px</p>
          <p>
            品質: {isQualityDisabled ? '可逆圧縮' : `${settings.quality}%`}
          </p>
          <p>出力形式: {settings.outputFormat}</p>
        </div>
      </div>
    </div>
  );
}
