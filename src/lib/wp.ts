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

const WP_CATEGORY = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  count: z.number(),
  description: z.string(),
  parent: z.number(),
})

export type WPCategory = z.infer<typeof WP_CATEGORY>

const API_BASE = process.env.WORDPRESS_API_URL || ''

// 最新記事一覧を取得（トップページ用）
export async function fetchLatestPosts(perPage = 10, page = 1) {
  const res = await fetch(
    `${API_BASE}/posts?per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`,
    {
      next: { tags: ['posts-list'], revalidate: 300 },
    }
  )
  
  if (!res.ok) {
    console.error('Failed to fetch posts:', res.status, res.statusText)
    throw new Error('Failed to fetch posts')
  }
  
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

// 個別記事を取得
export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/posts?slug=${slug}&_embed`, {
    next: { tags: [`post-${slug}`] },
  })
  
  if (!res.ok) {
    return null
  }
  
  const json = await res.json()
  return json.length ? WP_POST.parse(json[0]) : null
}

// 固定ページを取得
export async function fetchPageBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/pages?slug=${slug}&_embed`, {
    next: { tags: [`page-${slug}`] },
  })
  
  if (!res.ok) {
    return null
  }
  
  const json = await res.json()
  return json.length ? WP_POST.parse(json[0]) : null
}

// カテゴリー一覧を取得
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories?per_page=100`, {
    next: { tags: ['categories'], revalidate: 600 },
  })
  
  if (!res.ok) {
    console.error('Failed to fetch categories:', res.status, res.statusText)
    return []
  }
  
  const categories = await res.json()
  return z.array(WP_CATEGORY).parse(categories)
}

// カテゴリー別の投稿を取得
export async function fetchPostsByCategory(slug: string, perPage = 10) {
  // カテゴリースラッグからIDを取得
  const catRes = await fetch(`${API_BASE}/categories?slug=${slug}`)
  
  if (!catRes.ok) {
    return []
  }
  
  const categories = await catRes.json()
  if (!categories.length) return []
  
  // カテゴリーIDで投稿を取得
  const res = await fetch(
    `${API_BASE}/posts?categories=${categories[0].id}&per_page=${perPage}&_embed`,
    {
      next: { tags: [`category-${slug}`], revalidate: 600 },
    }
  )
  
  if (!res.ok) {
    return []
  }
  
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

// タグ別の投稿を取得
export async function fetchPostsByTag(slug: string, perPage = 10) {
  // タグスラッグからIDを取得
  const tagRes = await fetch(`${API_BASE}/tags?slug=${slug}`)
  
  if (!tagRes.ok) {
    return []
  }
  
  const tags = await tagRes.json()
  if (!tags.length) return []
  
  // タグIDで投稿を取得
  const res = await fetch(
    `${API_BASE}/posts?tags=${tags[0].id}&per_page=${perPage}&_embed`,
    {
      next: { tags: [`tag-${slug}`], revalidate: 600 },
    }
  )
  
  if (!res.ok) {
    return []
  }
  
  const posts = await res.json()
  return z.array(WP_POST).parse(posts)
}

// アイキャッチ画像のURLを取得するヘルパー関数
export function getFeaturedImageUrl(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media || !media.source_url) return null
  return media.source_url
}

// カテゴリー情報を取得するヘルパー関数
export function getPostCategories(post: WPPost): WPCategory[] {
  const terms = post._embedded?.['wp:term']
  if (!terms || !Array.isArray(terms)) return []
  
  const categories = terms[0] || []
  return categories.filter((cat: any) => cat.taxonomy === 'category')
}