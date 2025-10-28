# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

画像をJPEG/PNG/AVIF形式にリサイズするシングルページアプリケーション。任意の画像形式を選択した形式に変換し、指定サイズにリサイズしてダウンロード可能にする。ブラウザ内で完結するため、プライバシーが保護される。

## 開発コマンド

```bash
# 開発サーバー起動（HMR有効）
bun run dev

# TypeScriptチェック + 本番ビルド
bun run build

# ESLintによるコード品質チェック
bun run lint

# ビルド結果のプレビュー
bun run preview

# パッケージのインストール
bun install
```

## アーキテクチャ

### 技術スタック
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7
- **パッケージマネージャー**: Bun（npm/yarnではなくbunを使用）
- **デプロイ先**: Cloudflare Pages

### コア機能仕様
1. **画像処理**: Canvas APIでクライアントサイドリサイズ、JPEG/PNG/AVIF形式に変換
2. **設定管理**: localStorage（`imageResizerSettings`キー）で最大サイズ・品質・出力形式を永続化
3. **ファイル名規則**: `filename_[maxsize]px.[ext]`（拡張子は選択形式に応じて.jpg/.png/.avif）
4. **デフォルト値**: 最大サイズ720px、品質80%、サムネイル150px、出力形式JPEG

### 計画されたディレクトリ構造

```
src/
├── components/       # UIコンポーネント
│   ├── DropZone.tsx         # ドラッグ&ドロップエリア
│   ├── ImageProcessor.tsx   # 画像処理コンポーネント
│   ├── ProcessingQueue.tsx  # 処理キュー表示
│   ├── ResultGallery.tsx    # 処理結果ギャラリー
│   ├── SettingsPanel.tsx    # サイズ/品質/形式設定パネル
│   └── ThumbnailCard.tsx    # サムネイル表示カード
├── hooks/           # カスタムフック
│   ├── useImageProcessor.ts # 画像処理ロジック
│   ├── useDropzone.ts       # ドロップゾーン管理
│   └── useLocalStorage.ts   # localStorage管理
├── utils/           # ユーティリティ関数
│   ├── imageResizer.ts      # リサイズ処理（Canvas API）
│   ├── fileValidator.ts     # ファイル検証
│   ├── downloadHelper.ts    # ダウンロード処理
│   └── storageHelper.ts     # localStorage操作
└── types/           # 型定義
    └── index.ts
```

## 実装時の重要ポイント

### 形式別変換の実装
```typescript
// 選択された形式に応じて変換
const mimeType = {
  'JPEG': 'image/jpeg',
  'PNG': 'image/png',
  'AVIF': 'image/avif'
}[format];

// PNGは可逆圧縮のため品質設定なし
const qualityValue = format === 'PNG' ? undefined : quality / 100;

canvas.toBlob(
  (blob) => { /* 処理 */ },
  mimeType,
  qualityValue
);
```

### アスペクト比の維持
リサイズ時は必ず元画像の縦横比を保持。最大サイズは長辺基準。

### Chrome専用最適化
最新のWeb API（OffscreenCanvas、ImageBitmap等）を積極的に活用。AVIF形式のサポートのためChrome専用。他ブラウザ対応は不要。

### localStorage設定管理
```typescript
interface Settings {
  maxSize: number;     // デフォルト: 720
  quality: number;     // デフォルト: 80
  outputFormat: string;  // デフォルト: 'JPEG'
}
```

## 設計書

詳細な仕様は `docs/image-resizer-design.md` を参照。920行以上の包括的な設計書があり、以下を含む：
- 詳細な機能要件とUI仕様
- コンポーネント設計
- データフロー
- エラーハンドリング
- テスト戦略（カバレッジ目標80%）

## 現在の実装状態

**初期テンプレート段階** - Vite + React + TypeScriptの初期状態。主要機能は未実装。

実装が必要：
- すべてのコンポーネント（DropZone、SettingsPanel等）
- すべてのカスタムフック（useImageProcessor等）
- すべてのユーティリティ関数（imageResizer等）
- 形式選択UI（JPEG/PNG/AVIFセレクター）
- TailwindCSSの統合
- テストスイート（Vitest、React Testing Library）

## 開発ルール

- TypeScriptでany型禁止（厳密モード有効）
- 1ファイル500行以下を目安に分割
- コミットは小さな単位で、確実性の高い変更から順に
- ログはconsole.logではなくloggerを使用（本番環境では最小限に）
- テストカバレッジ目標: 80%