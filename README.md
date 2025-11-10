# メールディレクトリサイト（日本版Milled）

日本のEコマース企業やブランドが配信するプロモーションメールを自動収集し、検索可能なディレクトリとして提供するプラットフォーム。

## 📋 プロジェクト概要

- **目的**: 1,000社以上のブランドのメールマーケティングキャンペーンをアーカイブし、マーケターや消費者に価値を提供
- **ターゲット**: 企業のマーケティング担当者、Eコマース運営者、広告代理店
- **ビジネスモデル**: フリーミアム + SaaSサブスクリプション（¥9,800/月〜）
- **収益目標**: 個人運営で年間1,000万円以上

## 🏗️ プロジェクト構成

```
mail-directory-site/
├── frontend/          # Next.js 14 + Tailwind CSS
├── backend/           # Ruby on Rails 7.x (API)
├── infrastructure/    # AWS Lambda, Terraform
│   ├── lambda/       # メール処理Lambda関数
│   └── terraform/    # インフラコード
├── database/         # データベースマイグレーション
└── docs/            # ドキュメント
```

## 🚀 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (React 18)
- **スタイリング**: Tailwind CSS 3.x
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod
- **UIコンポーネント**: shadcn/ui

### バックエンド
- **フレームワーク**: Ruby on Rails 7.x
- **API**: RESTful API (JSON)
- **認証**: Devise + JWT
- **決済**: Stripe API
- **バックグラウンドジョブ**: Sidekiq + Redis

### データベース・検索
- **メインDB**: PostgreSQL 15
- **キャッシュ**: Redis 7.x
- **検索エンジン**: Elasticsearch 8.x

### インフラ（AWS）
- **コンピューティング**: EC2 (t3.medium × 2, Auto Scaling)
- **メール受信**: Amazon SES
- **メール処理**: Lambda (Node.js 18)
- **ストレージ**: S3 (画像保存)
- **CDN**: CloudFront
- **DNS**: Route 53

## 📦 必要なAPIキー

このプロジェクトを動かすには、以下のAPIキーが必要です：

### 1. Stripe（決済）

1. [Stripe Dashboard](https://dashboard.stripe.com/register) にアクセスしてアカウント作成
2. **開発者 → APIキー** から以下を取得：
   - 公開可能キー (`pk_test_...`)
   - シークレットキー (`sk_test_...`)
3. **Webhooks** を設定し、Webhook署名シークレット (`whsec_...`) を取得
4. 商品とプランを作成し、Price IDを取得

### 2. AWS（SES, S3, Lambda）

1. [AWS Management Console](https://aws.amazon.com/) にアクセス
2. **IAM → ユーザー** から新しいユーザーを作成
3. 以下の権限を付与：
   - AmazonSESFullAccess
   - AmazonS3FullAccess
   - AWSLambdaFullAccess
4. アクセスキーを作成して、以下を取得：
   - アクセスキーID
   - シークレットアクセスキー

### 3. その他（オプション）

- **Google Analytics**: [Google Analytics](https://analytics.google.com/) でトラッキングIDを取得
- **Sentry**: [Sentry](https://sentry.io/) でエラートラッキング用DSNを取得
- **Slack**: [Slack Webhooks](https://api.slack.com/messaging/webhooks) で通知用URLを取得

## 🔧 セットアップ手順

### 1. 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集して、取得したAPIキーを設定
```

### 2. バックエンド（Rails）のセットアップ

```bash
cd backend

# Rubyのバージョン確認（3.2以上）
ruby -v

# 依存関係のインストール
bundle install

# データベース作成
rails db:create
rails db:migrate
rails db:seed

# サーバー起動
rails server -p 3001
```

### 3. フロントエンド（Next.js）のセットアップ

```bash
cd frontend

# Node.jsのバージョン確認（18以上）
node -v

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### 4. Dockerを使った開発環境（推奨）

```bash
# Docker Composeで全サービスを起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 停止
docker-compose down
```

## 🧪 テスト

```bash
# バックエンドのテスト
cd backend
bundle exec rspec

# フロントエンドのテスト
cd frontend
npm run test
```

## 📊 データベース設計

主要テーブル：
- **brands**: ブランド情報（1,000社以上）
- **emails**: メールアーカイブ（200,000通以上）
- **users**: ユーザー情報
- **subscriptions**: サブスクリプション管理
- **collections**: お気に入りコレクション
- **keyword_alerts**: キーワードアラート設定

詳細なER図は `docs/database-schema.md` を参照。

## 🚢 デプロイ

### AWS EC2へのデプロイ

```bash
# Capistranoでデプロイ
cd backend
bundle exec cap production deploy
```

### Vercelへのフロントエンドデプロイ

```bash
cd frontend
vercel --prod
```

## 📈 開発ロードマップ

### フェーズ1: MVP開発（0〜3ヶ月）
- [x] プロジェクトセットアップ
- [ ] メール受信・解析機能
- [ ] ブランドディレクトリ
- [ ] メール詳細ページ
- [ ] 検索機能
- [ ] ユーザー認証
- [ ] Stripe決済統合
- [ ] LP作成

### フェーズ2: 機能拡張（3〜6ヶ月）
- [ ] 高度検索機能
- [ ] キーワードアラート
- [ ] コレクション機能
- [ ] トレンド分析ダッシュボード

### フェーズ3: 成長・最適化（6〜12ヶ月）
- [ ] SEO最適化
- [ ] パフォーマンス改善
- [ ] A/Bテスト
- [ ] API提供（エンタープライズ向け）

## 📝 ライセンス

Proprietary - All Rights Reserved

## 👥 貢献

現在は個人プロジェクトのため、外部からの貢献は受け付けていません。

## 📞 お問い合わせ

- Email: hello@mailarchive.jp
- Website: https://mailarchive.jp

---

**注意**: このプロジェクトは商用サービスです。コードやアイデアの無断使用は禁止されています。
