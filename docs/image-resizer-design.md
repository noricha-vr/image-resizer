# 画像リサイズサービス設計書

## 1. プロジェクト概要

### 1.1 プロジェクト基本情報

```yaml
project:
  name: "リサイズくん (Image Resizer)"
  version: "1.0.0"
  type: "Single Page Application with React Router"
  description: "ドラッグ&ドロップで簡単に画像をJPEG/PNG/AVIF形式にリサイズできるウェブサービス"
  deploy_url: "https://resize.kojin.works"

requirements:
  functional:
    - ドラッグ&ドロップによる画像アップロード
    - アスペクト比を維持した画像リサイズ（最大720px）
    - JPEG/PNG/AVIF形式への変換対応
    - 複数ファイルの順次処理
    - サムネイル表示とダウンロード機能
    - 設定のlocalStorage保存
  non_functional:
    - Chrome専用対応
    - シンプルで直感的なUI
    - 高速な処理速度
    - ブラウザ内完結（サーバー不要）
    - プライバシー保護（画像のサーバー送信なし）
```

### 1.2 主要機能

- **画像アップロード**: ドラッグ&ドロップまたはクリックでファイル選択
- **リサイズ処理**: Canvas APIを使用したクライアントサイドリサイズ（JPEG/PNG/AVIF選択可能）
- **プレビュー表示**: 150pxサムネイルによる処理結果確認
- **ダウンロード**: 個別ダウンロードまたは一括ダウンロード
- **サイズ設定**: 最大サイズの変更機能（デフォルト720px、localStorage保存）
- **品質設定**: 50-100%のスライダー調整（デフォルト80%）
- **出力形式選択**: JPEG/PNG/AVIF から選択可能（デフォルトJPEG）

## 2. 技術スタック概要

```yaml
frontend:
  language: TypeScript 5.9
  framework: React 19.1
  build_tool: Vite 7.1
  styling: TailwindCSS v4
  router: React Router 7.9
  browser_support: Chrome推奨（主要ブラウザ対応）

deployment:
  platform: Cloudflare Pages
  cdn: Cloudflare CDN
  url: https://resize.kojin.works

libraries:
  - react-dropzone: "ドラッグ&ドロップ機能"
  - react-helmet-async: "SEOメタタグ管理"
  - react-router-dom: "ページルーティング"
  - "@jsquash/avif": "AVIF形式圧縮"
  - "@jsquash/oxipng": "PNG形式最適化"

development:
  package_manager: Bun
  linter: ESLint
  test_framework: Vitest
  testing_library: React Testing Library
```

### 2.1 技術選定理由

- **React 19 + Vite 7**: 最新機能による高速なビルドとHMR、シンプルな設定
- **TypeScript 5.9**: 型安全性と最新のverbatimModuleSyntax対応
- **TailwindCSS v4**: 新しいViteプラグイン対応、ユーティリティファーストによる迅速なUI開発
- **Bun**: npmより高速なパッケージマネージャー、TypeScript/JSXネイティブサポート
- **@jsquash**: WebAssemblyベースの高品質画像圧縮ライブラリ
- **React Router 7**: 最新のルーティング機能、法的ページ対応
- **Cloudflare Pages**: 無料枠が充実、高速なCDN、GitHub連携による簡単なデプロイ

## 3. ディレクトリ構造

