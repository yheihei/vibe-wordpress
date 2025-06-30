# MVP 要件書（完全版）

**Headless WordPress × Next.js (App Router, ISR) × Vercel – REST API 版**

---

## 0. ゴール

- WordPress を "記事入力専用 CMS" とし、フロントは **Next.js + Vercel** で配信
- 更新ボタン後 **10 秒** で Edge に反映（オンデマンド ISR）
- 追加プラグイン不要：WP コアの REST API と PHP 10 行の Webhook だけで完結

---

## 1. 技術スタック

| レイヤ             | 採用技術 / サービス                         | 補足                                           |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| **CMS**            | WordPress 6.x（REST API `/wp-json/wp/v2/`） | `_embed` でメディア同梱                        |
| **フロントエンド** | Next.js 14（App Router, React 18）          | `revalidateTag` 使用                           |
| **ホスティング**   | Vercel Pro                                  | Edge Network / Functions / Incremental Cache   |
| **画像最適化**     | `next/image`（デフォルトローダ）            | WebP/AVIF 変換＋CDN キャッシュ                 |
| **バリデーション** | `zod`                                       | REST レスポンス → 型安全                       |
| **テスト**         | `vitest`, `@testing-library/react`, `msw`   | API モックと UI テスト                         |
| **CI**             | GitHub Actions                              | `pnpm install → lint → vitest → vercel deploy` |
| **エディタ支援**   | ESLint, Prettier, TypeScript strict         | ClaudeCode で自動生成対象                      |

---

## 2. 機能要件

### 2.1 公開ページ

| ルート                    | 内容                       | 生成方式                     | キャッシュ戦略     |
| ------------------------- | -------------------------- | ---------------------------- | ------------------ |
| `/`                       | 最新 10 記事・カテゴリ一覧 | ISR (`revalidate: 300`)      | 5 分毎再生成       |
| `/posts/[slug]`           | 個別記事（投稿）           | **タグ ISR** (`post-{slug}`) | Webhook で即再生成 |
| `/pages/[slug]`           | 固定ページ                 | **タグ ISR** (`page-{slug}`) | Webhook で即再生成 |
| `/category/[slug]`        | カテゴリ別記事一覧         | ISR (`revalidate: 600`)      | 10 分毎            |
| `/tag/[slug]`             | タグ別記事一覧             | ISR (`revalidate: 600`)      | 10 分毎            |
| `/archive/[year]/[month]` | 年月別アーカイブ           | ISR (`revalidate: 3600`)     | 1 時間毎           |
| `/search`                 | 検索結果ページ             | SSR (動的)                   | キャッシュなし     |
| `404`, `500`              | エラーページ               | 完全静的                     | —                  |

### 2.2 API / ルートハンドラ

| エンドポイント        | メソッド | 用途                                | 認証             |
| --------------------- | -------- | ----------------------------------- | ---------------- |
| `/api/revalidate-tag` | `POST`   | WordPress Webhook → `revalidateTag` | `X-SECRET-TOKEN` |
| `/api/og`（任意）     | `GET`    | 動的 OGP 生成（`@vercel/og`）       | 無               |

---

### デザイン

@.docs/design 配下。スケルトンのhtmlとCSSを置いたので、これに従って作ること

## 3. WordPress 側設定

### 3.1 Webhook（プラグインレス）

```php
/* functions.php */
add_action( 'save_post', function ( $post_id ) {
  // 下書き・リビジョンなどは無視
  if ( wp_is_post_revision( $post_id ) || get_post_status( $post_id ) !== 'publish' ) return;
  $secret = 'YOUR_SECRET';
  $slug   = get_post_field( 'post_name', $post_id );
  $type   = get_post_type( $post_id );

  wp_remote_post( 'https://your-app.vercel.app/api/revalidate-tag', [
    'headers' => [ 'X-SECRET-TOKEN' => $secret ],
    'body'    => wp_json_encode( [
      'postId' => $post_id,
      'slug' => $slug,
      'type' => $type // 'post' or 'page'
    ] ),
    'timeout' => 5,
  ] );
});
```

- **削除 (`wp_trash_post`)** も同様にフックし、フロントで 404 を返す実装を追加
- REST API のみ公開。 `/wp-json/` 配下は **リダイレクトしない**

---

## 4. Next.js 実装詳細

### 4.1 ディレクトリ構成（抜粋）

#### REST API エンドポイント対応

