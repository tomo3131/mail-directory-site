import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* ヒーローセクション */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
            競合のメールキャンペーンを
            <br />
            <span className="text-blue-600">"盗み見"</span>していますか？
          </h1>

          <p className="text-xl md:text-2xl text-zinc-600 mb-8 max-w-3xl mx-auto">
            日本最大級のメールマーケティングアーカイブで
            <br />
            1,000社以上のプロモーション戦略を丸裸に。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/signup">
                今すぐ無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/brands">
                ブランド一覧を見る
              </Link>
            </Button>
          </div>

          <p className="text-sm text-zinc-500">
            ※クレジットカード不要。30秒で登録完了。
          </p>
        </div>

        {/* 有名ブランドロゴ */}
        <div className="mt-20">
          <p className="text-center text-sm text-zinc-500 mb-8">
            これらの有名ブランドを含む1,000社以上のメールをアーカイブ
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="text-2xl font-bold text-zinc-700">UNIQLO</div>
            <div className="text-2xl font-bold text-zinc-700">楽天</div>
            <div className="text-2xl font-bold text-zinc-700">Amazon</div>
            <div className="text-2xl font-bold text-zinc-700">MUJI</div>
            <div className="text-2xl font-bold text-zinc-700">ZOZOTOWN</div>
          </div>
        </div>
      </section>

      {/* 問題提起セクション */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-zinc-900 mb-12">
              こんな悩み、ありませんか？
            </h2>

            <div className="space-y-6">
              {[
                "競合のメールキャンペーンを追いかけるために、10個以上のメールアドレスを管理している",
                "過去のセール事例を探したいのに、自分のメールボックスから見つけられない",
                "上司から「他社はどんなメールを送っているか調べて」と言われて途方に暮れる",
                "メールマーケティングのアイデアが枯渇して、毎回同じようなキャンペーンになってしまう",
                "業界のトレンドを把握したいが、情報が散らばっていて時間がかかる"
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-sm">✓</span>
                  </div>
                  <p className="text-lg text-zinc-700">{problem}</p>
                </div>
              ))}
            </div>

            <p className="mt-12 text-center text-xl text-zinc-600">
              もし1つでも当てはまるなら、この先を読み進めてください。
              <br />
              <span className="font-semibold text-zinc-900">あなたの悩みを一瞬で解決する方法があります。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ソリューション提示セクション */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-zinc-900 mb-4">
              MailArchive.jpなら、
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-blue-600 mb-16">
              すべて解決できます。
            </h2>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                    1,000社以上のメールを一箇所に
                  </h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    楽天、Amazon、ユニクロ、無印良品...
                    <br />
                    主要ブランドのメールが毎日自動で追加されます。
                    <br />
                    もう、複数のメールアドレスを管理する必要はありません。
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                    過去3年分のアーカイブを検索
                  </h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    「去年のブラックフライデーで、競合は何をやった？」
                    <br />
                    そんな疑問も、3秒で解決。
                    <br />
                    強力な検索機能で、欲しい情報が一瞬で見つかります。
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                    キーワードアラートで自動追跡
                  </h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    「セール」「新商品」「限定」など、
                    <br />
                    気になるキーワードを登録すれば、
                    <br />
                    該当メールが届いた瞬間に通知。
                    もう、重要な情報を見逃しません。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  今すぐ30日間無料で試す
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-zinc-500">
                30日以内に解約すれば、一切課金されません。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