```tree
image-resizer/
├── src/
│   ├── components/
│   │   ├── DropZone.tsx          # ドラッグ&ドロップエリア
│   │   ├── Layout.tsx            # 共通レイアウト（ヘッダー・フッター）
│   │   ├── ProcessingStatus.tsx  # 処理キュー・結果表示
│   │   ├── SettingsPanel.tsx     # サイズ・品質・形式設定パネル
│   │   └── SEOHead.tsx           # SEOメタタグ管理（Helmet）
│   ├── pages/
│   │   ├── Home.tsx              # ホームページ（メイン機能）
│   │   ├── Privacy.tsx           # プライバシーポリシー
│   │   ├── Terms.tsx             # 利用規約
│   │   └── NotFound.tsx          # 404ページ
│   ├── hooks/
│   │   ├── useImageProcessor.ts  # 画像処理・キュー管理フック
│   │   └── useLocalStorage.ts    # localStorage管理フック
│   ├── utils/
│   │   ├── imageResizer.ts       # リサイズ処理ロジック（@jsquash使用）
│   │   ├── fileValidator.ts      # ファイル検証
│   │   ├── downloadHelper.ts     # ダウンロード処理
│   │   └── storageHelper.ts      # localStorage管理
│   ├── types/
│   │   └── index.ts              # TypeScript型定義
│   ├── test/
│   │   └── setup.ts              # テスト環境設定
│   ├── App.tsx                   # ルーター設定
│   ├── main.tsx                  # エントリーポイント（HelmetProvider）
│   └── index.css                 # TailwindCSS v4インポート
├── public/
│   ├── favicon.ico               # ファビコン
│   ├── favicon-16x16.png         # 16x16ファビコン
│   ├── favicon-32x32.png         # 32x32ファビコン
│   ├── apple-touch-icon.png      # Apple Touch Icon
│   ├── android-chrome-*.png      # Android用アイコン
│   ├── site.webmanifest          # PWAマニフェスト
│   ├── robots.txt                # クローラー制御
│   ├── sitemap.xml               # サイトマップ
│   ├── og/image.png              # OG画像
│   └── _redirects                # Cloudflare Pages リダイレクト設定
├── docs/
│   └── image-resizer-design.md   # 設計書
├── LICENSE                       # MITライセンス
├── CLAUDE.md                     # プロジェクト設定
├── package.json                  # パッケージ定義（Bun）
├── bun.lockb                     # Bunロックファイル
├── tsconfig.json                 # TypeScript設定
├── vite.config.ts                # Vite設定（TailwindCSS v4プラグイン）
├── eslint.config.js              # ESLint設定（Flat Config）
└── README.md                     # プロジェクト説明
```

## 4. UMLによるシステムアーキテクチャ

### 4.1 コンポーネント図

```mermaid
graph TB
    subgraph "ブラウザ環境"
        UI[UIレイヤー]
        BL[ビジネスロジック]
        WA[Web APIs]
    end
    
    subgraph "UIレイヤー"
        DZ[DropZone<br/>Component]
        SP[Settings<br/>Panel]
        PQ[Processing<br/>Queue]
        RG[Result<br/>Gallery]
    end
    
    subgraph "ビジネスロジック"
        IP[Image<br/>Processor]
        FV[File<br/>Validator]
        DH[Download<br/>Helper]
    end
    
    subgraph "Web APIs"
        CA[Canvas API]
        FA[File API]
        DA[Download API]
    end
    
    DZ --> IP
    SP --> IP
    IP --> CA
    IP --> FV
    FV --> FA
    RG --> DH
    DH --> DA
    IP --> PQ
    IP --> RG
```

### 4.2 パッケージ図

```plantuml
@startuml
package "React Application" {
    package "Components" {
        [DropZone]
        [ImageProcessor]
        [ProcessingQueue]
        [ResultGallery]
        [SettingsPanel]
        [ThumbnailCard]
    }
    
    package "Business Logic" {
        [ImageResizer]
        [FileValidator]
        [DownloadHelper]
    }
    
    package "State Management" {
        [useImageProcessor]
        [useDropzone]
    }
}

package "External Libraries" {
    [react-dropzone]
    [TailwindCSS]
}

package "Browser APIs" {
    [Canvas API]
    [File API]
    [Blob API]
}

Components --> "State Management"
"State Management" --> "Business Logic"
"Business Logic" --> "Browser APIs"
Components --> "External Libraries"
@enduml
```

## 5. UMLによるデータフロー

