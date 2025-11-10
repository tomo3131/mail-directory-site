# デプロイ手順書 - メールディレクトリサイト

## 📌 デプロイ概要

このプロジェクトは **Vercel** にデプロイするように設計されています。Vercelは無料プランでも本格的なプロダクションアプリケーションをホストでき、自動デプロイ・プレビュー・Analytics機能が使えます。

---

## 🚀 ステップ1: Supabaseのセットアップ

### 1.1 Supabaseアカウント作成

1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 1.2 新しいプロジェクトを作成

1. 「New Project」をクリック
2. 以下の情報を入力：
   - **Project Name**: `mail-directory-site` または任意の名前
   - **Database Password**: 強力なパスワードを生成（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択
   - **Pricing Plan**: `Free` を選択

3. 「Create new project」をクリック（作成に1-2分かかります）

### 1.3 APIキーを取得

1. 左サイドバーから **Settings** → **API** をクリック
2. 以下の値をコピー：
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 1.4 データベーステーブルを作成

1. 左サイドバーから **SQL Editor** をクリック
2. 「+ New query」をクリック
3. 以下のSQLを実行：

```sql
-- カテゴリテーブル
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ブランドテーブル
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  logo_url TEXT,
  email_address VARCHAR(255) UNIQUE NOT NULL,
  website_url TEXT,
  description TEXT,
  total_emails INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- メールテーブル
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  subject VARCHAR(500) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  html_body TEXT,
  text_body TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  image_urls JSONB DEFAULT '[]'::jsonb,
  view_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックス作成
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_category_id ON brands(category_id);
CREATE INDEX idx_emails_brand_id ON emails(brand_id);
CREATE INDEX idx_emails_sent_at ON emails(sent_at DESC);
CREATE INDEX idx_emails_is_public ON emails(is_public);

-- Row Level Security (RLS) 設定
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "Anyone can view public brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Anyone can view public emails" ON emails FOR SELECT USING (is_public = true);
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- ユーザーは自分のデータのみ閲覧・更新可能
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
```

4. 「Run」をクリックして実行

---

## 🔧 ステップ2: Stripeのセットアップ（オプション）

### 2.1 Stripeアカウント作成

1. https://dashboard.stripe.com/register にアクセス
2. アカウントを作成

### 2.2 APIキーを取得

1. 左サイドバーから **開発者** → **APIキー** をクリック
2. 以下の値をコピー：
   - **公開可能キー** (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - **シークレットキー** (`STRIPE_SECRET_KEY`)

### 2.3 商品とプランを作成

1. **商品カタログ** → **商品を追加** をクリック
2. 以下のプランを作成：
   - **プロプラン（月額）**: ¥9,800/月
   - **プロプラン（年額）**: ¥98,000/年
   - **チームプラン（月額）**: ¥24,800/月
   - **チームプラン（年額）**: ¥248,000/年

3. 各プランの **Price ID** をコピー

---

## 🌐 ステップ3: Vercelへのデプロイ

### 3.1 GitHubにpush

```bash
# メールディレクトリサイトのディレクトリに移動
cd /Users/akkin/my-first-miyabi-agentv2/mail-directory-site

# Gitリポジトリを初期化（まだの場合）
git init

# .gitignoreファイルを確認
# node_modules, .env.local, .next などが除外されているか確認

# すべてのファイルをステージング
git add .

# コミット
git commit -m "feat: Initial commit - Mail Directory Site MVP"

# GitHubリポジトリを作成（GitHub CLIを使う場合）
gh repo create mail-directory-site --public --source=. --remote=origin --push

# または、GitHubで手動でリポジトリを作成してpush
git remote add origin https://github.com/YOUR_USERNAME/mail-directory-site.git
git branch -M main
git push -u origin main
```

### 3.2 Vercelでインポート

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. 「Add New...」→「Project」をクリック
4. GitHubリポジトリを選択: `mail-directory-site`
5. 「Import」をクリック

### 3.3 プロジェクト設定

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）

### 3.4 環境変数を設定

「Environment Variables」セクションで以下を追加：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# サイトURL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Google Analytics（オプション）
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 3.5 デプロイ

1. 「Deploy」ボタンをクリック
2. 数分待つとデプロイ完了！🎉
3. デプロイされたURLをクリックしてサイトを確認

---

## 🎯 ステップ4: カスタムドメインの設定（オプション）

### 4.1 ドメインを購入

- お名前.com、ムームードメイン、Cloudflare Registrarなどで購入

### 4.2 Vercelでドメインを追加

1. Vercelプロジェクトの **Settings** → **Domains** をクリック
2. 購入したドメインを入力（例: `mailarchive.jp`）
3. 「Add」をクリック
4. DNS設定の指示に従う

### 4.3 DNS設定

ドメインレジストラの管理画面で以下のレコードを追加：

```
Type: A
Name: @ (またはルートドメイン)
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.4 SSL証明書の自動発行

Vercelが自動的にLet's EncryptのSSL証明書を発行します（数分〜1時間）。

---

## 🔄 ステップ5: 継続的デプロイ（CI/CD）

Vercelは自動的にGitHubと連携し、以下の動作をします：

- **mainブランチへのpush** → 本番環境に自動デプロイ
- **プルリクエスト作成** → プレビュー環境を自動作成
- **コミット** → 自動ビルド & テスト

---

## 📊 ステップ6: 監視・分析（オプション）

### 6.1 Vercel Analytics

1. Vercelプロジェクトの **Analytics** タブをクリック
2. 「Enable Analytics」をクリック
3. パフォーマンス・訪問者データが自動収集される

### 6.2 Google Analytics

1. https://analytics.google.com でプロパティを作成
2. トラッキングIDを取得（G-XXXXXXXXXX）
3. Vercelの環境変数に `NEXT_PUBLIC_GA_TRACKING_ID` を追加

---

## 🛠️ トラブルシューティング

### ビルドエラーが発生する

```bash
# ローカルでビルドして確認
cd frontend
npm run build

# エラーメッセージを確認して修正
```

### 環境変数が反映されない

- Vercelの **Settings** → **Environment Variables** で設定を確認
- 設定後、再デプロイが必要（Deployments → ... → Redeploy）

### Supabaseに接続できない

- `.env.local` のURLとキーが正しいか確認
- SupabaseのRLS（Row Level Security）ポリシーを確認

---

## 📝 次のステップ

MVP（最小限の製品）が完成しました！次に実装すべき機能：

### フェーズ2（機能拡張）

1. **ユーザー認証機能**
   - Supabase Authを使った登録・ログイン
   - プロフィール編集

2. **検索機能**
   - Supabase Full-Text Search
   - またはAlgolia統合

3. **Stripe決済統合**
   - プロプラン・チームプランの販売
   - サブスクリプション管理

4. **メール受信システム**
   - AWS SES + Lambda
   - または Cloudflare Email Routing + Workers

5. **管理画面**
   - ブランド追加・編集
   - メール一覧・削除

---

## 🎊 完了！

おめでとうございます！メールディレクトリサイトのMVPが本番環境にデプロイされました。

これで、世界中の人があなたのサイトにアクセスできます。

---

**次回のデプロイ時**:

```bash
# コードを変更
git add .
git commit -m "feat: Add new feature"
git push origin main

# Vercelが自動的にデプロイ！
```

**質問や問題があれば、Vercelのドキュメントを参照**:
- https://vercel.com/docs
- https://nextjs.org/docs
- https://supabase.com/docs
