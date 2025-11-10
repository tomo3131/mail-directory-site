# データベースセットアップ手順

## 📌 概要

Supabaseのデータベースにテーブルを作成し、初期データを投入する手順です。

---

## 🚀 ステップ1: Supabase SQL Editorにアクセス

1. https://supabase.com/dashboard にアクセス
2. プロジェクト `lzuirlmntpazjlkxwoec` を選択
3. 左サイドバーから **SQL Editor** をクリック

---

## 🗂️ ステップ2: テーブル作成

### 2.1 新しいクエリを作成

1. 「+ New query」ボタンをクリック
2. クエリ名を入力: `Create Tables`

### 2.2 SQLスクリプトをコピー

`01_create_tables.sql` の内容を**すべて**コピーして、SQLエディタに貼り付けます。

```bash
# ファイルの場所
/Users/akkin/my-first-miyabi-agentv2/mail-directory-site/database/01_create_tables.sql
```

### 2.3 実行

1. 「Run」ボタンをクリック（または `Cmd+Enter`）
2. 成功メッセージが表示されるまで待つ

**期待される結果**:
```
Success. No rows returned
```

### 2.4 確認

左サイドバーから **Table Editor** をクリックして、以下のテーブルが作成されていることを確認：

- ✅ categories
- ✅ brands
- ✅ emails
- ✅ users
- ✅ collections
- ✅ collection_emails
- ✅ keyword_alerts

---

## 📊 ステップ3: 初期データ投入

### 3.1 新しいクエリを作成

1. SQL Editorで「+ New query」をクリック
2. クエリ名を入力: `Seed Data`

### 3.2 SQLスクリプトをコピー

`02_seed_data.sql` の内容を**すべて**コピーして、SQLエディタに貼り付けます。

```bash
# ファイルの場所
/Users/akkin/my-first-miyabi-agentv2/mail-directory-site/database/02_seed_data.sql
```

### 3.3 実行

1. 「Run」ボタンをクリック
2. 成功メッセージが表示されるまで待つ

**期待される結果**:
```
table_name | count
-----------+------
Categories |     5
Brands     |     6
Emails     |     5
```

### 3.4 確認

Table Editorで各テーブルを開いて、データが入っていることを確認：

#### categories テーブル
- アパレル
- コスメ・美容
- 家電
- 食品・飲料
- 総合EC

#### brands テーブル
- ユニクロ
- 楽天市場
- Amazon Japan
- 無印良品
- ZOZOTOWN
- ヨドバシカメラ

#### emails テーブル
- 5件のサンプルメール

---

## ✅ ステップ4: フロントエンドとの連携確認

### 4.1 環境変数の確認

フロントエンドの `.env.local` が正しく設定されているか確認：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...（設定済み）
```

### 4.2 開発サーバーの再起動

```bash
cd /Users/akkin/my-first-miyabi-agentv2/mail-directory-site/frontend

# サーバーを停止（Ctrl+C）してから再起動
npm run dev
```

### 4.3 動作確認

ブラウザで http://localhost:3000 にアクセスして確認：

- ✅ トップページ（LP）が表示される
- ✅ `/brands` でブランド一覧が表示される
- ✅ `/brands/uniqlo` でユニクロの詳細が表示される
- ✅ `/emails/1` でメール詳細が表示される

---

## 🔧 トラブルシューティング

### エラー: "permission denied for schema public"

**原因**: RLS（Row Level Security）が有効になっているが、ポリシーが正しく設定されていない。

**解決方法**:
1. SQL Editorで以下を実行：
```sql
-- 一時的にRLSを無効化（開発環境のみ）
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
```

2. または、`01_create_tables.sql` を再実行してポリシーを再作成

### エラー: "duplicate key value violates unique constraint"

**原因**: すでにデータが存在している。

**解決方法**:
1. SQL Editorで以下を実行してデータを削除：
```sql
TRUNCATE TABLE emails CASCADE;
TRUNCATE TABLE brands CASCADE;
TRUNCATE TABLE categories CASCADE;
```

2. `02_seed_data.sql` を再実行

### フロントエンドでデータが表示されない

**確認ポイント**:

1. **Supabaseの接続確認**:
```typescript
// ブラウザのコンソールで確認
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

2. **RLSポリシーの確認**:
```sql
-- SQL Editorで実行
SELECT * FROM brands; -- データが見えるか確認
SELECT * FROM emails WHERE is_public = true; -- 公開メールが見えるか確認
```

3. **開発サーバーの再起動**:
環境変数を変更した場合は、必ずサーバーを再起動してください。

---

## 📝 次のステップ

データベースのセットアップが完了したら、次は以下を実装します：

1. **Supabaseからデータをフェッチ**
   - モックデータから実際のデータベースへ切り替え
   - `src/lib/supabase.ts` に関数を追加

2. **ユーザー認証機能**
   - Supabase Authを使った登録・ログイン
   - 認証ページの実装

3. **検索機能**
   - Supabase Full-Text Searchを使った検索
   - フィルタリング機能

---

## 🎉 完了！

これで、Supabaseのデータベースセットアップが完了しました。

次は、フロントエンドからSupabaseのデータを取得して表示する機能を実装しましょう。