### 5.1 アクティビティ図

```mermaid
graph TD
    Start([開始]) --> DragDrop[ファイルをドラッグ&ドロップ]
    DragDrop --> Validate{ファイル検証}
    
    Validate -->|有効| AddQueue[処理キューに追加]
    Validate -->|無効| ShowError[エラー表示]
    ShowError --> DragDrop
    
    AddQueue --> ProcessNext[次のファイルを処理]
    ProcessNext --> LoadImage[画像を読み込み]
    LoadImage --> CalculateSize[リサイズサイズ計算]
    CalculateSize --> ResizeCanvas[Canvas APIでリサイズ]
    ResizeCanvas --> CreateThumbnail[サムネイル生成]
    CreateThumbnail --> StoreResult[結果を保存]
    StoreResult --> DisplayResult[結果を表示]
    
    DisplayResult --> MoreFiles{他にファイルあり？}
    MoreFiles -->|はい| ProcessNext
    MoreFiles -->|いいえ| Complete[処理完了]
    
    Complete --> WaitDownload[ダウンロード待機]
    WaitDownload --> Download[ダウンロード実行]
    Download --> End([終了])
```

## 6. UMLクラス図

```plantuml
@startuml
class ImageFile {
    +id: string
    +file: File
    +name: string
    +size: number
    +type: string
    +status: ProcessingStatus
    +progress: number
}

enum ProcessingStatus {
    WAITING
    PROCESSING
    COMPLETED
    ERROR
}

class ProcessedImage {
    +id: string
    +originalFile: ImageFile
    +resizedBlob: Blob
    +thumbnailBlob: Blob
    +width: number
    +height: number
    +downloadUrl: string
}

class ResizeSettings {
    +maxWidth: number
    +maxHeight: number
    +quality: number
    +outputFormat: OutputFormat
    +saveToLocalStorage(): void
    +loadFromLocalStorage(): ResizeSettings
}

enum OutputFormat {
    JPEG
    PNG
    AVIF
}

class ImageProcessor {
    -settings: ResizeSettings
    -queue: ImageFile[]
    -results: ProcessedImage[]
    +addToQueue(files: File[]): void
    +processNext(): Promise<ProcessedImage>
    +updateSettings(settings: ResizeSettings): void
    -resize(file: ImageFile): Promise<Blob>
    -convertToFormat(canvas: HTMLCanvasElement, format: OutputFormat): Promise<Blob>
    -createThumbnail(blob: Blob): Promise<Blob>
}

class FileValidator {
    +validate(file: File): ValidationResult
    +isImageFile(file: File): boolean
    +checkFileSize(file: File): boolean
    +isSupportedFormat(file: File): boolean
}

class ValidationResult {
    +isValid: boolean
    +errors: string[]
}

class DownloadHelper {
    +downloadSingle(image: ProcessedImage): void
    +downloadAll(images: ProcessedImage[]): void
    -createDownloadLink(blob: Blob, filename: string): void
}

ImageProcessor --> ImageFile
ImageProcessor --> ProcessedImage
ImageProcessor --> ResizeSettings
ImageProcessor --> FileValidator
ProcessedImage --> ImageFile
ImageFile --> ProcessingStatus
FileValidator --> ValidationResult
DownloadHelper --> ProcessedImage
@enduml
```

## 7. 動的振る舞い

### 7.1 シーケンス図（画像処理フロー）

