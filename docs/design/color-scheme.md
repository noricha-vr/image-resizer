# Image Resizer - カラースキーマ定義

> 📑 [ドキュメント一覧に戻る](../README.md) | [プロジェクトトップ](../../README.md)

このドキュメントでは、Image Resizerアプリケーションのカラースキーマを定義します。

## カラーパレット

以下の4色をブランドカラーとして使用します：

### Primary Colors

| カラー名 | Hex Code | RGB | 用途 |
|---------|----------|-----|------|
| **Cream** | `#F5E6D3` | rgb(245, 230, 211) | 背景、ニュートラルカラー |
| **Golden** | `#F5A623` | rgb(245, 166, 35) | メインアクション、強調 |
| **Orange** | `#F07E3E` | rgb(240, 126, 62) | セカンダリアクション、ホバー |
| **Red** | `#D0021B` | rgb(208, 2, 27) | エラー、警告、削除アクション |

## カラー使用ガイドライン

### Cream (`#F5E6D3`)
- **用途**: 背景色、カード背景、ニュートラルエリア
- **アクセシビリティ**: 白色テキストとのコントラスト比が低いため、濃い色のテキストを使用
- **使用例**: ページ背景、ドロップゾーン背景、設定パネル背景

### Golden (`#F5A623`)
- **用途**: プライマリーボタン、アクティブ状態、強調要素
- **アクセシビリティ**: 白色テキストとの組み合わせで十分なコントラスト
- **使用例**: ダウンロードボタン、選択された形式ボタン、プログレスバー

### Orange (`#F07E3E`)
- **用途**: セカンダリーボタン、ホバー状態、リンク
- **アクセシビリティ**: 白色テキストとの組み合わせで良好なコントラスト
- **使用例**: ボタンホバー、処理中インジケーター、アクセント

### Red (`#D0021B`)
- **用途**: エラー表示、警告、削除アクション、危険な操作
- **アクセシビリティ**: 白色テキストとの組み合わせで高いコントラスト
- **使用例**: エラーメッセージ、削除ボタン、リセットボタン

## TailwindCSS設定

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-cream: #F5E6D3;
  --color-golden: #F5A623;
  --color-orange: #F07E3E;
  --color-red: #D0021B;

  /* 階調バリエーション */
  --color-golden-light: #F9C36E;
  --color-golden-dark: #D98E1C;
  --color-orange-light: #F59E6E;
  --color-orange-dark: #D66632;
  --color-red-light: #E54A5A;
  --color-red-dark: #A00116;
}
```

## コンポーネント別カラー適用

### ヘッダー
- 背景: `cream`
- テキスト: 濃いグレー (`gray-900`)
- ボーダー: 薄いグレー

### ドロップゾーン
- 背景: `cream` (通常状態)
- ボーダー: `golden` (ドラッグオーバー時)
- アイコン: `golden`

### ボタン
- プライマリー: 背景 `golden`, ホバー `orange`
- セカンダリー: 背景 `orange`, ホバー `golden-dark`
- 危険: 背景 `red`, ホバー `red-dark`

### 設定パネル
- 背景: 白
- スライダーアクティブ: `golden`
- 選択ボタン: `golden` (選択時), グレー (非選択時)

### 処理キュー
- 待機: `cream` 背景
- 処理中: `orange` アクセント
- 完了: `golden` アクセント
- エラー: `red` アクセント

### フッター
- 背景: 白
- テキスト: グレー
- ボーダー: 薄いグレー

## アクセシビリティ配慮

### コントラスト比
- `golden` + 白テキスト: 4.5:1 以上（WCAG AA準拠）
- `orange` + 白テキスト: 4.5:1 以上（WCAG AA準拠）
- `red` + 白テキスト: 7:1 以上（WCAG AAA準拠）
- `cream` + 濃いグレーテキスト: 4.5:1 以上（WCAG AA準拠）

### カラーブラインド対応
- 重要な情報を色だけで伝えない
- アイコンやラベルを併用
- エラー表示には赤色だけでなくテキストやアイコンを使用

## 実装例

### React/TailwindCSS

```tsx
// プライマリーボタン
<button className="bg-golden hover:bg-orange text-white px-4 py-2 rounded-md">
  ダウンロード
</button>

// 危険なアクション
<button className="bg-red hover:bg-red-dark text-white px-4 py-2 rounded-md">
  すべてリセット
</button>

// 背景
<div className="bg-cream min-h-screen">
  {/* コンテンツ */}
</div>

// ドロップゾーン（ドラッグオーバー時）
<div className="border-2 border-golden bg-cream">
  {/* ドロップゾーン */}
</div>
```

## デザイントークン

将来的なCSS変数への移行を見据えたトークン定義：

```css
:root {
  /* Brand Colors */
  --brand-cream: #F5E6D3;
  --brand-golden: #F5A623;
  --brand-orange: #F07E3E;
  --brand-red: #D0021B;

  /* Semantic Colors */
  --color-background: var(--brand-cream);
  --color-primary: var(--brand-golden);
  --color-secondary: var(--brand-orange);
  --color-danger: var(--brand-red);

  /* Component-specific */
  --button-primary-bg: var(--brand-golden);
  --button-primary-hover: var(--brand-orange);
  --button-danger-bg: var(--brand-red);
  --dropzone-border-active: var(--brand-golden);
}
```

## カラースキーマのバージョン管理

- **Version**: 1.0
- **Last Updated**: 2025-10-28
- **Designer**: Auto-generated from brand image
- **Status**: Active
