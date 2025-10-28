import { Outlet, Link } from 'react-router-dom';

/**
 * 共通レイアウトコンポーネント
 * すべてのページで共有されるヘッダーとフッターを提供
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <header className="bg-golden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <h1 className="text-2xl font-bold text-white">リサイズくん</h1>
            </Link>
            <p className="text-sm text-white/90 hidden sm:block">
              ブラウザ完結・プライバシー保護 | JPEG / PNG / AVIF
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* フッター */}
      <footer className="bg-golden border-t border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90">
            {/* 左：コピーライト */}
            <div>
              <p>&copy; 2025 リサイズくん. All rights reserved.</p>
            </div>

            {/* 中央：リンク */}
            <div className="flex gap-4 justify-center">
              <Link
                to="/privacy"
                className="hover:text-white underline transition-colors"
              >
                プライバシーポリシー
              </Link>
              <Link
                to="/terms"
                className="hover:text-white underline transition-colors"
              >
                利用規約
              </Link>
            </div>

            {/* 右：特徴 */}
            <div className="text-center md:text-right">
              <p>Chrome推奨 | サーバーアップロード不要</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