```mermaid
sequenceDiagram
    participant User
    participant DropZone
    participant FileValidator
    participant ImageProcessor
    participant Canvas
    participant LocalStorage
    participant ResultGallery
    
    User->>DropZone: ファイルをドロップ
    DropZone->>FileValidator: ファイル検証
    FileValidator-->>DropZone: 検証結果
    
    alt 検証成功
        DropZone->>ImageProcessor: ファイル追加
        ImageProcessor->>LocalStorage: 設定読み込み
        LocalStorage-->>ImageProcessor: サイズ・品質設定
        ImageProcessor->>ImageProcessor: キューに追加
        
        loop 各ファイルごと
            ImageProcessor->>Canvas: 画像読み込み
            Canvas-->>ImageProcessor: 画像データ
            ImageProcessor->>Canvas: リサイズ処理
            Canvas-->>ImageProcessor: リサイズ済みCanvas
            ImageProcessor->>Canvas: 形式変換（JPEG/PNG/AVIF、品質指定）
            Canvas-->>ImageProcessor: 変換済みBlob
            ImageProcessor->>Canvas: サムネイル生成
            Canvas-->>ImageProcessor: サムネイルBlob
            ImageProcessor->>ResultGallery: 結果追加
            ResultGallery->>User: サムネイル表示
        end
    else 検証失敗
        DropZone->>User: エラー表示
    end
    
    User->>ResultGallery: ダウンロードクリック
    ResultGallery->>User: 選択形式ファイルダウンロード
```

### 7.2 状態図

```plantuml
@startuml
[*] --> Idle : アプリ起動

Idle --> DragOver : ファイルドラッグ開始
DragOver --> Idle : ドラッグキャンセル
DragOver --> Processing : ファイルドロップ

Processing --> Processing : ファイル処理中
Processing --> DisplayResults : 処理完了
Processing --> Error : エラー発生

Error --> Idle : エラー確認

DisplayResults --> Downloading : ダウンロード開始
Downloading --> DisplayResults : ダウンロード完了
DisplayResults --> Idle : リセット

Idle --> [*] : アプリ終了
@enduml
```

### 7.3 ユースケース図

```plantuml
@startuml
actor ユーザー as User

rectangle "画像リサイズシステム" {
    usecase "画像をアップロード" as UC1
    usecase "ドラッグ&ドロップ" as UC1_1
    usecase "ファイル選択" as UC1_2
    
    usecase "リサイズ設定変更" as UC2
    usecase "最大サイズ指定" as UC2_1
    usecase "品質設定" as UC2_2
    
    usecase "画像処理状況確認" as UC3
    usecase "プログレス表示" as UC3_1
    usecase "エラー確認" as UC3_2
    
    usecase "結果をダウンロード" as UC4
    usecase "個別ダウンロード" as UC4_1
    usecase "一括ダウンロード" as UC4_2
    
    usecase "処理をリセット" as UC5
}

User --> UC1
UC1 <|-- UC1_1
UC1 <|-- UC1_2

User --> UC2
UC2 <|-- UC2_1
UC2 <|-- UC2_2

User --> UC3
UC3 <|-- UC3_1
UC3 <|-- UC3_2

User --> UC4
UC4 <|-- UC4_1
UC4 <|-- UC4_2

User --> UC5
@enduml
```

## 8. ウェブサイト構造

### 8.1 サイトマップ

```yaml
sitemap:
  - path: /
    title: "リサイズくん - 画像リサイズ・圧縮ツール【無料・サーバーアップロード不要】"
    type: "Home Page"
    sections:
      - id: "header"
        components: ["Logo", "Navigation (Privacy, Terms)"]
      - id: "main"
        components: ["H1 Title", "Description", "DropZone", "SettingsPanel", "ProcessingStatus"]
      - id: "footer"
        components: ["Copyright", "GitHub Link", "Privacy Policy", "Terms"]

  - path: /privacy
    title: "プライバシーポリシー | リサイズくん"
    type: "Legal Page"

  - path: /terms
    title: "利用規約 | リサイズくん"
    type: "Legal Page"
```

### 8.2 ページレイアウト構造