- 投稿: `/wp-json/wp/v2/posts`
- 固定ページ: `/wp-json/wp/v2/pages`
- カテゴリ: `/wp-json/wp/v2/categories`
- タグ: `/wp-json/wp/v2/tags`
- 検索: `?search=` パラメータ付き

**重要な注意点:**

- カテゴリ・タグでのフィルタリングはIDを使用（スラッグではない）
- 日付はISO8601形式（`YYYY-MM-DDTHH:MM:SS`）で指定
- 最大取得件数は100件/ページ

```
src/
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx                 # トップ
 │   ├─ posts/[slug]/page.tsx    # 個別記事（投稿）
 │   ├─ pages/[slug]/page.tsx    # 固定ページ
 │   ├─ category/[slug]/page.tsx # カテゴリ一覧
 │   ├─ tag/[slug]/page.tsx      # タグ一覧
 │   ├─ archive/
 │   │   └─ [year]/[month]/page.tsx # 年月別アーカイブ
 │   └─ search/page.tsx          # 検索
 ├─ lib/
 │   ├─ wp.ts                    # REST fetch & zod schema
 │   └─ markdown.ts              # remark / rehype プラグイン
 ├─ pages/
 │   └─ api/
 │       ├─ revalidate-tag.ts
 │       └─ preview.ts
 ├─ tests/
 │   ├─ wp.test.ts
 │   └─ postPage.test.tsx
 └─ next.config.mjs
```

### 4.2 主要コード

#### 4.2.1 REST フェッチ & バリデーション

```ts
// lib/wp.ts
import { z } from 'zod'

const WP_POST = z.object({
  id: z.number(),
  slug: z.string(),
  date: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  _embedded: z.any().optional(),
})
export type WPPost = z.infer<typeof WP_POST>

const API = `${process.env.WORDPRESS_API_URL}/posts`

// 最新記事一覧を取得（トップページ用）
export async function fetchLatestPosts(perPage = 10, page = 1) {
  // APIリクエスト例:
  // https://blog.example.com/wp-json/wp/v2/posts?per_page=10&page=1&_embed&orderby=date&order=desc
  const res = await fetch(
    `${API}?per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`,
    {
      next: { tags: ['posts-list'], revalidate: 300 },
    }
  )

  if (!res.ok) throw new Error('Failed to fetch posts')

  const posts = await res.json()
  // ヘッダーからページネーション情報を取得
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1')
  const total = parseInt(res.headers.get('X-WP-Total') || '0')

  return {
    posts: z.array(WP_POST).parse(posts),
    pagination: {
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${API}?slug=${slug}&_embed`, {
    next: { tags: [`post-${slug}`] },
  })
  const json = await res.json()
  return json.length ? WP_POST.parse(json[0]) : null
}

export async function fetchPageBySlug(slug: string) {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/pages?slug=${slug}&_embed`,
    {
      next: { tags: [`page-${slug}`] },
    }
  )
  const json = await res.json()
  return json.length ? WP_POST.parse(json[0]) : null
}

export async function fetchPostsByCategory(slug: string, perPage = 10) {
  // カテゴリースラッグからIDを取得
  const catRes = await fetch(
    `${process.env.WORDPRESS_API_URL}/categories?slug=${slug}`
  )
  const categories = await catRes.json()
  if (!categories.length) return []

  // カテゴリーIDで投稿を取得
  const res = await fetch(
    `${API}?categories=${categories[0].id}&per_page=${perPage}&_embed`,
    {
      next: { tags: [`category-${slug}`] },
    }
  )
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

export async function fetchPostsByTag(slug: string, perPage = 10) {
  // タグスラッグからIDを取得
  const tagRes = await fetch(
    `${process.env.WORDPRESS_API_URL}/tags?slug=${slug}`
  )
  const tags = await tagRes.json()
  if (!tags.length) return []

  // タグIDで投稿を取得
  const res = await fetch(
    `${API}?tags=${tags[0].id}&per_page=${perPage}&_embed`,
    {
      next: { tags: [`tag-${slug}`] },
    }
  )
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

export async function fetchPostsByDate(
  year: string,
  month: string,
  perPage = 10
) {
  // ISO8601形式で日付範囲を指定
  const after = `${year}-${month.padStart(2, '0')}-01T00:00:00`
  // 月末日を正確に計算
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
  const before = `${year}-${month.padStart(2, '0')}-${lastDay}T23:59:59`

  const res = await fetch(
    `${API}?after=${after}&before=${before}&per_page=${perPage}&orderby=date&order=desc&_embed`,
    {
      next: { tags: [`archive-${year}-${month}`] },
    }
  )
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

export async function searchPosts(query: string, perPage = 10) {
  // 検索クエリをエンコード
  const res = await fetch(
    `${API}?search=${encodeURIComponent(query)}&per_page=${perPage}&orderby=relevance&_embed`
  )
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

// カテゴリー一覧を取得
export async function fetchCategories() {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/categories?per_page=100`
  )
  const categories = await res.json()
  return categories
}

