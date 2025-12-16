import type { ResizeSettings, CropAspectRatioKey, PresetSizeKey } from '../types';
import {
  OutputFormat,
  SizeMode,
  PresetSize,
  CropAspectRatio,
} from '../types';

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

  const handleSizeModeChange = (mode: SizeMode) => {
    onChange({
      ...settings,
      sizeMode: mode,
      // スライダーモードに切り替え時はクロップを無効化
      crop:
        mode === SizeMode.SLIDER
          ? { ...settings.crop, enabled: false }
          : settings.crop,
    });
  };

  const handlePresetSizeChange = (preset: PresetSizeKey) => {
    onChange({
      ...settings,
      maxSize: PresetSize[preset],
    });
  };

  const handleCropToggle = () => {
    onChange({
      ...settings,
      crop: { ...settings.crop, enabled: !settings.crop.enabled },
    });
  };

  const handleCropAspectRatioChange = (ratio: CropAspectRatioKey) => {
    onChange({
      ...settings,
      crop: { ...settings.crop, aspectRatio: ratio },
    });
  };

  // 現在のmaxSizeに対応するプリセットキーを取得
  const getCurrentPresetKey = (): PresetSizeKey | null => {
    for (const [key, value] of Object.entries(PresetSize)) {
      if (value === settings.maxSize) {
        return key as PresetSizeKey;
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
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
        <div className="space-y-4">
          {/* サイズ選択モードトグル */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              サイズ設定方式
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSizeModeChange(SizeMode.SLIDER)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  settings.sizeMode === SizeMode.SLIDER
                    ? 'bg-golden text-white ring-2 ring-golden-dark'
                    : 'bg-gray-100 text-gray-700 hover:bg-golden hover:text-white'
                }`}
              >
                スライダー
              </button>
              <button
                onClick={() => handleSizeModeChange(SizeMode.PRESET)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  settings.sizeMode === SizeMode.PRESET
                    ? 'bg-golden text-white ring-2 ring-golden-dark'
                    : 'bg-gray-100 text-gray-700 hover:bg-golden hover:text-white'
                }`}
              >
                規格サイズ
              </button>
            </div>
          </div>

          {/* スライダーモード */}
          {settings.sizeMode === SizeMode.SLIDER && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                最大サイズ: {settings.maxSize}px
              </label>
              <input
                type="range"
                value={settings.maxSize}
                onChange={(e) => handleMaxSizeChange(e.target.value)}
                min="10"
                max="3840"
                step="10"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10px</span>
                <span>1920px</span>
                <span>3840px</span>
              </div>
              <p className="text-xs text-gray-500">
                画像の長辺がこのサイズにリサイズされます
              </p>
            </div>
          )}

          {/* 規格サイズモード */}
          {settings.sizeMode === SizeMode.PRESET && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  長辺サイズを選択: {settings.maxSize}px
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(PresetSize) as PresetSizeKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handlePresetSizeChange(key)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        getCurrentPresetKey() === key
                          ? 'bg-golden text-white ring-2 ring-golden-dark'
                          : 'bg-gray-100 text-gray-700 hover:bg-golden hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-bold">{key}</div>
                      <div className="text-xs opacity-75">
                        {PresetSize[key]}px
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* クロップ設定 */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="crop-enabled"
                    checked={settings.crop.enabled}
                    onChange={handleCropToggle}
                    className="w-4 h-4 text-golden rounded focus:ring-golden"
                  />
                  <label
                    htmlFor="crop-enabled"
                    className="text-sm font-medium text-gray-700"
                  >
                    切り取り（クロップ）を有効にする
                  </label>
                </div>
                {settings.crop.enabled && (
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500">
                      アスペクト比を選択（画像中央から切り取り）
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(
                        Object.keys(CropAspectRatio) as CropAspectRatioKey[]
                      ).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => handleCropAspectRatioChange(ratio)}
                          className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                            settings.crop.aspectRatio === ratio
                              ? 'bg-golden text-white ring-2 ring-golden-dark'
                              : 'bg-gray-100 text-gray-700 hover:bg-golden hover:text-white'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      画像の上下または左右の余分な部分が切り取られます
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                settings.outputFormat === format
                  ? 'bg-golden text-white ring-2 ring-golden-dark'
                  : 'bg-gray-100 text-gray-700 hover:bg-golden hover:text-white'
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

    </div>
  );
}
