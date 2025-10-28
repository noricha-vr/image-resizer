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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
            {/* 左：コピーライト */}
            <div className="text-center md:text-left">
              <p>&copy; 2025 リサイズくん. All rights reserved.</p>
            </div>

            {/* 右：リンク */}
            <div className="flex gap-4 justify-center md:justify-end">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                プライバシーポリシー
              </Link>
              <Link
                to="/terms"
                className="hover:text-white transition-colors"
              >
                利用規約
              </Link>
              <a
                href="https://github.com/noricha-vr/image-resizer"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