// タグ一覧を取得
export async function fetchTags() {
  const res = await fetch(`${process.env.WORDPRESS_API_URL}/tags?per_page=100`)
  const tags = await res.json()
  return tags
}
```

#### 4.2.2 ISR ページ

```tsx
// app/page.tsx (トップページ)
export const revalidate = 300 // 5分毎にISR

import { fetchLatestPosts, fetchCategories } from '@/lib/wp'
import Link from 'next/link'

export default async function HomePage() {
  const { posts, pagination } = await fetchLatestPosts(10)
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">最新の記事</h1>

      {/* 記事一覧 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            {/* サムネイル画像（あれば） */}
            {post._embedded?.['wp:featuredmedia']?.[0] && (
              <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post._embedded['wp:featuredmedia'][0].alt_text}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                <span
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </Link>
            </h2>

            <time className="text-sm text-gray-600">
              {new Date(post.date).toLocaleDateString('ja-JP')}
            </time>

            <div
              className="mt-3 text-gray-700 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />

            <Link
              href={`/posts/${post.slug}`}
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              続きを読む →
            </Link>
          </article>
        ))}
      </div>

      {/* カテゴリー一覧 */}
      <aside className="mt-12">
        <h2 className="text-2xl font-bold mb-4">カテゴリー</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </aside>

      {/* ページネーション（必要に応じて） */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/?page=${i + 1}`}
              className={`px-3 py-1 rounded ${
                pagination.page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// app/posts/[slug]/page.tsx
export const dynamic = 'force-static'
export const revalidate = 300

import { fetchPostBySlug } from '@/lib/wp'
import { notFound } from 'next/navigation'

export default async function PostPage({ params }) {
  const post = await fetchPostBySlug(params.slug)
  if (!post) notFound()
  return (
    <article className="prose mx-auto">
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  )
}

// app/pages/[slug]/page.tsx
export const dynamic = 'force-static'
export const revalidate = 300

import { fetchPageBySlug } from '@/lib/wp'
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const page = await fetchPageBySlug(params.slug)
  if (!page) notFound()
  return (
    <article className="prose mx-auto">
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </article>
  )
}

// app/category/[slug]/page.tsx
export const dynamic = 'force-static'
export const revalidate = 600

import { fetchPostsByCategory } from '@/lib/wp'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }) {
  const posts = await fetchPostsByCategory(params.slug)
  if (!posts.length) notFound()

  return (
    <div className="container mx-auto">
      <h1>カテゴリ: {params.slug}</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id}>
            <h2>
              <Link href={`/posts/${post.slug}`}>
                <span
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </article>
        ))}
      </div>
    </div>
  )
}

// app/archive/[year]/[month]/page.tsx
export const dynamic = 'force-static'
export const revalidate = 3600

import { fetchPostsByDate } from '@/lib/wp'
import Link from 'next/link'

export default async function ArchivePage({ params }) {
  const posts = await fetchPostsByDate(params.year, params.month)

  return (
    <div className="container mx-auto">
      <h1>
        {params.year}年{params.month}月のアーカイブ
      </h1>
      <div className="grid gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id}>
              <h2>
                <Link href={`/posts/${post.slug}`}>
                  <span
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </Link>
              </h2>
              <time>{new Date(post.date).toLocaleDateString('ja-JP')}</time>
              <div
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </article>
          ))
        ) : (
          <p>この月の記事はありません。</p>
        )}
      </div>
    </div>
  )
}

// app/tag/[slug]/page.tsx
export const dynamic = 'force-static'
export const revalidate = 600

import { fetchPostsByTag } from '@/lib/wp'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TagPage({ params }) {
  const posts = await fetchPostsByTag(params.slug)
  if (!posts.length) notFound()

  return (
    <div className="container mx-auto">
      <h1>タグ: {params.slug}</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id}>
            <h2>
              <Link href={`/posts/${post.slug}`}>
                <span
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </article>
        ))}
      </div>
    </div>
  )
}

