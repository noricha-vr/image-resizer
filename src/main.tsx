import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './utils/analytics'

// GA4を初期化（本番環境のみ）
// Viteのビルド時に import.meta.env.PROD が true に置き換えられる
// 念のため、環境変数でも制御可能にする
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
if (isProduction) {
  console.log('[GA4] Production mode detected, initializing...');
  initAnalytics('G-L74L97SSFW');
} else {
  console.log('[GA4] Development mode, skipping initialization');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
