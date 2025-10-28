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
  title = '画像リサイズ・圧縮ツール【無料・サーバーアップロード不要】AVIF/PNG/JPEG対応',
  description = 'ブラウザ完結で安心！プライバシー保護の無料画像リサイズ・圧縮ツール。JPEG/PNG/AVIF対応、品質調整可能。Instagram・SNS最適サイズに一発変換。サーバーアップロード不要でオフライン動作。',
  keywords = '画像リサイズ,画像圧縮,無料,JPEG,PNG,AVIF,サーバーアップロードなし,ブラウザ完結,プライバシー保護,オフライン,ローカル処理,品質調整,Instagram,SNS,画像最適化,透過PNG,次世代画像形式',
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
          name: '画像リサイズ・圧縮ツール',
          alternateName: 'Image Resizer',
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
            '画像リサイズ（サイズ変更）',
            '画像圧縮（ファイルサイズ削減）',
            'JPEG/PNG/AVIF形式対応',
            '品質調整・圧縮レベル調整',
            '一括処理・ドラッグ&ドロップ',
            'ブラウザ完結・サーバーアップロード不要',
            'プライバシー保護・オフライン動作',
            'Instagram・SNS最適サイズ対応',
            '透過PNG対応',
            '次世代画像形式AVIF対応',
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            ratingCount: '1',
          },
        })}
      </script>
    </Helmet>
  );
}
