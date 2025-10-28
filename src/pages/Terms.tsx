import { SEOHead } from '../components/SEOHead';

/**
 * 利用規約ページ
 */
export function Terms() {
  return (
    <>
      <SEOHead
        title="利用規約"
        description="リサイズくんの利用規約。サービスの利用条件、禁止事項、免責事項などについて説明します。"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. はじめに</h2>
            <p className="text-gray-700 leading-relaxed">
              本利用規約（以下「本規約」）は、リサイズくん（以下「当サービス」）の利用条件を定めるものです。
              ユーザーは、当サービスを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. サービスの概要</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                当サービスは、ユーザーが画像ファイルをリサイズおよび形式変換できる無料のウェブアプリケーションです。
              </p>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 提供機能</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>画像のリサイズ（最大サイズ指定）</li>
                  <li>画像形式の変換（JPEG、PNG、AVIF）</li>
                  <li>画質・圧縮レベルの調整</li>
                  <li>一括処理機能</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">2.2 処理方式</h3>
                <p className="text-gray-700 leading-relaxed">
                  すべての画像処理はユーザーのブラウザ内で完結し、サーバーへのアップロードは発生しません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 利用条件</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">3.1 利用資格</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスは、インターネット接続が可能で、推奨ブラウザ（Google Chrome最新版）を使用できる方であれば、
                  どなたでも無料でご利用いただけます。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">3.2 未成年者の利用</h3>
                <p className="text-gray-700 leading-relaxed">
                  未成年者が当サービスを利用する場合は、保護者の同意を得た上でご利用ください。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">3.3 アカウント</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスはアカウント登録不要で利用できます。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 禁止事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ユーザーは、当サービスの利用にあたり、以下の行為を行ってはなりません：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>他者の著作権、商標権、肖像権、プライバシー権その他の権利を侵害する行為</li>
              <li>当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>リバースエンジニアリング、逆コンパイル、逆アセンブル等の行為</li>
              <li>当サービスを商用目的で大規模に利用する行為（過度な負荷をかける行為）</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 著作権・知的財産権</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">5.1 サービスの著作権</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスのウェブサイト、ソフトウェア、デザイン、ロゴ等に関する知的財産権は、
                  当サービス運営者または正当な権利を有する第三者に帰属します。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">5.2 画像の著作権</h3>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーがアップロードする画像の著作権はユーザーに帰属します。
                  当サービスは画像データを保存・収集しないため、画像に関する権利を主張することはありません。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">5.3 権利侵害の責任</h3>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、第三者の著作権や権利を侵害しない画像のみを使用する責任を負います。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 免責事項</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">6.1 サービスの品質</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスは、現状有姿で提供されます。当サービス運営者は、サービスの完全性、正確性、
                  有用性、安全性、信頼性等について、いかなる保証も行いません。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">6.2 処理結果</h3>
                <p className="text-gray-700 leading-relaxed">
                  画像処理の結果について、当サービス運営者は一切の責任を負いません。
                  重要な画像については、必ず元データのバックアップを取った上でご利用ください。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">6.3 ブラウザ互換性</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスはGoogle Chrome最新版での動作を推奨しています。
                  他のブラウザでの動作については保証できません。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">6.4 損害賠償の制限</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスの利用により生じた損害（データの消失、デバイスの故障、その他一切の損害）について、
                  当サービス運営者は一切の責任を負いません。ただし、当サービス運営者の故意または重過失による場合を除きます。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. サービスの変更・停止</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">7.1 サービス内容の変更</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービス運営者は、ユーザーへの事前通知なく、サービス内容を変更または追加することができます。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">7.2 サービスの中断・停止</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービス運営者は、以下の場合にサービスを一時的に中断または停止することができます：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                  <li>サービスの保守・点検を行う場合</li>
                  <li>システム障害が発生した場合</li>
                  <li>天災、停電等の不可抗力により運営が困難になった場合</li>
                  <li>その他、運営上または技術上の理由による場合</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">7.3 サービスの終了</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービス運営者は、任意の理由により、事前の通知をもってサービスを終了することができます。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. オープンソース</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスはオープンソースプロジェクトとして公開されています。
              ソースコードはGitHubで閲覧でき、コミュニティによる改善提案を歓迎します。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. 準拠法・管轄裁判所</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">9.1 準拠法</h3>
                <p className="text-gray-700 leading-relaxed">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">9.2 管轄裁判所</h3>
                <p className="text-gray-700 leading-relaxed">
                  当サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. 規約の変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービス運営者は、必要に応じて本規約を変更することができます。
              変更後の利用規約は、本ページに掲載した時点で効力を生じるものとします。
              変更後も当サービスを継続して利用された場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約に関するご質問やご意見は、GitHubのIssueまたはDiscussionsにてお問い合わせください。
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
