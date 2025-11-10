import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBrandBySlug, getEmailsByBrand, getCategories } from "@/lib/supabase-server";
import { Calendar, Eye, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // 60秒ごとに再検証

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const [categories, brandEmails] = await Promise.all([
    getCategories(),
    getEmailsByBrand(brand.id)
  ]);

  const category = categories.find((c) => c.id === brand.category_id);

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

      {/* ブランド情報ヘッダー */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-6">
            {brand.logo_url ? (
              <div className="w-24 h-24 bg-zinc-100 rounded-lg"></div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900">{brand.name}</h1>
                {category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {category.name}
                  </span>
                )}
              </div>

              <p className="text-lg text-zinc-600 mb-4">{brand.description}</p>

              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{brand.total_emails}通のメール</span>
                </div>
                {brand.website_url && (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>公式サイト</span>
                  </a>
                )}
              </div>
            </div>

            <Button>
              このブランドをフォロー
            </Button>
          </div>
        </div>
      </div>

      {/* メール一覧 */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            最近のメール
          </h2>
          <p className="text-zinc-600">
            {brandEmails.length}件のメールが見つかりました
          </p>
        </div>

        {brandEmails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 text-lg">
              まだメールがありません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {brandEmails.map((email) => {
              const sentDate = new Date(email.sent_at);

              return (
                <Card key={email.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          <Link
                            href={`/emails/${email.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {email.subject}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {sentDate.toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{email.view_count}回閲覧</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-600 line-clamp-2">
                        {email.text_body}
                      </p>
                      <Button asChild variant="outline">
                        <Link href={`/emails/${email.id}`}>
                          詳細を見る
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* もっと見るボタン */}
        {brandEmails.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline">
              もっと見る
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
