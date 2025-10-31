import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './utils/analytics'

// GA4を初期化（すべての環境で動作）
console.log('[GA4] Initializing Google Analytics...');
initAnalytics('G-L74L97SSFW');

// Service Worker の更新検知とリロード処理
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // @ts-expect-error - virtual:pwa-register はビルド時に生成される
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        // 更新が検知されたら即座にリロード
        console.log('[PWA] New version available, reloading...');
        // skipWaiting: true により新しいSWが既にアクティブになっているので、リロードする
        window.location.reload();
      },
      onOfflineReady() {
        console.log('[PWA] App ready to work offline');
      },
      onRegistered(registration: ServiceWorkerRegistration | undefined) {
        console.log('[PWA] Service Worker registered', registration);
        
        // 定期的に更新をチェック（1時間ごと）
        if (registration) {
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        }
      },
      onRegisterError(error: Error) {
        console.error('[PWA] Service Worker registration error', error);
      },
    });
  }).catch(() => {
    // 開発環境などで virtual:pwa-register が存在しない場合は無視
    console.log('[PWA] Service Worker registration skipped (development mode)');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
