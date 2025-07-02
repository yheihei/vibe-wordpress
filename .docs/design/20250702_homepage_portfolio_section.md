# ホームページ改修設計書

## 概要
ホームページに以下の改修を実施:
1. Latest Transmissionsの記事数を最大6に変更
2. Latest Transmissionsの下にPortfolioセクションを追加

## 実装日時
2025年1月2日

## 変更内容

### 1. Latest Transmissionsの記事数変更
**ファイル**: `src/app/page.tsx`
- `fetchLatestPosts(9)` → `fetchLatestPosts(6)` に変更
- グリッドレイアウトは3列を維持（2行×3列）

### 2. Portfolio記事一覧の追加
**ファイル**: `src/app/page.tsx`, `src/lib/wp.ts`

#### 追加した機能:
- portfolioカテゴリーとその子カテゴリーから最大6記事を取得
- Latest Transmissionsセクションと同じデザインで表示
- "View All Portfolio"ボタンでカテゴリーページへ遷移

#### 実装詳細:
1. **新しい関数の追加** (`src/lib/wp.ts`)
   ```typescript
   export async function fetchPostsByCategoryWithChildren(
     slug: string,
     perPage = 10,
     page = 1
   )
   ```
   - 親カテゴリーとその子カテゴリーのIDを収集
   - WordPress REST APIのcategoriesパラメータに複数IDを渡して記事を取得

2. **インポート文の追加** (`src/app/page.tsx`)
   ```typescript
   import { fetchPostsByCategoryWithChildren } from '@/lib/wp'
   ```

3. **データ取得処理の変更**
   - Promise.allを使用して並列処理でパフォーマンスを向上
   ```typescript
   const [latestResult, categoriesData, portfolioResult] = await Promise.all([
     fetchLatestPosts(6),
     fetchCategories(),
     fetchPostsByCategoryWithChildren('portfolio', 6, 1),
   ])
   ```

3. **UIの実装**
   - Latest Transmissionsと同じコンポーネント構造を使用
   - portfolioカテゴリーの記事が存在する場合のみ表示
   - ボタンの色をblue-500に設定して差別化

## 技術的考慮事項

### パフォーマンス
- Promise.allを使用してAPIリクエストを並列実行
- ISRによるキャッシュ（revalidate: 300秒）は維持

### エラーハンドリング
- 既存のtry-catchブロックでエラーをキャッチ
- portfolioカテゴリーが存在しない、または記事がない場合はセクションを非表示

### 子カテゴリー対応
- `fetchPostsByCategoryWithChildren`関数により、portfolioの子カテゴリーに属する記事も自動的に取得
- WordPressの階層的なカテゴリー構造に対応

### レスポンシブ対応
- 既存のグリッドレイアウトを踏襲
- モバイル: 1列、タブレット: 2列、デスクトップ: 3列

## 今後の拡張性
- Portfolio記事の表示数は変数で管理しているため容易に変更可能
- 他のカテゴリーセクションも同様の方法で追加可能