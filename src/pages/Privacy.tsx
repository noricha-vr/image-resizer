import { SEOHead } from '../components/SEOHead';

/**
 * プライバシーポリシーページ
 */
export function Privacy() {
  return (
    <>
      <SEOHead
        title="プライバシーポリシー"
        description="リサイズくんのプライバシーポリシー。個人情報の取り扱い、画像データの処理方法、Cookie利用などについて説明します。"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 基本方針</h2>
            <p className="text-gray-700 leading-relaxed">
              リサイズくん（以下「当サービス」）は、ユーザーのプライバシー保護を最優先事項として運営されています。
              当サービスは完全にブラウザ内で動作し、画像データがサーバーにアップロードされることは一切ありません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 画像データの取り扱い</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 処理方法</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>すべての画像処理はユーザーのブラウザ内で完結します</li>
                  <li>画像ファイルが外部サーバーに送信されることはありません</li>
                  <li>処理された画像は自動的にメモリから削除されます</li>
                  <li>当サービスはオフライン環境でも動作可能です</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">2.2 保存期間</h3>
                <p className="text-gray-700 leading-relaxed">
                  画像データはブラウザのメモリ上でのみ一時的に保持され、ページを閉じるかリロードすると完全に消去されます。
                  当サービスは画像データを一切保存しません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. ローカルストレージの利用</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">3.1 保存される情報</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  ユーザーの利便性向上のため、以下の設定情報のみをブラウザのローカルストレージに保存します：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>最大画像サイズ設定（デフォルト: 720px）</li>
                  <li>画質設定（デフォルト: 80%）</li>
                  <li>出力形式設定（JPEG/PNG/AVIF）</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">3.2 個人情報との関連</h3>
                <p className="text-gray-700 leading-relaxed">
                  これらの設定情報は個人を特定できる情報を含まず、ユーザーのデバイス上でのみ保存されます。
                  外部サーバーへの送信は一切行われません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookieの利用</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、以下の目的でCookieまたは類似の技術を使用する場合があります：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>サービスの機能維持（必須Cookie）</li>
              <li>アクセス解析（任意、今後実装予定）</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              ユーザーはブラウザの設定でCookieを無効化できますが、一部機能が正常に動作しなくなる可能性があります。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. アクセス解析</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、サービス改善のため、将来的にアクセス解析ツール（Google Analytics等）を導入する可能性があります。
              その際は、以下の情報が収集される場合があります：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>アクセス日時</li>
              <li>ページビュー数</li>
              <li>利用環境（ブラウザ、OS、デバイス種別）</li>
              <li>おおまかな地域情報（IPアドレスから推定）</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              これらの情報は統計的な分析のみに使用され、個人を特定する目的では使用されません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 第三者への情報提供</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、以下の場合を除き、収集した情報を第三者に提供することはありません：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. セキュリティ</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、情報の安全性を確保するため、以下の対策を実施しています：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>HTTPS通信による暗号化</li>
              <li>クライアントサイド処理による情報漏洩リスクの最小化</li>
              <li>不正アクセス防止のための技術的対策</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. お子様の個人情報</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、13歳未満のお子様から意図的に個人情報を収集することはありません。
              保護者の方は、お子様がインターネットを利用する際には監督をお願いいたします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. プライバシーポリシーの変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを予告なく変更する場合があります。
              変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              本プライバシーポリシーに関するご質問やご意見は、GitHubのIssueまたはDiscussionsにてお問い合わせください。
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              制定日: 2025年1月1日<br />
              最終更新日: 2025年1月1日
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
