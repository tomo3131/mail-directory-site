-- ====================================
-- メールディレクトリサイト - 初期データ投入
-- ====================================

-- ====================================
-- 1. カテゴリデータ
-- ====================================
INSERT INTO categories (name, slug, description) VALUES
  ('アパレル', 'apparel', 'ファッション・衣料品'),
  ('コスメ・美容', 'beauty', '化粧品・美容関連'),
  ('家電', 'electronics', '家電製品'),
  ('食品・飲料', 'food', '食品・飲料'),
  ('総合EC', 'marketplace', '総合ECサイト')
ON CONFLICT (slug) DO NOTHING;

-- ====================================
-- 2. ブランドデータ
-- ====================================

-- カテゴリIDを取得するための変数
DO $$
DECLARE
  apparel_id UUID;
  marketplace_id UUID;
  electronics_id UUID;
BEGIN
  -- カテゴリIDを取得
  SELECT id INTO apparel_id FROM categories WHERE slug = 'apparel';
  SELECT id INTO marketplace_id FROM categories WHERE slug = 'marketplace';
  SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';

  -- ブランドを挿入
  INSERT INTO brands (name, slug, category_id, email_address, website_url, description, total_emails) VALUES
    ('ユニクロ', 'uniqlo', apparel_id, 'uniqlo@mailarchive.jp', 'https://www.uniqlo.com',
     'カジュアル衣料品ブランド。LifeWearをコンセプトに、高品質でシンプルなデザインの服を提供。', 245),

    ('楽天市場', 'rakuten', marketplace_id, 'rakuten@mailarchive.jp', 'https://www.rakuten.co.jp',
     '日本最大級の総合ECモール。様々なショップが出店し、多彩な商品を取り扱う。', 520),

    ('Amazon Japan', 'amazon', marketplace_id, 'amazon@mailarchive.jp', 'https://www.amazon.co.jp',
     '世界最大級のECサイト。書籍から家電まで幅広い商品を扱う。', 680),

    ('無印良品', 'muji', apparel_id, 'muji@mailarchive.jp', 'https://www.muji.com',
     'シンプルで機能的な生活雑貨・衣料品ブランド。', 180),

    ('ZOZOTOWN', 'zozotown', apparel_id, 'zozotown@mailarchive.jp', 'https://zozo.jp',
     '日本最大級のファッション通販サイト。多数のブランドを取り扱う。', 320),

    ('ヨドバシカメラ', 'yodobashi', electronics_id, 'yodobashi@mailarchive.jp', 'https://www.yodobashi.com',
     '家電量販店。家電から日用品まで幅広く取り扱う。', 290)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ====================================
-- 3. メールデータ
-- ====================================

DO $$
DECLARE
  uniqlo_id UUID;
  rakuten_id UUID;
  amazon_id UUID;
  muji_id UUID;
  zozotown_id UUID;
