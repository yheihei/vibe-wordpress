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

1. GitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

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