```mermaid
graph TD
    subgraph "メインページ (100vh)"
        Header["ヘッダー (60px)<br/>・ロゴ<br/>・設定ボタン"]
        
        subgraph "コンテンツエリア (calc(100vh - 120px))"
            subgraph "アップロードエリア (40%)"
                DropZone["ドロップゾーン<br/>・ドラッグ&ドロップエリア<br/>・ファイル選択ボタン<br/>・使用方法テキスト"]
                Settings["設定パネル<br/>・最大サイズ入力(デフォルト720px)<br/>・品質スライダー(50-100%)<br/>・出力形式選択(JPEG/PNG/AVIF)<br/>・設定保存(localStorage)"]
            end
            
            subgraph "処理状況エリア (20%)"
                Queue["処理キュー<br/>・待機中ファイルリスト<br/>・プログレスバー"]
            end
            
            subgraph "結果表示エリア (40%)"
                Gallery["結果ギャラリー<br/>・サムネイルグリッド<br/>・ダウンロードボタン<br/>・形式アイコン表示"]
            end
        end
        
        Footer["フッター (60px)<br/>・コピーライト<br/>・Chrome推奨表示"]
    end
```

### 8.3 レスポンシブデザイン考慮点

```yaml
responsive_design:
  breakpoints:
    mobile: "max-width: 640px"
    tablet: "max-width: 1024px"
    desktop: "min-width: 1025px"
    
  layout_changes:
    mobile:
      - グリッドを1カラムに変更
      - サムネイルサイズを100pxに縮小
      - 設定パネルをモーダル化
    tablet:
      - グリッドを2カラムに調整
      - サイドバー設定を折りたたみ可能に
    desktop:
      - フルグリッドレイアウト
      - すべての要素を常時表示
```

## 9. インフラストラクチャ構成

### 9.1 デプロイメントアーキテクチャ

```mermaid
graph LR
    subgraph "開発環境"
        Dev[開発者] --> Git[GitHub Repository]
    end
    
    subgraph "CI/CD"
        Git --> GHA[GitHub Actions]
        GHA --> Build[ビルドプロセス]
        Build --> Test[テスト実行]
    end
    
    subgraph "Cloudflare"
        Test --> CFP[Cloudflare Pages]
        CFP --> CDN[Cloudflare CDN]
        CDN --> Edge[Edge Network]
    end
    
    subgraph "エンドユーザー"
        Edge --> Browser[ブラウザ]
    end
```

### 9.2 Cloudflare Pages設定

```yaml
cloudflare_pages:
  build_settings:
    build_command: "npm run build"
    output_directory: "dist"
    root_directory: "/"
    
  environment_variables:
    NODE_VERSION: "22"
    
  deployment:
    production_branch: "main"
    preview_branches: ["develop", "feature/*"]
    
  optimization:
    - Auto Minify (HTML, CSS, JS)
    - Brotli圧縮
    - HTTP/3サポート
    
  headers:
    - path: "/*"
      headers:
        X-Frame-Options: "DENY"
        X-Content-Type-Options: "nosniff"
        Referrer-Policy: "strict-origin-when-cross-origin"
```

## 10. テスト戦略と項目

### 10.1 テスト戦略

```yaml
test_strategy:
  pyramid:
    unit_tests: 60%
    integration_tests: 30%
    e2e_tests: 10%
    
  coverage_target: 80%
  
  automation:
    - 単体テスト: 完全自動化
    - 統合テスト: 完全自動化
    - E2Eテスト: 主要フロー自動化
    - 手動テスト: ブラウザ互換性、UX確認
```

### 10.2 単体テスト項目

```yaml
unit_tests:
  imageResizer:
    - アスペクト比維持の計算ロジック
    - 最大サイズ制限の適用（720px）
    - JPEG/PNG/AVIF変換処理
    - 品質設定（50-100%）の適用
    - 形式別のオプション処理
    - エラーハンドリング
    
  fileValidator:
    - 有効な画像形式の判定（JPEG、PNG、WebP）
    - ファイルサイズ制限
    - MIMEタイプ検証
    - 拡張子チェック
    
  downloadHelper:
    - Blob生成（選択形式）
    - ファイル名生成（形式に応じた拡張子）
    - ダウンロードリンク作成
    
  localStorage:
    - 設定の保存処理
    - 設定の読み込み処理
    - デフォルト値へのフォールバック
```

