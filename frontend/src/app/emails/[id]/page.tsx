import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEmailById, getBrandBySlug, getEmailsByBrand, getAllBrands } from "@/lib/supabase-server";
import { Calendar, Eye, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // 60秒ごとに再検証

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const email = await getEmailById(id);

  if (!email) {
    notFound();
  }

  const brands = await getAllBrands();
  const brand = brands.find((b) => b.id === email.brand_id);

  if (!brand) {
    notFound();
  }

  const relatedEmails = await getEmailsByBrand(brand.id, 3);
  const sentDate = new Date(email.sent_at);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-zinc-900">
              MailArchive.jp
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/brands" className="text-zinc-600 hover:text-zinc-900 font-medium">
                ブランド
              </Link>
              <Link href="/search" className="text-zinc-600 hover:text-zinc-900">
                検索
              </Link>
              <Button asChild>
                <Link href="/signup">無料で始める</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/brands/${brand.slug}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {brand.name}のメール一覧に戻る
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                {/* ヘッダー情報 */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-zinc-900 mb-4">
                    {email.subject}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-zinc-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {sentDate.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{email.view_count}回閲覧</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      共有
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </div>

                {/* 送信元情報 */}
                <div className="mb-8 p-4 bg-zinc-50 rounded-lg">
                  <div className="text-sm text-zinc-600 mb-1">送信元</div>
                  <div className="font-semibold text-zinc-900">
                    {email.from_name} &lt;{email.from_email}&gt;
                  </div>
                </div>

                {/* メール本文 */}
                <div className="prose prose-zinc max-w-none">
                  <div
                    className="bg-white p-6 rounded-lg border border-zinc-200"
                    dangerouslySetInnerHTML={{ __html: email.html_body || '' }}
                  />
                </div>

                {/* テキスト版表示（HTMLが空の場合） */}
                {!email.html_body && (
                  <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
                    {email.text_body}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 関連メール */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                {brand.name}の他のメール
              </h2>
              <div className="space-y-4">
                {relatedEmails
                  .filter((e) => e.id !== email.id)
                  .map((relatedEmail) => (
                    <Card key={relatedEmail.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          href={`/emails/${relatedEmail.id}`}
                          className="block hover:text-blue-600"
                        >
                          <div className="font-semibold text-zinc-900 mb-2">
                            {relatedEmail.subject}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {new Date(relatedEmail.sent_at).toLocaleDateString('ja-JP')}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div>
            {/* ブランド情報 */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-zinc-900 mb-4">ブランド情報</h3>

                <Link href={`/brands/${brand.slug}`} className="block mb-4">
                  {brand.logo_url ? (
                    <div className="w-16 h-16 bg-zinc-100 rounded-lg mb-3"></div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-white">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="font-semibold text-zinc-900 hover:text-blue-600">
                    {brand.name}
                  </div>
                </Link>

                <p className="text-sm text-zinc-600 mb-4">
                  {brand.description}
                </p>

                <div className="text-sm text-zinc-500 mb-4">
                  {brand.total_emails}通のメール
                </div>

                <Button asChild className="w-full">
                  <Link href={`/brands/${brand.slug}`}>
                    全てのメールを見る
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* プレミアム機能の案内 */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-zinc-900 mb-2">
                  🎯 プロプランで更に便利に
                </h3>
                <p className="text-sm text-zinc-600 mb-4">
                  全期間アーカイブ、キーワードアラート、コレクション機能が使えます。
                </p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/pricing">
                    プランを見る
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
