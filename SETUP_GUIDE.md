# 別のパソコンでの開発環境セットアップガイド

## 🚀 クイックスタート（5分で起動）

### 1. リポジトリをクローン

```bash
# ターミナルを開いて実行
git clone https://github.com/tomo3131/mail-directory-site.git
cd mail-directory-site
```

### 2. 環境変数を設定

```bash
# frontendディレクトリに移動
cd frontend

# .env.localファイルを作成
touch .env.local
```

`.env.local`ファイルに以下を記述:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWlybG1udHBhempsa3h3b2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTA3ODksImV4cCI6MjA3ODM2Njc4OX0.FYtSwGGa6ji24gvnAohJh4JMiXW16GTN_G_12PKo1Fk
```

**macOS/Linux:**
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWlybG1udHBhempsa3h3b2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTA3ODksImV4cCI6MjA3ODM2Njc4OX0.FYtSwGGa6ji24gvnAohJh4JMiXW16GTN_G_12PKo1Fk
EOF
```

**Windows (PowerShell):**
```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWlybG1udHBhempsa3h3b2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTA3ODksImV4cCI6MjA3ODM2Njc4OX0.FYtSwGGa6ji24gvnAohJh4JMiXW16GTN_G_12PKo1Fk
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### 3. 依存関係をインストール

```bash
npm install
```

**Node.jsがインストールされていない場合:**
- macOS: `brew install node` または https://nodejs.org/
- Windows: https://nodejs.org/ からインストーラーをダウンロード
- Linux: `sudo apt install nodejs npm` または `sudo yum install nodejs npm`

### 4. 開発サーバーを起動

```bash
npm run dev
```

成功すると以下のメッセージが表示されます:
```
▲ Next.js 16.0.1 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 690ms
```

### 5. ブラウザでアクセス

http://localhost:3000 を開く

---

## 📋 詳細な手順（トラブルシューティング付き）

### 事前準備

以下がインストールされているか確認:

```bash
# Node.jsバージョン確認（18.17以上が必要）
node -v

# npmバージョン確認
npm -v

# Git確認
git --version
```

### ステップ1: GitHubからクローン

```bash
# 好きなディレクトリに移動
cd ~/Projects  # 例

# リポジトリをクローン
git clone https://github.com/tomo3131/mail-directory-site.git

# プロジェクトディレクトリに移動
cd mail-directory-site

# ディレクトリ構造を確認
ls -la
```

期待される出力:
```
.env.example
CHANGELOG.md
DEPLOYMENT_GUIDE.md
MVP_SUMMARY.md
README.md
database/
frontend/
```

### ステップ2: 環境変数の設定

#### オプション1: 手動で作成

1. `frontend/`ディレクトリに移動
2. `.env.local`という名前のファイルを作成
3. 以下の内容をコピペ:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWlybG1udHBhempsa3h3b2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTA3ODksImV4cCI6MjA3ODM2Njc4OX0.FYtSwGGa6ji24gvnAohJh4JMiXW16GTN_G_12PKo1Fk
```

#### オプション2: コマンドで一発作成（推奨）

```bash
cd frontend

# macOS/Linux
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://lzuirlmntpazjlkxwoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWlybG1udHBhempsa3h3b2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTA3ODksImV4cCI6MjA3ODM2Njc4OX0.FYtSwGGa6ji24gvnAohJh4JMiXW16GTN_G_12PKo1Fk
EOF

# 確認
cat .env.local
```

### ステップ3: 依存関係のインストール

```bash
# frontend/ディレクトリにいることを確認
pwd  # /path/to/mail-directory-site/frontend であるべき

# 依存関係をインストール
npm install
```

インストールされるパッケージ:
- Next.js 16.0.1
- React 19
- TypeScript
- Tailwind CSS
- Supabase JS Client
- shadcn/ui components

**時間**: 約1-3分（ネットワーク速度による）

