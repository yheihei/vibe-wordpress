# Aboutリンクをabout-meに変更 基本設計書

## 概要

ヘッダーのAboutリンクを固定ページ「about-me」に変更し、動的ルート`/pages/[slug]`で表示するよう実装を変更しました。

## 変更内容

### 1. Header.tsxの変更

**変更前：**

```tsx
<Link href="/pages/about">About</Link>
```

**変更後：**

```tsx
<Link href="/pages/about-me">About</Link>
```

### 2. ディレクトリ構造の変更

- **削除：** `/src/app/pages/about/` ディレクトリ
- **活用：** `/src/app/pages/[slug]/` 動的ルート

### 3. pages/[slug]/page.tsxのデザイン改善

posts/[slug]のレトロゲーム風デザインを参考に、以下の要素を適用：

- **外側のコンテナ：** `bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b]`
- **タイトル部分：** 黒い点線の下線、黄色いテキスト
- **proseスタイル：** 投稿ページと同様のカスタマイズ
- **アイキャッチ画像：** 存在する場合は表示

## 技術的詳細

### データフェッチング

```typescript
import { fetchPageBySlug, getFeaturedImageUrl } from '@/lib/wp'

const page = await fetchPageBySlug(slug)
const featuredImage = getFeaturedImageUrl(page)
```

### ISR設定

```typescript
export const dynamic = 'force-static'
export const revalidate = 300 // 5分毎に再生成
```

## 削除された要素

固定ページには不要な以下の要素を除外：

- カテゴリー表示
- 投稿日時
- 関連記事
- 目次（TableOfContents）
- 記事要約（ArticleSummary）
- シェアボタン
- 構造化データ（JsonLd）

## メリット

1. **コードの重複削減：** 個別実装を削除し、動的ルートで統一
2. **デザインの一貫性：** サイト全体でレトロゲーム風デザインを統一
3. **保守性の向上：** 1つのテンプレートで全固定ページを管理

## 注意事項

### WordPressの設定

この実装が正しく動作するためには、WordPressに以下の設定が必要です：

1. スラッグ「about-me」を持つ固定ページの作成
2. REST APIの有効化
3. 環境変数`WORDPRESS_API_URL`の正しい設定

### 今後の改善提案

1. **構造化データの追加**
   - SEO効果を高めるため、BreadcrumbSchemaなどの追加を検討

2. **エラーハンドリングの強化**
   - 404ページのカスタマイズ
   - エラーメッセージの改善

3. **パフォーマンスの最適化**
   - 画像の最適化（Next.js Imageコンポーネントの使用）
   - キャッシュ戦略の見直し

## 影響範囲

- **直接的な影響：** Aboutページへのアクセス
- **URLの変更：** `/pages/about` → `/pages/about-me`
- **外部リンク：** 既存のブックマークや外部サイトからのリンクは404になる可能性

## テスト確認項目

1. ✅ ヘッダーのAboutリンクが正しく変更されている
2. ✅ `/pages/about`ディレクトリが削除されている
3. ✅ pages/[slug]のデザインがレトロゲーム風に統一されている
4. ⚠️ `/pages/about-me`でページが正しく表示される（WordPressの設定に依存）
