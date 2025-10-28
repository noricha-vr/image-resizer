# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

画像をJPEG/PNG/AVIF形式にリサイズするシングルページアプリケーション。任意の画像形式を選択した形式に変換し、指定サイズにリサイズしてダウンロード可能にする。ブラウザ内で完結するため、プライバシーが保護される。

## 開発コマンド

```bash
# 開発サーバー起動（HMR有効）
bun run dev

# カスタムポートで起動
bun run dev -- --port 5175

# TypeScriptチェック + 本番ビルド
bun run build

# ESLintによるコード品質チェック
bun run lint

# ビルド結果のプレビュー
bun run preview

# テスト実行
bun test

# テスト（watchモード）
bun test:watch

# パッケージのインストール
bun install
```

## アーキテクチャ

### 技術スタック
- **フレームワーク**: React 19.2 + TypeScript 5.9
- **ビルドツール**: Vite 7.1
- **パッケージマネージャー**: Bun（npm/yarnではなくbunを使用）
- **スタイリング**: TailwindCSS v4（@tailwindcss/vite plugin使用）
- **画像処理**: Canvas API
- **ファイルアップロード**: react-dropzone
- **SEO**: react-helmet-async
- **テスト**: Vitest + React Testing Library
- **デプロイ先**: Cloudflare Pages

### コア機能仕様
1. **画像処理**: Canvas APIでクライアントサイドリサイズ、JPEG/PNG/AVIF形式に変換
2. **設定管理**: localStorage（`imageResizerSettings`キー）で最大サイズ・品質・出力形式を永続化
3. **ファイル名規則**: `filename_[maxsize]px.[ext]`（拡張子は選択形式に応じて.jpg/.png/.avif）
4. **デフォルト値**: 最大サイズ720px、品質80%、出力形式JPEG
5. **サイズ調整**: 10px〜1980pxまでスライダーで調整可能
6. **品質調整**: 50%〜100%まで5%刻みで調整（PNG除く）

### 実装済みディレクトリ構造

```
src/
├── components/       # UIコンポーネント
│   ├── DropZone.tsx         # ドラッグ&ドロップエリア（react-dropzone使用）
│   ├── ProcessingQueue.tsx  # 処理キュー表示
│   ├── ResultGallery.tsx    # 処理結果ギャラリー
│   ├── SettingsPanel.tsx    # サイズ/品質/形式設定パネル（スライダーUI）
│   └── SEOHead.tsx          # SEOメタタグ管理（react-helmet-async）
├── hooks/           # カスタムフック
│   ├── useImageProcessor.ts # 画像処理ロジック・キュー管理
│   └── useLocalStorage.ts   # localStorage管理
├── utils/           # ユーティリティ関数
│   ├── imageResizer.ts      # リサイズ処理（Canvas API）
│   ├── fileValidator.ts     # ファイル検証
│   ├── downloadHelper.ts    # ダウンロード処理
│   └── storageHelper.ts     # localStorage操作
├── types/           # 型定義
│   └── index.ts
├── App.tsx          # メインアプリケーション
├── main.tsx         # エントリーポイント（HelmetProvider設定）
└── index.css        # TailwindCSS v4インポート
```

## 実装時の重要ポイント

### TypeScript型定義

TypeScript 5.9のverbatimModuleSyntax対応のため、以下のパターンを使用：

```typescript
// enumの代わりにconst objectパターン
export const OutputFormat = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  AVIF: 'AVIF',
} as const;

export type OutputFormat = (typeof OutputFormat)[keyof typeof OutputFormat];

// 型のみのインポートは明示的に
import type { ImageFile } from '../types';
import { OutputFormat, ProcessingStatus } from '../types'; // 値として使用
```

### 形式別変換の実装
```typescript
// 選択された形式に応じて変換
const MIME_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  AVIF: 'image/avif',
} as const;

// PNGは可逆圧縮のため品質設定なし
const qualityValue = format === OutputFormat.PNG ? undefined : quality / 100;

canvas.toBlob(
  (blob) => { /* 処理 */ },
  MIME_TYPES[format],
  qualityValue
);
```

