# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 本サイトの目的

@.docs/prd/本サイトの目的.md

## 応答のルール

- 常に日本語で応答してください。コード部分はそのままにしてください。

## **MUST** 思考のルール

- 思考する際は英語で考えてください

## コーディング原則
- YAGNI（You Aren't Gonna Need It）：今必要じゃない機能は作らない
- KISS: 複雑な解決策より単純な解決策を優先

## プロジェクト概要

Headless WordPress × Next.js のレトロゲーム風デザインサイトです。WordPressをCMSとして使用し、Next.js App Router (v15.3.4) でフロントエンドを構築しています。

### 主要な依存関係

- **Next.js 15.3.4**: App Router を使用したフロントエンド
- **Zod**: WordPress REST API レスポンスのランタイム型検証
- **Tailwind CSS + @tailwindcss/typography**: スタイリングとブログコンテンツの表示
- **Vitest + @testing-library/react**: テスト環境
- **MSW (Mock Service Worker)**: APIモッキング（テスト用）

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクション起動
npm run start

# リント（ESLint）
npm run lint

# フォーマット（Prettier）
npm run format

# テスト実行（Vitest）
npm run test

# テスト（ウォッチモード）
npm run test:watch

# 開発サーバーのプロセスID確認
ps aux | grep "next dev"

# 開発サーバーの停止（PIDを指定）
kill -9 [PID]
```

## アーキテクチャ

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   │   └── revalidate-tag/
│   ├── archive/           # アーカイブページ
│   ├── category/          # カテゴリーページ
│   ├── pages/             # 固定ページ
│   ├── posts/             # 投稿ページ
│   ├── search/            # 検索ページ
│   └── tag/               # タグページ
├── components/            # 共通コンポーネント
├── hooks/                 # カスタムフック
└── lib/                   # ユーティリティ
    └── wp.ts              # WordPress REST API クライアント

.docs/                     # プロジェクトドキュメント
├── design/               # 基本設計書（YYYYMMDD_機能名.md）
├── prd/                  # 要件定義書
└── todo/                 # タスク管理（YYYYMMDDhhmm_タスク概要.md）
```

- 動的ルート: `[slug]`, `[year]/[month]` など
- ISR対応: `next: { tags, revalidate }` を使用
- Zodによる型安全なレスポンス検証
- エラーハンドリングとページネーション対応

### 主要な技術要素

1. **データフェッチング**: WordPress REST API v2
2. **型安全性**: Zod によるランタイム型検証
3. **スタイリング**: Tailwind CSS + カスタムレトロデザイン
4. **キャッシュ戦略**: ISR (Incremental Static Regeneration)
   - 投稿一覧: 5分 (revalidate: 300)
   - カテゴリー/タグ: 10分 (revalidate: 600)
   - アーカイブ: 1時間 (revalidate: 3600)

### 環境変数

- `WORDPRESS_API_URL` (必須) - WordPress REST API のベースURL
- `WORDPRESS_IMAGE_DOMAIN` (任意) - next.config.mjs で使用される画像ドメイン設定

### 画像ホスト設定

`next.config.mjs` で許可されている画像ドメイン:
- `yhei-web-design.com`
- `secure.gravatar.com`
- `picsum.photos` (開発用プレースホルダー)

## コーディング規約

### フォーマット（Prettier）

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### リント（ESLint）

- `next/core-web-vitals` を継承
- Next.js の推奨ルールセットを使用

### TypeScript

- strict mode 有効
- パスエイリアス: `@/*` → `./src/*`

### テスト設定（Vitest）

- グローバル設定有効
- パスエイリアス対応
- `vitest.config.ts` で設定管理

### GitHubにアクセスしたい時

`gh` コマンドを使うこと

```bash
# PR一覧表示
gh pr list

# Issue一覧表示
gh issue list

# PRの作成
gh pr create --title "タイトル" --body "説明"

# リポジトリ情報の取得
gh repo view
```

## Webページの確認方法

Webページを確認する際は、以下の手順に従ってください：

1. **開発サーバーの起動確認**
   - まず、開発サーバーが起動しているか確認する
   - 起動していない場合は、以下のコマンドを実行：

   ```bash
   npm run dev > /dev/null 2>&1 &
   ```

2. **Puppeteerでの確認**
   - MCPのPuppeteer機能を使用してWebページを確認する
   - 利用可能な機能:
     - `mcp__puppeteer__puppeteer_navigate`: URLへのナビゲーション
     - `mcp__puppeteer__puppeteer_screenshot`: スクリーンショット取得
     - `mcp__puppeteer__puppeteer_click`: 要素のクリック
     - `mcp__puppeteer__puppeteer_fill`: フォーム入力
     - `mcp__puppeteer__puppeteer_evaluate`: JavaScriptの実行

## タスクの遂行方法

適用条件: 実装を依頼された時。単なる質問事項の場合適用されない。

### 基本フロー

- PRD の各項目を「Plan → Imp → Debug → Review → Doc」サイクルで処理する
- irreversible / high-risk 操作（削除・本番 DB 変更・外部 API 決定）は必ず停止する

#### Phase1 Plan

- PRDを受け取ったら、PRDを確認し、不明点がないか確認する
- その後、PRD の各項目を Planに落とし込む
  - Planは `.docs/todo/YYYYMMDDhhmm_${タスクの概要}.md` に保存
- ユーザーにPlanの確認を行い、承認されるまで次のフェーズには移行しない

#### Phase2 Imp

- Planをもとに実装する

#### Phase3 Debug

- 指定のテストがあればテストを行う
- 指定がなければ関連のテストを探してテストを行う
- 関連のテストがなければ停止して、なんのテストを行うべきかユーザーに確認する
- テストが通ったらフォーマッタをかける
- lintチェックを行い、エラーがあればImpに戻り、修正する

#### Phase4 Review

- これまでのやり取りの中でPRDの変更があったら。最新のPRDに更新する
- subagentを起動し、PRDを伝え、レビューしてもらう
- レビュー指摘があればImpに戻る

#### Phase5 Doc

- 基本設計書を`.docs/design/YYYYMMDD_${タスクの概要}.md` に保存
- ユーザーからのフィードバックを待つ。フィードバックがあれば適宜前のフェーズに戻ること
