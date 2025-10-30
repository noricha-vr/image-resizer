# SEO戦略詳細

> 📑 [ドキュメント一覧に戻る](../README.md) | [プロジェクトトップ](../../README.md)

このドキュメントでは、リサイズくんのSEO対策実装の詳細を説明します。

## 包括的SEO実装

本プロジェクトでは、検索エンジン最適化とソーシャルメディア対応のため、以下のSEO対策を実装しています。

## 静的メタデータ（index.html）

```html
<!-- JavaScript実行前のSEO対策 -->
<title>リサイズくん - 画像リサイズ・圧縮ツール【無料・サーバーアップロード不要】</title>
<meta name="description" content="ブラウザ完結で安心！リサイズくんは、プライバシー保護の無料画像リサイズ・圧縮ツール..." />
<link rel="canonical" href="https://resize.kojin.works/" />
```

## 動的メタデータ（SEOHead.tsx）

react-helmet-asyncを使用した動的メタタグ管理：

```yaml
meta_tags:
  basic:
    - title: ページタイトル（ブランド名自動付与）
    - description: ページ説明文
    - keywords: 検索キーワード
    - canonical: 正規URL（動的生成）

  open_graph:
    - og:title: SNSシェア用タイトル
    - og:description: SNSシェア用説明
    - og:type: website
    - og:url: 動的URL
    - og:image: OG画像（1200x630px）
    - og:locale: ja_JP
    - og:site_name: リサイズくん

  twitter_card:
    - twitter:card: summary_large_image
    - twitter:title: Twitterシェア用タイトル
    - twitter:description: Twitter説明
    - twitter:image: Twitter画像

  pwa:
    - theme-color: #2563eb
    - apple-mobile-web-app-capable: yes
    - apple-mobile-web-app-title: リサイズくん
```

## 構造化データ（JSON-LD）

Schema.org準拠のWebApplicationデータ：

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "リサイズくん",
  "description": "...",
  "url": "https://resize.kojin.works",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "JPY"
  },
  "author": {
    "@type": "Person",
    "name": "noricha-vr",
    "url": "https://github.com/noricha-vr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "kojin.works",
    "url": "https://kojin.works"
  },
  "datePublished": "2025-10-29",
  "dateModified": "2025-10-29",
  "softwareVersion": "1.0.0",
  "featureList": [...]
}
```

## SEOファイル

### robots.txt

```txt
User-agent: *
Allow: /
Sitemap: https://resize.kojin.works/sitemap.xml
```

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://resize.kojin.works/</loc>
    <priority>1.0</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://resize.kojin.works/privacy</loc>
    <priority>0.5</priority>
    <changefreq>yearly</changefreq>
  </url>
  <url>
    <loc>https://resize.kojin.works/terms</loc>
    <priority>0.5</priority>
    <changefreq>yearly</changefreq>
  </url>
</urlset>
```

## SEO改善履歴

### 2025-10-29 包括的SEO対策実施

**P0（緊急）対応:**
- robots.txt/sitemap.xmlのURL修正（example.com → resize.kojin.works）
- sitemap.xmlの日付更新
- H1タグ追加（見出し階層エラー解消）
- Canonical URLの動的設定

**P1（高優先度）対応:**
- index.htmlに静的メタデータ追加
- 構造化データ改善（aggregateRating削除、author/publisher追加）

### 2025-10-30 リサイズON/OFFトグル機能追加

- リサイズ機能の有効/無効を切り替え可能にするトグルボタンを追加
- リサイズOFF時は最大サイズ設定を非表示
- リサイズOFF時は元の画像サイズのまま圧縮のみ適用
- ResizeSettings型に`resizeEnabled`フィールドを追加（デフォルト: true）

## 期待される効果

### 短期（1ヶ月）

- Google Search Consoleへのインデックス登録
- クロールエラーの解消
- 基本的な検索可視性の向上

### 中期（3ヶ月）

- ブランドキーワード（"リサイズくん"）での上位表示
- SNSシェア時の適切なプレビュー表示
- 構造化データのリッチリザルト表示

### 長期（6ヶ月以降）

- 一般キーワード（"画像リサイズ 無料"等）での上位表示
- オーガニックトラフィックの増加
- プライバシー保護訴求での差別化