### 10.3 統合テスト項目

```yaml
integration_tests:
  file_processing_flow:
    - ファイルアップロード → 検証 → 処理
    - 複数ファイルの順次処理
    - エラー時のキュー管理
    
  ui_interaction:
    - ドラッグ&ドロップ動作
    - 設定変更の反映
    - 結果表示の更新
```

### 10.4 E2Eテスト項目

```yaml
e2e_tests:
  critical_path:
    - 単一画像のアップロード → リサイズ → ダウンロード
    - 複数画像の一括処理
    - 設定変更後の処理
    - localStorage保存と読み込み
    
  browser_compatibility:
    - Chrome最新版のみ
```

### 10.5 非機能テスト項目

```yaml
performance_tests:
  metrics:
    - 初回ロード: < 2秒
    - 画像処理時間: < 1秒/画像（2MB以下）
    - メモリ使用量: < 500MB
    
accessibility_tests:
  wcag_compliance:
    - キーボード操作対応
    - スクリーンリーダー対応
    - カラーコントラスト基準
    - フォーカス表示
    
security_tests:
  client_side:
    - XSS脆弱性チェック
    - ファイルアップロード検証
    - Content Security Policy
```

## 11. 非機能要件への対応

### 11.1 パフォーマンス最適化

```yaml
performance_optimization:
  image_processing:
    - Web Workerでのバックグラウンド処理
    - 段階的な品質調整
    - メモリ効率的なストリーミング処理
    
  ui_responsiveness:
    - 仮想スクロールによる大量サムネイル表示
    - 遅延ローディング
    - デバウンス処理
    
  bundle_optimization:
    - コード分割
    - Tree Shaking
    - 動的インポート
```

### 11.2 セキュリティ対策

```yaml
security_measures:
  client_side_validation:
    - ファイルタイプ検証
    - サイズ制限
    - 悪意のあるコンテンツチェック
    
  privacy_protection:
    - クライアント完結処理
    - データの非永続化
    - セッション終了時の自動クリア
    
  csp_headers:
    default-src: "'self'"
    script-src: "'self' 'unsafe-inline'"
    style-src: "'self' 'unsafe-inline'"
    img-src: "'self' data: blob:"
```

### 11.3 アクセシビリティ

```yaml
accessibility_features:
  keyboard_navigation:
    - Tab順序の適切な設定
    - Enterキーでのファイル選択
    - Escapeキーでのモーダルクローズ
    
  screen_reader:
    - 適切なARIA属性
    - 処理状況のライブリージョン
    - 画像の代替テキスト
    
  visual_design:
    - 高コントラストモード対応
    - フォーカスインジケーター
    - エラーメッセージの明確化
```

## 12. 実装上の注意点

### 12.1 画像処理の最適化

```yaml
image_processing_tips:
  memory_management:
    - 大きな画像は分割処理
    - 処理済み画像の適切な破棄
    - URLオブジェクトのrevoke

  quality_settings:
    - JPEG品質: デフォルト80%（50-100%）
    - PNG: 可逆圧縮（品質設定なし）
    - AVIF品質: デフォルト80%（50-100%）
    - デフォルト出力形式: JPEG

  canvas_handling:
    - OffscreenCanvasの活用
    - ImageBitmapの使用
    - 形式別変換: toBlob(mimeType, quality)

  localStorage_management:
    - 設定保存キー: 'imageResizerSettings'
    - 最大サイズ: デフォルト720px
    - 品質設定: デフォルト80%
    - 出力形式: デフォルトJPEG
```

### 12.2 エラーハンドリング

