# Image Resizer - 無料オンライン画像リサイズツール

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg)](https://vitejs.dev/)

画像を簡単にリサイズできる無料オンラインツール。JPEG、PNG、AVIF形式に対応。ブラウザ完結でプライバシーも安心。品質調整、一括処理、ドラッグ&ドロップに対応した高機能な画像リサイズアプリ。

## 主な機能

### 画像処理
- **3つの出力形式に対応**: JPEG / PNG / AVIF
- **柔軟なリサイズ**: 10px〜1920pxまでスライダーで調整可能
- **品質設定**: 50%〜100%まで5%刻みで調整（PNG除く）
- **一括処理**: 複数の画像を同時に処理可能
- **Canvas API**: ブラウザ完結でサーバーにアップロード不要

### ユーザー体験
- **ドラッグ&ドロップ**: 直感的なファイルアップロード
- **リアルタイムプレビュー**: 処理結果を即座に確認
- **設定の永続化**: localStorage により設定を記憶
- **レスポンシブデザイン**: デスクトップ・モバイル両対応
- **SEO最適化**: Open Graph、Twitter Card、構造化データ対応

### プライバシー・セキュリティ
- **完全ブラウザ処理**: サーバーにデータを送信しない
- **オフライン対応**: インターネット接続不要で動作
- **データ保護**: 画像データはローカルのみで処理

## 技術スタック

- **フロントエンド**: React 19.2 + TypeScript 5.9
- **ビルドツール**: Vite 7.1
- **パッケージマネージャー**: Bun
- **スタイリング**: TailwindCSS v4
- **画像処理**: Canvas API
- **ファイル処理**: react-dropzone
- **SEO**: react-helmet-async
- **テスト**: Vitest + React Testing Library

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/image-resizer.git
cd image-resizer

# 依存関係をインストール
bun install
```

## 開発

```bash
# 開発サーバーを起動（デフォルトポート: 5173）
bun run dev

# カスタムポートで起動
bun run dev -- --port 5175

# ビルド
bun run build

# プレビュー
bun run preview

# テスト実行
bun test

# テスト（watch モード）
bun test:watch

# TypeScript型チェック
bun run type-check
```

## プロジェクト構造

```
image-resizer/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── DropZone.tsx     # ドラッグ&ドロップエリア
│   │   ├── SettingsPanel.tsx # 設定パネル
│   │   ├── ProcessingQueue.tsx # 処理キュー表示
│   │   ├── ResultGallery.tsx # 結果ギャラリー
│   │   └── SEOHead.tsx      # SEOメタタグ管理
│   ├── hooks/               # カスタムフック
│   │   ├── useImageProcessor.ts # 画像処理ロジック
│   │   └── useLocalStorage.ts   # 設定永続化
│   ├── utils/               # ユーティリティ関数
│   │   ├── imageResizer.ts  # リサイズ処理
│   │   ├── fileValidator.ts # ファイル検証
│   │   ├── downloadHelper.ts # ダウンロード処理
│   │   └── storageHelper.ts  # localStorage管理
│   ├── types/               # TypeScript型定義
│   │   └── index.ts
│   ├── App.tsx              # メインアプリケーション
│   └── main.tsx             # エントリーポイント
├── docs/                    # ドキュメント
│   ├── README.md            # ドキュメントインデックス
│   ├── spec.md              # プロジェクト仕様書
│   └── design/              # 詳細設計
│       ├── architecture.md  # アーキテクチャ・UML図
│       ├── color-scheme.md  # デザインシステム
│       └── seo.md           # SEO戦略
├── tests/                   # テストファイル
├── public/                  # 静的ファイル
└── dist/                    # ビルド出力
```

## 使い方

### 基本的な使い方

1. **ファイル選択**: ドラッグ&ドロップまたはクリックで画像ファイルを選択
2. **設定調整**: 右側のパネルでサイズ・品質・形式を設定
3. **自動処理**: ファイル追加後、自動的にリサイズが開始
4. **ダウンロード**: 処理完了後、各画像のダウンロードボタンをクリック

### 出力形式の選択

- **JPEG**: 高圧縮率、写真に最適、品質調整可能
- **PNG**: 可逆圧縮、透過画像対応、品質調整不可
- **AVIF**: 最新形式、高圧縮率・高品質、品質調整可能

### ファイル名規則

リサイズされた画像のファイル名は以下の形式になります：

```
元のファイル名_[サイズ]px.拡張子
例: photo_720px.jpg
```

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは以下を参照してください：

- **[ドキュメント一覧](./docs/README.md)** - すべてのドキュメントへのインデックス
- **[プロジェクト仕様書](./docs/spec.md)** - 機能仕様・技術スタック・GA4トラッキング
- **[アーキテクチャ設計](./docs/design/architecture.md)** - 詳細設計・UML図
- **[デザインシステム](./docs/design/color-scheme.md)** - カラースキーマ・UIガイドライン
- **[SEO戦略](./docs/design/seo.md)** - メタタグ・構造化データ

開発者の方は [プロジェクト仕様書](./docs/spec.md) から始めることをおすすめします。

## 設定

### デフォルト設定

- 最大サイズ: 720px
- 品質: 80%
- 出力形式: JPEG

### 設定の永続化

設定はlocalStorageに自動保存され、次回アクセス時に復元されます。

### 環境変数

`.env`ファイルで以下の設定が可能です：

```env
VITE_SITE_URL=https://your-domain.com  # サイトURL（SEO用）
```

## SEO設定

アプリケーションは以下のSEO機能を実装しています：

- **メタタグ**: title, description, keywords
- **Open Graph**: Facebook、LinkedIn等のSNS対応
- **Twitter Card**: Twitterプレビュー対応
- **構造化データ**: JSON-LD形式のSchema.org準拠データ
- **PWA対応**: モバイルアプリライクな体験

## ブラウザ対応

- Chrome（推奨）
- Firefox
- Safari
- Edge

※ AVIF形式の出力にはブラウザのサポートが必要です

## パフォーマンス

- **バンドルサイズ**: 約90KB（gzip圧縮後）
- **処理速度**: クライアントサイドで高速処理
- **メモリ効率**: Canvas APIによる効率的なメモリ管理

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. このリポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'feat: Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを作成

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 作者

noricha-vr

## リンク

- [ドキュメント一覧](./docs/README.md)
- [プロジェクト設定](./CLAUDE.md)
- [課題トラッカー](https://github.com/noricha-vr/image-resizer/issues)

## 謝辞

- React チーム
- Vite チーム
- TailwindCSS チーム
- すべてのコントリビューター
