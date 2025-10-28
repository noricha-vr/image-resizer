import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

/**
 * 404 Not Foundページ
 */
export function NotFound() {
  return (
    <>
      <SEOHead
        title="ページが見つかりません"
        description="お探しのページは見つかりませんでした。"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動または削除された可能性があります。
        </p>
        <Link
          to="/"
          className="inline-block bg-golden text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          ホームに戻る
        </Link>
      </div>
    </>
  );
}
