# 個別記事（投稿）ページ基本設計書

作成日: 2025-06-30

## 概要

WordPress REST APIとNext.js App Routerを使用した個別記事（投稿）ページの実装設計書です。

## ファイル構成

```
src/app/posts/[slug]/page.tsx  # 個別記事ページコンポーネント
```

## 技術仕様

### ルーティング

- パス: `/posts/[slug]`
- 動的ルート: スラッグベースのルーティング

### データフェッチング

- API: WordPress REST API (`/wp-json/wp/v2/posts?slug={slug}`)
- フェッチ関数: `fetchPostBySlug()` (src/lib/wp.ts)
- データ形式: `WPPost` 型（Zodスキーマによる型安全性）

### キャッシング戦略

- ISR (Incremental Static Regeneration)
- `revalidate: 300` (5分ごとに再生成)
- タグベースの再検証: `post-${slug}`
- Webhookによるオンデマンド再生成対応

### メタデータ

動的メタデータ生成機能:

- ページタイトル: `{記事タイトル} | Vibe Coding Lair`
- 説明文: 記事の抜粋（最大160文字）
- OGP: Open Graphメタデータ対応

### デザイン実装

レトロゲーム風デザイン（.docs/design/post.htmlに準拠）:

1. **コンテナ**
   - 背景色: `bg-slate-800`
   - ボーダー: `border-4 border-black`
   - シャドウ: `shadow-[8px_8px_0_0_#1e293b]`

2. **ヘッダー部分**
   - カテゴリーリンク: 緑色（`text-green-400`）、大文字表示
   - タイトル: Press Start 2Pフォント、黄色（`text-yellow-300`）
   - 日付: グレー（`text-gray-400`）、日本語形式

3. **アイキャッチ画像**
   - 最大幅: `max-w-2xl`
   - ボーダー: `border-4 border-black`

4. **記事本文**
   - Tailwind Typographyによるスタイリング
   - 見出し: Press Start 2Pフォント、黄色
   - リンク: 緑色、ホバー時下線
   - コード: 背景グレー、テキスト緑色

### エラーハンドリング

- 記事が見つからない場合: `notFound()` 関数で404ページへ
- APIエラー: nullチェックによる安全な処理

### パフォーマンス最適化

- Static Generation（ビルド時生成）
- ISRによる段階的な更新
- `_embed`パラメータによる関連データの一括取得

## 依存関係

- Next.js 15.3.4
- React 18.3.1
- Tailwind CSS 3.4.16
- @tailwindcss/typography 0.5.15
- Zod 3.24.0

## 環境変数

- `WORDPRESS_API_URL`: WordPress REST APIのベースURL

## 今後の拡張案

1. コメント機能の追加
2. 関連記事の表示
3. ソーシャルシェアボタン
4. 前後の記事へのナビゲーション
5. 画像の最適化（next/imageの活用）
