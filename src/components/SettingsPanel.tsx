import type { ResizeSettings } from '../types';
import { OutputFormat } from '../types';

interface SettingsPanelProps {
  settings: ResizeSettings;
  onChange: (settings: ResizeSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const handleResizeToggle = () => {
    onChange({ ...settings, resizeEnabled: !settings.resizeEnabled });
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">設定</h3>

      {/* リサイズON/OFFトグル */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            リサイズ
          </label>
          <button
            type="button"
            onClick={handleResizeToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 ${
              settings.resizeEnabled ? 'bg-golden' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={settings.resizeEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.resizeEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {settings.resizeEnabled
            ? 'リサイズがONのとき、画像の長辺が最大サイズにリサイズされます'
            : 'リサイズがOFFのとき、元の画像サイズのまま圧縮のみ適用されます'}
        </p>
      </div>

      {/* 最大サイズ設定（リサイズがONのときのみ表示） */}
      {settings.resizeEnabled && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            最大サイズ: {settings.maxSize}px
          </label>
          <input
            type="range"
            value={settings.maxSize}
            onChange={(e) => handleMaxSizeChange(e.target.value)}
            min="10"
            max="1920"
            step="10"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10px</span>
            <span>1920px</span>
          </div>
          <p className="text-xs text-gray-500">
            画像の長辺がこのサイズにリサイズされます
          </p>
        </div>
      )}

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
                  ? 'bg-golden text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-light hover:text-white'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          JPEG/AVIF: 高圧縮 | PNG: 可逆圧縮（透過対応、品質で圧縮レベル調整）
        </p>
      </div>

      {/* 品質設定 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          品質: {settings.quality}%
        </label>
        <input
          type="range"
          value={settings.quality}
          onChange={(e) => handleQualityChange(e.target.value)}
          min="50"
          max="100"
          step="5"
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>低品質（小サイズ）</span>
          <span>高品質（大サイズ）</span>
        </div>
        <p className="text-xs text-gray-500">
          JPEG/AVIF: 画質 | PNG: 圧縮レベル（処理時間とサイズのバランス）
        </p>
      </div>

      {/* 設定プレビュー */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">現在の設定</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>リサイズ: {settings.resizeEnabled ? 'ON' : 'OFF'}</p>
          {settings.resizeEnabled && <p>最大サイズ: {settings.maxSize}px</p>}
          <p>品質: {settings.quality}%</p>
          <p>出力形式: {settings.outputFormat}</p>
        </div>
      </div>
    </div>
  );
}
