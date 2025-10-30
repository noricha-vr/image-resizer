# リサイズくん - 仕様書

> 📑 [ドキュメント一覧に戻る](./README.md) | [プロジェクトトップ](../README.md)

## 概要

リサイズくんは、ブラウザ完結で動作する画像リサイズ・圧縮ツールです。サーバーアップロード不要で、プライバシー保護を重視した設計となっています。

## 技術スタック

- **フレームワーク**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **PWA**: Vite PWA Plugin
- **ルーティング**: React Router
- **画像処理**: Canvas API + @jsquash/avif + @jsquash/oxipng
- **分析**: Google Analytics 4 (GA4)

## 主要機能

### 画像処理機能

- **対応形式**: JPEG, PNG, AVIF
- **リサイズ機能**: アスペクト比を維持したリサイズ（最大サイズ指定）
- **圧縮機能**: 品質調整による圧縮
- **サムネイル生成**: 処理結果のプレビュー用サムネイル生成

### 設定項目

- **リサイズON/OFF**: リサイズ機能の有効/無効
- **最大サイズ**: 10px 〜 1920px（デフォルト: 720px）
- **品質**: 50% 〜 100%（デフォルト: 80%）
- **出力形式**: JPEG / PNG / AVIF

### ユーザー体験

- **ドラッグ&ドロップ**: ファイルのドラッグ&ドロップ対応
- **複数ファイル対応**: 複数ファイルの一括処理
- **処理状況表示**: リアルタイムの処理状況表示
- **設定の永続化**: ローカルストレージに設定を保存

## Google Analytics 4 (GA4) トラッキング

### 計測ID

- `G-L74L97SSFW`

### 送信環境

- 本番環境のみ（`import.meta.env.PROD` が true のとき）
- 開発環境ではイベント送信を行わない

### 送信イベント

#### `image_convert`

画像変換が成功したときに送信されるイベント。

**パラメータ**:
- `output_format`: 出力形式（JPEG/PNG/AVIF）
- `resize_enabled`: リサイズが有効かどうか（boolean）
- `max_size`: 最大サイズ（px）
- `quality`: 品質（%）
- `original_bytes`: 元画像のサイズ（bytes）
- `result_bytes`: 変換後のサイズ（bytes）
- `result_width`: 変換後の幅（px）
- `result_height`: 変換後の高さ（px）
- `duration_ms`: 処理時間（ms）

#### `image_convert_error`

画像変換でエラーが発生したときに送信されるイベント。

**パラメータ**:
- `error_message`: エラーメッセージ（先頭100文字）
- `output_format`: 出力形式（JPEG/PNG/AVIF）
- `resize_enabled`: リサイズが有効かどうか（boolean）
- `max_size`: 最大サイズ（px）
- `quality`: 品質（%）

### プライバシー保護

- ファイル名やファイル内容は送信しない
- 個人を特定できる情報は送信しない
- 送信されるのは設定値と処理結果の統計情報のみ

## アーキテクチャ

### ディレクトリ構造

```
src/
├── components/      # Reactコンポーネント
├── hooks/          # カスタムフック
├── pages/          # ページコンポーネント
├── types/          # TypeScript型定義
├── utils/          # ユーティリティ関数
└── test/           # テスト設定
```

### 主要コンポーネント

- `Home`: メインページ
- `DropZone`: ファイルドロップゾーン
- `SettingsPanel`: 設定パネル
- `ProcessingStatus`: 処理状況表示

### 主要フック

- `useImageProcessor`: 画像処理の管理
- `useLocalStorage`: 設定の永続化

### 主要ユーティリティ

- `analytics.ts`: GA4トラッキング
- `imageResizer.ts`: 画像処理ロジック
- `fileValidator.ts`: ファイル検証
- `downloadHelper.ts`: ダウンロード処理

## 変更履歴

### 2024年（実装日未記載）

#### GA4トラッキング導入

- Google Analytics 4 (GA4) のトラッキングを導入
- 計測ID: `G-L74L97SSFW`
- 本番環境のみで動作
- 画像変換の成功/失敗イベントを送信
- 設定値と処理結果の統計情報をトラッキング
- プライバシー保護のため、ファイル名や個人情報は送信しない