**エラーが出た場合:**
```bash
# キャッシュをクリア
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ステップ4: 開発サーバー起動

```bash
npm run dev
```

成功すると:
```
▲ Next.js 16.0.1 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 690ms
```

**ポート3000が既に使用されている場合:**
```bash
# 別のポートで起動
PORT=3001 npm run dev
```

### ステップ5: 動作確認

ブラウザで以下のURLを開いて確認:

1. **トップページ**: http://localhost:3000
   - ランディングページが表示される

2. **ブランド一覧**: http://localhost:3000/brands
   - 6ブランド（ユニクロ、楽天、Amazon等）が表示される

3. **ブランド詳細**: http://localhost:3000/brands/amazon
   - Amazonのメール一覧が表示される

4. **メール詳細**: 任意のメールをクリック
   - HTMLメール本文が表示される
   - 閲覧数が+1される

**データが表示されない場合:**
- ブラウザのコンソール（F12）でエラーを確認
- `.env.local`が正しく設定されているか確認
- Supabaseデータベースが稼働しているか確認（https://supabase.com/dashboard）

---

## 🔧 開発を続ける

### 最新の変更を取得

```bash
# mainブランチの最新版を取得
git pull origin main

# 依存関係が変更されている可能性があるため再インストール
cd frontend
npm install

# 開発サーバー起動
npm run dev
```

### 新機能を開発する場合

```bash
# 新しいブランチを作成
git checkout -b feature/検索機能実装

# 開発...
# ファイルを編集

# 変更をコミット
git add .
git commit -m "feat: 検索機能を実装"

# GitHubにプッシュ
git push origin feature/検索機能実装

# GitHub上でPull Requestを作成
```

### 変更を保存する

```bash
# 現在の変更を確認
git status

# 全ての変更をステージング
git add -A

# コミット
git commit -m "作業内容の説明"

# GitHubにプッシュ
git push origin main
```

---

## 🐛 トラブルシューティング

### エラー: "Cannot find module '@supabase/supabase-js'"

**原因**: 依存関係がインストールされていない

**解決方法**:
```bash
cd frontend
npm install
```

### エラー: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**原因**: 環境変数ファイルが正しく読み込まれていない

**解決方法**:
1. `frontend/.env.local`が存在するか確認
2. ファイル名が`.env.local`（先頭にドット）であることを確認
3. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

### エラー: "Port 3000 is already in use"

**原因**: ポート3000が既に使用されている

**解決方法**:
```bash
# オプション1: 別のポートを使用
PORT=3001 npm run dev

# オプション2: 既存のプロセスを終了
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <プロセスID> /F
```

### データベース接続エラー

**Supabaseダッシュボードで確認**:
1. https://supabase.com/dashboard にアクセス
2. プロジェクトが稼働しているか確認
3. Settings → API でURLとキーを再確認

### ページが真っ白

**ブラウザコンソールでエラー確認**:
1. F12でデベロッパーツールを開く
2. Consoleタブでエラーメッセージを確認
3. Networkタブで失敗したリクエストを確認

---

## 📚 参考情報

### プロジェクト構成

```
mail-directory-site/
├── frontend/               # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/           # ページファイル
│   │   ├── components/    # UIコンポーネント
│   │   └── lib/           # ユーティリティ
│   ├── .env.local         # 環境変数（gitignore）
│   └── package.json       # 依存関係
├── database/              # SQLスクリプト
├── CHANGELOG.md           # 開発記録
└── README.md              # プロジェクト概要
```

### 重要なファイル

- `frontend/src/lib/supabase.ts` - Supabaseクライアント設定
- `frontend/src/lib/supabase-server.ts` - データ取得関数
- `frontend/src/app/page.tsx` - トップページ
- `frontend/src/app/brands/page.tsx` - ブランド一覧
- `database/02_seed_data.sql` - サンプルデータ

### 便利なコマンド

```bash
# ビルド（本番環境向け）
npm run build

# 本番モードで起動
npm run start

# 型チェック
npm run type-check

# リンター実行
npm run lint

# フォーマット
npm run format
```

---

## 🎯 次にやること

1. **検索機能の実装** - `/search`ページの作成
2. **認証機能** - Supabase Authの統合
3. **Stripe決済** - サブスクリプション実装
4. **Vercelデプロイ** - 本番環境公開

詳細は`DEPLOYMENT_GUIDE.md`と`CHANGELOG.md`を参照してください。

---

## 💬 ヘルプ

問題が解決しない場合:
1. `CHANGELOG.md`で最近の変更を確認
2. `README.md`でプロジェクト概要を確認
3. GitHubのIssuesで質問を投稿

Happy Coding! 🚀
