# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 応答のルール

- 常に日本語で応答してください。コード部分はそのままにしてください。

## **MUST** 思考のルール

- 思考する際は英語で考えてください

## プロジェクト概要

Headless WordPress × Next.js のレトロゲーム風デザインサイトです。WordPressをCMSとして使用し、Next.js App Router (v15) でフロントエンドを構築しています。

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

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch
```

## アーキテクチャ

### ディレクトリ構造

- `src/app/` - Next.js App Router のページとレイアウト
  - 動的ルート: `[slug]`, `[year]/[month]` など
  - ISR対応: `next: { tags, revalidate }` を使用
- `src/lib/wp.ts` - WordPress REST API クライアント
  - Zodによる型安全なレスポンス検証
  - エラーハンドリングとページネーション対応
- `src/components/` - 共通コンポーネント

### 主要な技術要素

1. **データフェッチング**: WordPress REST API v2
2. **型安全性**: Zod によるランタイム型検証
3. **スタイリング**: Tailwind CSS + カスタムレトロデザイン
4. **キャッシュ戦略**: ISR (Incremental Static Regeneration)
   - 投稿一覧: 5分 (revalidate: 300)
   - カテゴリー/タグ: 10分 (revalidate: 600)
   - アーカイブ: 1時間 (revalidate: 3600)

### 環境変数

必須: `WORDPRESS_API_URL` - WordPress REST API のベースURL

## コーディング規約

### フォーマット

- セミコロンなし
- シングルクォート使用
- インデント: 2スペース
- 末尾カンマ: ES5準拠

### TypeScript

- strict mode 有効
- パスエイリアス: `@/*` → `./src/*`

### GitHubにアクセスしたい時

`gh` コマンドを使うこと

## Webページの確認方法

Webページを確認する際は、以下の手順に従ってください：

1. **開発サーバーの起動確認**
   - まず、開発サーバーが起動しているか確認する
   - 起動していない場合は、以下のコマンドを実行：

   ```bash
   npm run dev > /dev/null 2>&1 &
   ```

2. **Playwrightでの確認**
   - MCPのPlaywright機能を使用してWebページを確認する
   - 例：ページのスクリーンショット取得、要素の確認、インタラクションのテストなど

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
