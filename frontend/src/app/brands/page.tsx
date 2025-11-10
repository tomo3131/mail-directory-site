import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBrands, getCategories } from "@/lib/supabase-server";
import { Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // 60秒ごとに再検証

export default async function BrandsPage() {
  const [brands, categories] = await Promise.all([
    getAllBrands(),
    getCategories()
  ]);

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
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            ブランドディレクトリ
          </h1>
          <p className="text-lg text-zinc-600">
            {brands.length}社のブランドのメールマーケティングキャンペーンをアーカイブ
          </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant="default" size="sm">
            すべて
          </Button>
          {categories.map((category) => (
            <Button key={category.id} variant="outline" size="sm">
              {category.name}
            </Button>
          ))}
        </div>

        {/* ブランド一覧 */}
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 text-lg">
              ブランドが見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => {
              const category = categories.find(c => c.id === brand.category_id);

              return (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{brand.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {category?.name}
                        </CardDescription>
                      </div>
                      {brand.logo_url && (
                        <div className="w-16 h-16 bg-zinc-100 rounded-lg"></div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                      {brand.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{brand.total_emails}通</span>
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

                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/brands/${brand.slug}`}>
                        メール一覧を見る
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 表示件数表示 */}
        {brands.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-zinc-600 mb-4">
              {brands.length}件中 {brands.length}件を表示
            </p>
            <Button variant="outline">
              さらに読み込む
            </Button>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-zinc-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-zinc-900 mb-4">MailArchive.jp</h3>
              <p className="text-sm text-zinc-600">
                日本最大級のメールマーケティングアーカイブ
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">サービス</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/brands">ブランド一覧</Link></li>
                <li><Link href="/search">検索</Link></li>
                <li><Link href="/pricing">料金プラン</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">サポート</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/help">ヘルプ</Link></li>
                <li><Link href="/contact">お問い合わせ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">法的事項</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/terms">利用規約</Link></li>
                <li><Link href="/privacy">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-200 text-center text-sm text-zinc-600">
            © 2024 MailArchive.jp All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
