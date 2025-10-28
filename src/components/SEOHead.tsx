import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * SEO対策のためのメタタグを管理するコンポーネント
 *
 * Open Graphプロトコルとツイッターカードに完全対応し、
 * 検索エンジン最適化に必要な情報を適切に設定します。
 */
export function SEOHead({
  title = 'Image Resizer - 無料オンライン画像リサイズツール',
  description = '画像を簡単にリサイズできる無料オンラインツール。JPEG、PNG、AVIF形式に対応。ブラウザ完結でプライバシーも安心。品質調整、一括処理、ドラッグ&ドロップに対応した高機能な画像リサイズアプリ。',
  keywords = '画像リサイズ,画像圧縮,JPEG,PNG,AVIF,オンラインツール,無料,ブラウザ,プライバシー,一括処理,品質調整,ドラッグ&ドロップ',
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: SEOHeadProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://image-resizer.example.com';
  const fullTitle = title.includes('Image Resizer') ? title : `${title} | Image Resizer`;

  return (
    <Helmet>
      {/* 基本メタタグ */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* ビューポート設定（モバイル対応） */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* 文字コード */}
      <meta charSet="UTF-8" />

      {/* 言語設定 */}
      <html lang="ja" />

      {/* ロボット制御 */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph (Facebook, LinkedIn等) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:site_name" content="Image Resizer" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* PWA対応 */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Image Resizer" />

      {/* セキュリティ */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* 正規URL */}
      <link rel="canonical" href={siteUrl} />

      {/* 構造化データ (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Image Resizer',
          description: description,
          url: siteUrl,
          applicationCategory: 'UtilityApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'JPY',
          },
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript. Chrome推奨',
          featureList: [
            '画像リサイズ',
            'JPEG/PNG/AVIF形式対応',
            '品質調整',
            '一括処理',
            'ドラッグ&ドロップ',
            'ブラウザ完結（プライバシー保護）',
          ],
        })}
      </script>
    </Helmet>
  );
}