BEGIN
  -- ブランドIDを取得
  SELECT id INTO uniqlo_id FROM brands WHERE slug = 'uniqlo';
  SELECT id INTO rakuten_id FROM brands WHERE slug = 'rakuten';
  SELECT id INTO amazon_id FROM brands WHERE slug = 'amazon';
  SELECT id INTO muji_id FROM brands WHERE slug = 'muji';
  SELECT id INTO zozotown_id FROM brands WHERE slug = 'zozotown';

  -- メールを挿入
  INSERT INTO emails (brand_id, subject, from_email, from_name, html_body, text_body, sent_at, view_count, is_public) VALUES
    -- ユニクロ
    (uniqlo_id,
     '【週末限定】ヒートテック全品20%OFF！今だけの特別価格',
     'info@uniqlo.com',
     'ユニクロ',
     '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4241f; font-size: 28px;">週末限定セール</h1>
        <p style="font-size: 18px; line-height: 1.6;">
          ヒートテック全品<strong style="color: #d4241f;">20%OFF</strong>
        </p>
        <p style="font-size: 16px; color: #666; line-height: 1.6;">
          寒い季節に欠かせないヒートテックが、今だけ特別価格！<br>
          この機会をお見逃しなく。
        </p>
        <a href="https://www.uniqlo.com" style="display: inline-block; background-color: #d4241f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">
          今すぐショッピング
        </a>
      </div>',
     '週末限定セール - ヒートテック全品20%OFF',
     NOW() - INTERVAL '1 day',
     156,
     true),

    -- 楽天市場
    (rakuten_id,
     '【楽天スーパーセール】ポイント最大44倍！11/11(土)1:59まで',
     'info@rakuten.co.jp',
     '楽天市場',
     '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #bf0000; color: white; padding: 20px;">
        <h1 style="font-size: 32px; text-align: center;">楽天スーパーセール開催中</h1>
        <p style="font-size: 24px; text-align: center; font-weight: bold;">
          ポイント最大44倍
        </p>
        <p style="font-size: 16px; text-align: center; margin-top: 16px;">
          11/11(土) 1:59まで<br>
          半額以下も多数！
        </p>
        <a href="https://www.rakuten.co.jp" style="display: block; background-color: white; color: #bf0000; padding: 16px; text-decoration: none; border-radius: 4px; margin-top: 20px; text-align: center; font-weight: bold; font-size: 18px;">
          スーパーセール会場へ
        </a>
      </div>',
     '楽天スーパーセール開催中 - ポイント最大44倍',
     NOW() - INTERVAL '2 days',
     892,
     true),

    -- Amazon
    (amazon_id,
     'Amazon ブラックフライデー先行セール！最大80%OFF',
     'no-reply@amazon.co.jp',
     'Amazon.co.jp',
     '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #232F3E; color: white; padding: 20px; text-align: center;">
          <h1 style="font-size: 28px;">ブラックフライデー先行セール</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #232F3E; font-size: 24px;">最大80%OFF</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            年に一度の大セール！<br>
            家電、ファッション、日用品など全カテゴリ対象。
          </p>
          <ul style="font-size: 14px; color: #666; line-height: 1.8;">
            <li>Prime会員は30分早くアクセス可能</li>
            <li>タイムセール毎日開催</li>
            <li>送料無料商品多数</li>
          </ul>
          <a href="https://www.amazon.co.jp" style="display: inline-block; background-color: #FF9900; color: #232F3E; padding: 14px 28px; text-decoration: none; border-radius: 4px; margin-top: 16px; font-weight: bold;">
            セール会場を見る
          </a>
        </div>
      </div>',
     'ブラックフライデー先行セール - 最大80%OFF',
     NOW() - INTERVAL '3 days',
     1245,
     true),

    -- 無印良品
    (muji_id,
     '【無印良品】新商品続々登場！冬のあったかインナー特集',
     'info@muji.net',
     '無印良品',
     '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <h1 style="color: #333; font-size: 24px; font-weight: normal;">冬のあったかインナー特集</h1>
        <p style="font-size: 16px; color: #666; line-height: 1.8;">
          綿とウールを混紡した、肌触りの良いインナーが新登場。<br>
          シンプルなデザインで、毎日の着こなしに。
        </p>
        <div style="background-color: white; padding: 16px; margin-top: 16px; border-radius: 4px;">
          <h3 style="font-size: 18px; color: #333; margin-bottom: 8px;">おすすめポイント</h3>
          <ul style="font-size: 14px; color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>綿とウールの混紡素材</li>
            <li>静電気が起きにくい</li>
            <li>洗濯機で洗える</li>
          </ul>
        </div>
        <a href="https://www.muji.com" style="display: inline-block; background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          商品を見る
        </a>
      </div>',
     '冬のあったかインナー特集 - 新商品続々登場',
     NOW() - INTERVAL '4 days',
     234,
     true),

    -- ZOZOTOWN
    (zozotown_id,
     '【ZOZOWEEK】人気ブランド最大50%OFF！11/15まで',
     'info@zozo.jp',
     'ZOZOTOWN',
     '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="font-size: 32px; margin: 0;">ZOZOWEEK開催</h1>
          <p style="font-size: 20px; margin-top: 10px;">11/8(水) - 11/15(水)</p>
        </div>
        <div style="padding: 20px; background-color: #fafafa;">
          <h2 style="color: #333; font-size: 22px;">人気ブランド最大50%OFF</h2>
          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            秋冬の新作アイテムがセール価格に！<br>
            この機会に、お気に入りのブランドをチェック。
          </p>
          <div style="background-color: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <h3 style="font-size: 18px; color: #333; margin-bottom: 12px;">セール対象ブランド</h3>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              BEAMS / UNITED ARROWS / nano・universe / SHIPS / JOURNAL STANDARD / 他多数
            </p>
          </div>
          <a href="https://zozo.jp" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold;">
            セール会場へ
          </a>
        </div>
      </div>',
     'ZOZOWEEK開催 - 人気ブランド最大50%OFF',
     NOW() - INTERVAL '5 days',
     567,
     true);
END $$;

-- ====================================
-- 完了！
-- ====================================

-- 挿入件数を確認
SELECT 'Categories' AS table_name, COUNT(*) AS count FROM categories
UNION ALL
SELECT 'Brands' AS table_name, COUNT(*) AS count FROM brands
UNION ALL
SELECT 'Emails' AS table_name, COUNT(*) AS count FROM emails;
