import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './utils/analytics'

// GA4を初期化（すべての環境で動作）
console.log('[GA4] Initializing Google Analytics...');
initAnalytics('G-L74L97SSFW');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
