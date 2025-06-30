# トップページ実装計画

## 作成日時

2024年11月29日 14:20

## 概要

WordPress REST APIを使用したNext.jsトップページの実装

## タスク一覧

### Phase1: セットアップ

1. Next.jsプロジェクトのセットアップ（create-next-app）
2. 必要な依存関係のインストール（zod, @types/node等）
3. プロジェクト構造の作成（src/app, src/lib）
4. 環境変数ファイル（.env.local.example）の作成

### Phase2: 実装

5. lib/wp.tsの実装（WordPress APIクライアント）
   - fetchLatestPosts関数（最新10記事取得）
   - fetchCategories関数（カテゴリ一覧取得）
   - zodスキーマによる型定義
6. app/layout.tsxの実装（共通レイアウト）
7. app/page.tsxの実装（トップページ）
   - 最新記事一覧の表示（グリッドレイアウト）
   - カテゴリ一覧の表示
   - ISR設定（revalidate: 300）
8. next.config.mjsの設定

### Phase3: 確認

9. 開発環境での動作確認
10. READMEの作成

## 技術スタック

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- zod（バリデーション）

## 環境変数

- WORDPRESS_API_URL: WordPress REST APIのベースURL
- REVALIDATE_SECRET: Webhook認証用シークレット
- NEXT_PUBLIC_SITE_URL: サイトのURL（SEO用）