```yaml
error_handling:
  user_errors:
    - 非画像ファイル: "画像ファイルを選択してください"
    - サイズ超過: "ファイルサイズが大きすぎます（最大10MB）"
    - 処理失敗: "画像の処理に失敗しました"
    
  system_errors:
    - メモリ不足: 処理を分割または中断
    - ブラウザ非対応: 代替手段の提示
    
  recovery_strategy:
    - 失敗したファイルをスキップ
    - 部分的な結果を保持
    - リトライオプション提供
```

### 12.3 UX考慮事項

```yaml
ux_considerations:
  feedback:
    - 処理中のプログレスバー表示
    - 完了時の通知
    - エラー時の具体的な対処法
    - 形式別アイコン表示

  defaults:
    - 最大サイズ: 720px
    - 品質: 80%
    - 出力形式: JPEG（選択可能）
    - 設定はlocalStorageに自動保存

  simplicity:
    - 最小限の設定項目
    - 直感的なドラッグ&ドロップ
    - ワンクリックダウンロード
    - 品質スライダー（50-100%）
    - 形式選択ボタン（JPEG/PNG/AVIF）
```

## 13. SEO対策実装

### 13.1 包括的SEO実装

本プロジェクトでは、検索エンジン最適化とソーシャルメディア対応のため、以下のSEO対策を実装しています。

#### 静的メタデータ（index.html）
```html
<!-- JavaScript実行前のSEO対策 -->
<title>リサイズくん - 画像リサイズ・圧縮ツール【無料・サーバーアップロード不要】</title>
<meta name="description" content="ブラウザ完結で安心！リサイズくんは、プライバシー保護の無料画像リサイズ・圧縮ツール..." />
<link rel="canonical" href="https://resize.kojin.works/" />
```

#### 動的メタデータ（SEOHead.tsx）
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

#### 構造化データ（JSON-LD）
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

#### SEOファイル
```yaml
robots.txt:
  - User-agent: *
  - Allow: /
  - Sitemap: https://resize.kojin.works/sitemap.xml

sitemap.xml:
  pages:
    - url: https://resize.kojin.works/
      priority: 1.0
      changefreq: monthly
    - url: https://resize.kojin.works/privacy
      priority: 0.5
      changefreq: yearly
    - url: https://resize.kojin.works/terms
      priority: 0.5
      changefreq: yearly
```

#### SEO改善履歴

**2025-10-29 包括的SEO対策実施**
- P0（緊急）対応:
  - robots.txt/sitemap.xmlのURL修正（example.com → resize.kojin.works）
  - sitemap.xmlの日付更新
  - H1タグ追加（見出し階層エラー解消）
  - Canonical URLの動的設定
- P1（高優先度）対応:
  - index.htmlに静的メタデータ追加
  - 構造化データ改善（aggregateRating削除、author/publisher追加）

#### 期待される効果
```yaml
short_term: # 1ヶ月
  - Google Search Consoleへのインデックス登録
  - クロールエラーの解消
  - 基本的な検索可視性の向上

mid_term: # 3ヶ月
  - ブランドキーワード（"リサイズくん"）での上位表示
  - SNSシェア時の適切なプレビュー表示
  - 構造化データのリッチリザルト表示

long_term: # 6ヶ月以降
  - 一般キーワード（"画像リサイズ 無料"等）での上位表示
  - オーガニックトラフィックの増加
  - プライバシー保護訴求での差別化
```

## 14. 付録

### 14.1 用語集

```yaml
glossary:
  - Canvas API: ブラウザ上で画像処理を行うためのAPI
  - Blob: Binary Large Objectの略、ファイルデータを扱うオブジェクト
  - Web Worker: バックグラウンドでJavaScriptを実行する仕組み
  - CSP: Content Security Policy、XSS攻撃を防ぐセキュリティ機能
  - WCAG: Web Content Accessibility Guidelines、アクセシビリティ基準
```

### 14.2 参考資料

