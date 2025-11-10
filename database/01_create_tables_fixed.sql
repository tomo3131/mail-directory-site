-- ====================================
-- メールディレクトリサイト - データベーススキーマ
-- ====================================

-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. カテゴリテーブル
-- ====================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- 2. ブランドテーブル
-- ====================================
CREATE TABLE IF NOT EXISTS brands (
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

-- ====================================
-- 3. メールテーブル
-- ====================================
CREATE TABLE IF NOT EXISTS emails (
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

-- ====================================
-- 4. ユーザーテーブル（Supabase Authと連携）
-- ====================================
CREATE TABLE IF NOT EXISTS users (
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

-- ====================================
-- 5. コレクションテーブル（お気に入り機能）
-- ====================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- 6. コレクション-メール中間テーブル
-- ====================================
CREATE TABLE IF NOT EXISTS collection_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(collection_id, email_id)
);

-- ====================================
-- 7. キーワードアラートテーブル
-- ====================================
CREATE TABLE IF NOT EXISTS keyword_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'instant',
  notification_method VARCHAR(50) DEFAULT 'email',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- インデックス作成
-- ====================================

-- ブランドテーブル
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_category_id ON brands(category_id);

-- メールテーブル
CREATE INDEX IF NOT EXISTS idx_emails_brand_id ON emails(brand_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_at ON emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_is_public ON emails(is_public);

-- 日本語全文検索インデックスは後で追加（Supabaseで日本語設定が必要）
-- CREATE INDEX IF NOT EXISTS idx_emails_subject ON emails USING gin(to_tsvector('japanese', subject));
-- CREATE INDEX IF NOT EXISTS idx_emails_text_body ON emails USING gin(to_tsvector('japanese', text_body));

-- コレクション
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_emails_collection_id ON collection_emails(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_emails_email_id ON collection_emails(email_id);

-- キーワードアラート
CREATE INDEX IF NOT EXISTS idx_keyword_alerts_user_id ON keyword_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_keyword_alerts_is_active ON keyword_alerts(is_active);

-- ====================================
-- Row Level Security (RLS) 設定
-- ====================================

-- RLS有効化
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_alerts ENABLE ROW LEVEL SECURITY;

-- ====================================
-- RLSポリシー: 公開データは誰でも閲覧可能
-- ====================================

-- カテゴリ: 全員が閲覧可能
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- ブランド: 全員が閲覧可能
CREATE POLICY "Anyone can view public brands" ON brands FOR SELECT USING (true);

-- メール: 公開メールは全員が閲覧可能
CREATE POLICY "Anyone can view public emails" ON emails FOR SELECT USING (is_public = true);

-- ====================================
-- RLSポリシー: ユーザー自身のデータのみアクセス可能
-- ====================================

-- ユーザー: 自分のデータのみ閲覧・更新可能
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- コレクション: 自分のコレクションのみ操作可能
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- コレクション-メール: 自分のコレクションのメールのみ操作可能
CREATE POLICY "Users can view own collection emails" ON collection_emails FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_emails.collection_id AND collections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own collection emails" ON collection_emails FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_emails.collection_id AND collections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own collection emails" ON collection_emails FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM collections WHERE collections.id = collection_emails.collection_id AND collections.user_id = auth.uid()
  ));

-- キーワードアラート: 自分のアラートのみ操作可能
CREATE POLICY "Users can view own alerts" ON keyword_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON keyword_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON keyword_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON keyword_alerts FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- トリガー: updated_atの自動更新
-- ====================================

-- トリガー関数作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keyword_alerts_updated_at BEFORE UPDATE ON keyword_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 完了！
-- ====================================