// app/search/page.tsx
import { searchPosts } from '@/lib/wp'
import Link from 'next/link'

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || ''
  const posts = query ? await searchPosts(query) : []

  return (
    <div className="container mx-auto">
      <h1>検索結果: {query}</h1>
      <form>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="検索..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          検索
        </button>
      </form>
      <div className="grid gap-4 mt-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id}>
              <h2>
                <Link href={`/posts/${post.slug}`}>
                  <span
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </Link>
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </article>
          ))
        ) : (
          <p>「{query}」に一致する記事が見つかりませんでした。</p>
        )}
      </div>
    </div>
  )
}
```

#### 4.2.3 Webhook ハンドラ

```ts
// pages/api/revalidate-tag.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { revalidateTag } from 'next/cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers['x-secret-token'] !== process.env.REVALIDATE_SECRET) {
    return res.status(401).end('Unauthorized')
  }
  const { slug, type = 'post' } = req.body as { slug: string; type?: string }
  try {
    await revalidateTag(`${type}-${slug}`)
    // カテゴリ・タグ・アーカイブページも再生成トリガー
    if (type === 'post') {
      await revalidateTag('category-list')
      await revalidateTag('tag-list')
    }
    res.json({ revalidated: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}
```

#### 4.2.4 `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
export default {
  experimental: {
    incrementalCacheHandlerPath: '@vercel/cache-handler',
  },
  images: {
    domains: ['wp.example.com'], // WordPress の画像ドメイン
  },
}
```

---

## 5. 環境変数（Vercel Project → **Production & Preview 両方に設定**）

| 変数名                 | 例                                       | 用途             |
| ---------------------- | ---------------------------------------- | ---------------- |
| `WORDPRESS_API_URL`    | `https://blog.example.com/wp-json/wp/v2` | REST ベース      |
| `REVALIDATE_SECRET`    | 長いランダム文字列                       | Webhook 認証     |
| `NEXT_PUBLIC_SITE_URL` | `https://myblog.vercel.app`              | SEO Canonical 等 |

---

## 6. CI / CD

### `.github/workflows/main.yml`（概要）

```yaml
name: CI
on: [push]
jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm test
      - run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 7. 非機能要件

| 指標           | 目標値                                      |
| -------------- | ------------------------------------------- |
| **初回 LCP**   | < 2.5 s（mobile）                           |
| **TTFB**       | < 200 ms（Edge キャッシュヒット）           |
| **FCP**        | < 2 s                                       |
| **更新遅延**   | WordPress 公開 → Edge 反映 **≤ 10 s**       |
| **ビルド時間** | 1,000 記事で `next build` ≤ 60 s            |
| **稼働率**     | Vercel SLA（99.99 %）                       |
| **監視**       | 500系レスポンス・Webhook 失敗時 Sentry 通知 |

---

## 8. セキュリティ

1. Webhook URL はパブリックだが **長い乱数トークンを必須ヘッダ** に
2. REST API への `fetch` はドメイン固定・CORS 拒否設定
3. Repos は Dependabot による自動 PR で脆弱パッケージを更新

---

## 9. Deliverables（ClaudeCode への指示）

| ファイル / ディレクトリ       | 内容                                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `next.config.mjs`             | incremental cache 設定込み                                                                                              |
| `src/lib/wp.ts`               | REST fetch + zod schema                                                                                                 |
| `src/app/…`                   | `layout.tsx`, `page.tsx`, `posts/[slug]/page.tsx`, `pages/[slug]/page.tsx`, `tag/[slug]/page.tsx`, `search/page.tsx` 他 |
| `pages/api/revalidate-tag.ts` | Webhook ハンドラ                                                                                                        |
| `tests/*`                     | vitest + msw テスト                                                                                                     |
| `README.md`                   | ① 環境変数設定手順<br>② WordPress Webhook 設定手順<br>③ 開発 & デプロイ手順                                             |
| `.github/workflows/main.yml`  | CI パイプライン                                                                                                         |

---

## 10. 拡張ロードマップ（MVP 後）

| ステージ | 機能             | 技術候補                 |
| -------- | ---------------- | ------------------------ |
| **v1.1** | OGP 自動生成     | `/api/og` + `@vercel/og` |
| **v1.2** | フルテキスト検索 | Algolia / Pagefind       |
| **v1.3** | 画像 CDN 最適化  | Cloudinary / imgix       |
| **v2.0** | 多言語対応       | `next-intl` + WPML       |

---

これが **"省略なし" のフル要件** です。
ClaudeCode に渡せば、ほぼコピペ実装・自動生成で MVP サイトが立ち上がります。ご不明点あればいつでも聞いてください 🚀