### アスペクト比の維持
リサイズ時は必ず元画像の縦横比を保持。最大サイズは長辺基準。

### Chrome専用最適化
最新のWeb API（Canvas API、FileReader等）を積極的に活用。AVIF形式のサポートのためChrome専用。他ブラウザ対応は推奨だがChrome最適化優先。

### localStorage設定管理
```typescript
interface ResizeSettings {
  maxSize: number;        // デフォルト: 720、範囲: 10-1980
  quality: number;        // デフォルト: 80、範囲: 50-100
  outputFormat: OutputFormat;  // デフォルト: JPEG
}
```

### TailwindCSS v4設定

v4では新しい設定方法を使用：

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## SEO実装

react-helmet-asyncを使用した包括的なSEO対策：

- **メタタグ**: title, description, keywords
- **Open Graph**: Facebook、LinkedIn等のSNS対応
- **Twitter Card**: Twitterプレビュー対応
- **構造化データ**: JSON-LD形式のSchema.org準拠（WebApplicationタイプ）
- **PWA対応**: theme-color、apple-mobile-web-app設定

```typescript
// src/components/SEOHead.tsx
<SEOHead
  title="Image Resizer - 無料オンライン画像リサイズツール"
  description="画像を簡単にリサイズできる無料オンラインツール..."
  keywords="画像リサイズ,画像圧縮,JPEG,PNG,AVIF..."
/>
```

## UI/UX実装

### レイアウト
- Flexbox使用: `flex flex-col` で垂直レイアウト
- Sticky footer: `flex-1` をmainに適用
- レスポンシブ: `lg:col-span-2` 等のブレークポイント使用

### フォーム要素
- スライダー入力: `type="range"` で10-1980px範囲
- ボタン選択: 形式選択は3つのボタン（JPEG/PNG/AVIF）
- 無効化処理: PNG選択時はquality sliderを`disabled`に

## 設計書

詳細な仕様は `docs/image-resizer-design.md` を参照。920行以上の包括的な設計書があり、以下を含む：
- 詳細な機能要件とUI仕様
- コンポーネント設計
- データフロー
- エラーハンドリング
- テスト戦略（カバレッジ目標80%）

## 現在の実装状態

**完全実装済み** - すべてのコア機能が実装され、動作確認済み

実装済み機能：
- ✅ すべてのUIコンポーネント（DropZone、SettingsPanel、ProcessingQueue、ResultGallery、SEOHead）
- ✅ すべてのカスタムフック（useImageProcessor、useLocalStorage）
- ✅ すべてのユーティリティ関数（imageResizer、fileValidator、downloadHelper、storageHelper）
- ✅ 3形式対応（JPEG/PNG/AVIF）
- ✅ TailwindCSS v4統合
- ✅ SEO対策（react-helmet-async）
- ✅ スライダーUI（サイズ・品質調整）
- ✅ レスポンシブデザイン
- ✅ Sticky footer
- ✅ 設定の永続化

未実装：
- ⚠️ テストスイート（Vitest、React Testing Library）
- ⚠️ エラーログシステム
- ⚠️ パフォーマンス最適化（大量画像処理時）

## 開発ルール

- TypeScriptでany型禁止（厳密モード有効）
- 1ファイル500行以下を目安に分割
- コミットは小さな単位で、確実性の高い変更から順に
- ログはconsole.logではなくloggerを使用（本番環境では最小限に）
- テストカバレッジ目標: 80%
- TypeScript 5.9のverbatimModuleSyntax対応（型のみインポートは`import type`を使用）
- TailwindCSS v4の新しい設定方法を使用（@tailwindcss/vite plugin）

## 既知の制約事項

- AVIF形式のサポートはブラウザ依存（Chrome/Edge推奨）
- 大容量画像（>50MB）の処理はメモリ不足の可能性あり
- オフライン動作可能だが、初回ロードは要インターネット接続
