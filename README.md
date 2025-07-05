# Vibe WordPress - Headless WordPress × Next.js

レトロゲーム風デザインのHeadless WordPress × Next.jsサイトです。

## 技術スタック

- **CMS**: WordPress 6.x (REST API)
- **フロントエンド**: Next.js 14 (App Router), React 18
- **スタイリング**: Tailwind CSS + カスタムレトロデザイン
- **バリデーション**: Zod
- **ホスティング**: Vercel (推奨)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、以下の値を設定してください：

```bash
cp .env.local.example .env.local
```

必須の環境変数：

- `WORDPRESS_API_URL`: WordPress REST APIのベースURL（例：`https://blog.example.com/wp-json/wp/v2`）

オプションの環境変数（必要に応じて設定）：

- `REVALIDATE_SECRET`: Webhook認証用のシークレット
- `NEXT_PUBLIC_SITE_URL`: デプロイ先のサイトURL
- `WORDPRESS_IMAGE_DOMAIN`: WordPress画像のドメイン

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 機能

- 最新記事の一覧表示（レトロゲーム風グリッドレイアウト）
- カテゴリー一覧
- ISR（Incremental Static Regeneration）対応（5分毎に再生成）
- レスポンシブデザイン
- エラーハンドリング
- ローディング状態の表示

## ビルド & デプロイ

### プロダクションビルド

```bash
npm run build
npm run start
```

### Vercelへのデプロイ

#### 1. Vercelアカウント作成

1. [Vercel公式サイト](https://vercel.com)にアクセス
2. 「Sign Up」または「Get Started」をクリック
3. **GitHubアカウントで登録**（推奨）
   - 「Continue with GitHub」をクリック
   - GitHubにログイン後、「Authorize Vercel」で許可
4. Team名を入力（個人の場合は自分の名前でOK）
5. 無料プランの「Hobby」を選択

#### 2. プロジェクトのインポート

1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubリポジトリから`vibe-wordpress`を選択して「Import」
3. 初回の場合は「Configure GitHub App」でリポジトリへのアクセスを許可

#### 3. プロジェクト設定

1. **Framework Preset**: 自動的に「Next.js」が検出される（そのまま）
2. **環境変数の設定**（重要）
   - 「Environment Variables」セクションで以下を追加：
   ```
   Name: WORDPRESS_API_URL
   Value: https://your-wordpress-site.com/wp-json/wp/v2
   ```
3. **ビルド設定**（デフォルトのまま）
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### 4. デプロイ実行

1. 設定完了後「Deploy」ボタンをクリック
2. 約2-5分でデプロイ完了
3. 自動生成されるURL：
   - `https://your-project.vercel.app`（プロダクション）
   - `https://your-project-git-main.vercel.app`（ブランチ別）
   - `https://your-project-abc123.vercel.app`（デプロイ別）

#### 5. カスタムドメイン設定（オプション）

1. プロジェクト設定 → 「Domains」→「Add Domain」
2. 以下のいずれかのDNSレコードを設定：
   - CNAME: `cname.vercel-dns.com`
   - A レコード: `76.76.21.21`

#### 6. 自動デプロイ設定

- **mainブランチ**へのpushで自動デプロイ
- **プルリクエスト**でプレビューデプロイ（固有URL生成）

#### トラブルシューティング

- **ビルドエラー**: `WORDPRESS_API_URL`が正しく設定されているか確認
- **404エラー**: WordPressのREST APIが有効か確認
- **型エラー**: `npm run build`をローカルで実行して事前確認

## WordPress側の設定

### Webhook設定（オンデマンドISR用）

WordPress の `functions.php` に以下のコードを追加：

```php
add_action( 'save_post', function ( $post_id ) {
  if ( wp_is_post_revision( $post_id ) || get_post_status( $post_id ) !== 'publish' ) return;
  $secret = 'YOUR_SECRET';
  $slug   = get_post_field( 'post_name', $post_id );
  $type   = get_post_type( $post_id );

  wp_remote_post( 'https://your-app.vercel.app/api/revalidate-tag', [
    'headers' => [ 'X-SECRET-TOKEN' => $secret ],
    'body'    => wp_json_encode( [
      'postId' => $post_id,
      'slug' => $slug,
      'type' => $type
    ] ),
    'timeout' => 5,
  ] );
});
```

## 開発コマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# プロダクションサーバー
npm run start

# リント
npm run lint

# フォーマット
npm run format

# テスト
npm run test
```

## ディレクトリ構造

```
src/
├── app/
│   ├── layout.tsx        # 共通レイアウト
│   ├── page.tsx         # トップページ
│   ├── loading.tsx      # ローディング表示
│   ├── error.tsx        # エラー表示
│   └── globals.css      # グローバルスタイル
├── lib/
│   └── wp.ts           # WordPress APIクライアント
└── components/         # 共通コンポーネント（今後追加予定）
```

## ライセンス

MIT
