-- ====================================
-- 既存テーブルの削除（クリーンアップ）
-- ====================================

-- 外部キー制約があるため、逆順で削除
DROP TABLE IF EXISTS keyword_alerts CASCADE;
DROP TABLE IF EXISTS collection_emails CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- RLSポリシーも削除される
-- トリガーも削除される

-- ====================================
-- 完了！
-- ====================================

SELECT 'All tables dropped successfully!' AS message;
