/**
 * Google Analytics 4 (GA4) トラッキングユーティリティ
 * すべての環境で動作します
 */

type GtagCommand = 'config' | 'event' | 'js';
type GtagConfig = (
  command: 'config',
  targetId: string,
  config?: Record<string, unknown>
) => void;
type GtagEvent = (
  command: 'event',
  eventName: string,
  eventParams?: Record<string, unknown>
) => void;
type GtagJs = (command: 'js', date: Date) => void;
type GtagFunction = GtagConfig & GtagEvent & GtagJs;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

/**
 * Analytics初期化フラグ（重複初期化を防ぐ）
 */
let isInitialized = false;

/**
 * GA4を初期化
 * すべての環境で動作します
 */
export function initAnalytics(measurementId: string): void {
  // 既に初期化済みの場合は何もしない
  if (isInitialized) {
    return;
  }

  // dataLayerを初期化
  window.dataLayer = window.dataLayer || [];

  // gtag関数を定義
  const gtag: GtagFunction = ((
    command: GtagCommand,
    ...args: unknown[]
  ): void => {
    window.dataLayer?.push([command, ...args]);
  }) as GtagFunction;

  window.gtag = gtag;

  // スクリプトを動的に読み込み
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => {
    // スクリプト読み込み完了を確認（デバッグ用）
    console.log('[GA4] Script loaded successfully');
  };
  script.onerror = () => {
    // スクリプト読み込みエラーを確認（デバッグ用）
    console.error('[GA4] Failed to load script');
  };
  document.head.appendChild(script);

  // 初期化イベントを送信
  gtag('js', new Date());
  gtag('config', measurementId);

  isInitialized = true;
  console.log('[GA4] Initialized with measurement ID:', measurementId);
}

/**
 * カスタムイベントを送信
 * すべての環境で動作します
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  // gtagが利用可能な場合のみ送信
  if (window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    // デバッグ用: gtagが利用できない場合
    console.warn('[GA4] gtag is not available. Event not sent:', eventName);
  }
}

/**
 * 画像変換成功イベントのパラメータ
 */
export interface ImageConvertedParams {
  outputFormat: string;
  resizeEnabled: boolean;
  maxSize: number;
  quality: number;
  originalBytes: number;
  resultBytes: number;
  resultWidth: number;
  resultHeight: number;
  durationMs: number;
}

/**
 * 画像変換成功イベントを送信
 */
export function trackImageConverted(params: ImageConvertedParams): void {
  trackEvent('image_convert', {
    output_format: params.outputFormat,
    resize_enabled: params.resizeEnabled,
    max_size: params.maxSize,
    quality: params.quality,
    original_bytes: params.originalBytes,
    result_bytes: params.resultBytes,
    result_width: params.resultWidth,
    result_height: params.resultHeight,
    duration_ms: params.durationMs,
  });
}

/**
 * 画像変換エラーイベントのパラメータ
 */
export interface ImageConvertErrorParams {
  message: string;
  outputFormat: string;
  resizeEnabled: boolean;
  maxSize: number;
  quality: number;
}

/**
 * 画像変換エラーイベントを送信
 */
export function trackImageConvertError(params: ImageConvertErrorParams): void {
  trackEvent('image_convert_error', {
    error_message: params.message,
    output_format: params.outputFormat,
    resize_enabled: params.resizeEnabled,
    max_size: params.maxSize,
    quality: params.quality,
  });
}