```yaml
references:
  documentation:
    - MDN Web Docs - Canvas API
    - React Documentation
    - Cloudflare Pages Documentation
    
  libraries:
    - react-dropzone GitHub
    - TailwindCSS Documentation
    - Vite Guide
    
  standards:
    - WCAG 2.1 Guidelines
    - Web Image Formats Guide
```

### 14.3 今後の拡張案

```yaml
future_enhancements:
  features:
    - バッチ処理の並列化
    - 画像フォーマット変換機能
    - 基本的な画像編集機能（回転、切り抜き）
    - プリセット保存機能
    
  technical:
    - WebAssemblyによる高速化
    - Service Workerでオフライン対応
    - PWA化
    
  business:
    - 使用統計の収集（プライバシー配慮）
    - 多言語対応
    - ダークモード対応
```

### 14.4 実装の重要ポイント

```yaml
format_conversion:
  canvas_api:
    jpeg:
      mimeType: "image/jpeg"
      quality_range: "0.5 - 1.0"  # 50% - 100%
      extension: ".jpg"
    png:
      mimeType: "image/png"
      quality: null  # PNGは可逆圧縮
      extension: ".png"
    avif:
      mimeType: "image/avif"
      quality_range: "0.5 - 1.0"  # 50% - 100%
      extension: ".avif"
    example: |
      const convertImage = async (canvas, format, quality) => {
        const mimeType = {
          'JPEG': 'image/jpeg',
          'PNG': 'image/png',
          'AVIF': 'image/avif'
        }[format];

        const qualityValue = format === 'PNG' ? undefined : quality / 100;

        return new Promise((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob),
            mimeType,
            qualityValue
          );
        });
      };

  file_naming:
    pattern: "filename_720px.[ext]"
    extensions:
      JPEG: ".jpg"
      PNG: ".png"
      AVIF: ".avif"

  localStorage_structure:
    key: "imageResizerSettings"
    data:
      maxSize: 720
      quality: 80  # パーセント値で保存
      outputFormat: "JPEG"  # デフォルト
    example: |
      const defaultSettings = {
        maxSize: 720,
        quality: 80,
        outputFormat: 'JPEG'
      };
      const saveSettings = (settings) => {
        localStorage.setItem('imageResizerSettings', JSON.stringify(settings));
      };
      const loadSettings = () => {
        const saved = localStorage.getItem('imageResizerSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
      };
      
  chrome_only_features:
    - OffscreenCanvas対応
    - ImageBitmap API
    - 高速なCanvas処理
    - ドラッグ&ドロップの安定動作
    
  resize_calculation:
    maintain_aspect_ratio: true
    example: |
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      if (originalWidth > maxSize || originalHeight > maxSize) {
        if (aspectRatio > 1) {
          newWidth = maxSize;
          newHeight = maxSize / aspectRatio;
        } else {
          newHeight = maxSize;
          newWidth = maxSize * aspectRatio;
        }
      }
```

## 15. プロジェクト初期設定コマンド

```bash
# Bunのインストール（未インストールの場合）
curl -fsSL https://bun.sh/install | bash

# プロジェクト作成
bun create vite@latest image-resizer -- --template react-ts
cd image-resizer

# 依存関係インストール
bun add react-dropzone react-helmet-async react-router-dom
bun add @jsquash/avif @jsquash/oxipng
bun add -D @tailwindcss/vite tailwindcss
bun add -D @types/react @types/react-dom @types/node

# テストツール
bun add -D vitest @testing-library/react @testing-library/jest-dom jsdom

# ESLint設定
bun add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals

# 開発サーバー起動
bun run dev

# TypeScriptチェック + ビルド
bun run build

# プレビュー
bun run preview

# テスト実行
bun test

# Cloudflare Pagesへのデプロイ
# GitHubと連携して自動デプロイ設定
# ビルドコマンド: bun run build
# 出力ディレクトリ: dist
```

---

*この設計書は生成AIによる実装を前提に作成されています。実装時は各セクションの設計に従って、段階的に開発を進めてください。*