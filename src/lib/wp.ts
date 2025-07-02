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
export async function fetchPostsByCategory(
  slug: string,
  perPage = 10,
  page = 1
) {
  // カテゴリースラッグからIDを取得
  const catRes = await fetch(`${API_BASE}/categories?slug=${slug}`)

  if (!catRes.ok) {
    return {
      posts: [],
      categoryName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const categories = await catRes.json()
  if (!categories.length) {
    return {
      posts: [],
      categoryName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const category = categories[0]

  // カテゴリーIDで投稿を取得
  const res = await fetch(
    `${API_BASE}/posts?categories=${category.id}&per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`,
    {
      next: { tags: [`category-${slug}`], revalidate: 600 },
    }
  )

  if (!res.ok) {
    return {
      posts: [],
      categoryName: category.name,
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const posts = await res.json()
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1')
  const total = parseInt(res.headers.get('X-WP-Total') || '0')

  return {
    posts: z.array(WP_POST).parse(posts),
    categoryName: category.name,
    pagination: {
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

// タグ別の投稿を取得
export async function fetchPostsByTag(slug: string, perPage = 10, page = 1) {
  // タグスラッグからIDを取得
  const tagRes = await fetch(`${API_BASE}/tags?slug=${slug}`)

  if (!tagRes.ok) {
    return {
      posts: [],
      tagName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const tags = await tagRes.json()
  if (!tags.length) {
    return {
      posts: [],
      tagName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const tag = tags[0]

  // タグIDで投稿を取得
  const res = await fetch(
    `${API_BASE}/posts?tags=${tag.id}&per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`,
    {
      next: { tags: [`tag-${slug}`], revalidate: 600 },
    }
  )

  if (!res.ok) {
    return {
      posts: [],
      tagName: tag.name,
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const posts = await res.json()
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1')
  const total = parseInt(res.headers.get('X-WP-Total') || '0')

  return {
    posts: z.array(WP_POST).parse(posts),
    tagName: tag.name,
    pagination: {
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
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

// 検索機能
export async function searchPosts(query: string, perPage = 10, page = 1) {
  // 空のクエリの場合は空配列を返す
  if (!query || query.trim() === '') {
    return {
      posts: [],
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  // 検索クエリをエンコード
  const res = await fetch(
    `${API_BASE}/posts?search=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orderby=relevance&_embed`,
    {
      // 検索結果はキャッシュしない（動的コンテンツ）
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    console.error('Failed to search posts:', res.status, res.statusText)
    return {
      posts: [],
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const posts = await res.json()
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

// 年月別の投稿を取得
export async function fetchPostsByDate(
  year: string,
  month: string,
  perPage = 10,
  page = 1
) {
  // ISO8601形式で日付範囲を指定
  const after = `${year}-${month.padStart(2, '0')}-01T00:00:00`
  // 月末日を正確に計算
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
  const before = `${year}-${month.padStart(2, '0')}-${lastDay}T23:59:59`

  const res = await fetch(
    `${API_BASE}/posts?after=${after}&before=${before}&per_page=${perPage}&page=${page}&orderby=date&order=desc&_embed`,
    {
      next: { tags: [`archive-${year}-${month}`], revalidate: 3600 },
    }
  )

  if (!res.ok) {
    return {
      posts: [],
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }

  const posts = await res.json()
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

// タグ一覧を取得
export async function fetchTags() {
  const res = await fetch(`${API_BASE}/tags?per_page=100`, {
    next: { tags: ['tags'], revalidate: 600 },
  })

  if (!res.ok) {
    console.error('Failed to fetch tags:', res.status, res.statusText)
    return []
  }

  const tags = await res.json()
  return tags
}

// タグ情報を取得するヘルパー関数
export function getPostTags(post: WPPost): any[] {
  const terms = post._embedded?.['wp:term']
  if (!terms || !Array.isArray(terms)) return []

  // タグは通常2番目の配列に格納される
  const tags = terms[1] || []
  return tags.filter((tag: any) => tag.taxonomy === 'post_tag')
}

// 再帰的に子カテゴリーを取得するヘルパー関数
function getAllDescendantCategories(categoryId: number, allCategories: any[]): number[] {
  const directChildren = allCategories.filter(cat => cat.parent === categoryId)
  const descendantIds = directChildren.map(cat => cat.id)
  
  // 各子カテゴリーの子孫も再帰的に取得
  directChildren.forEach(child => {
    descendantIds.push(...getAllDescendantCategories(child.id, allCategories))
  })
  
  return descendantIds
}

// 親カテゴリーとその子カテゴリーの投稿を取得
export async function fetchPostsByCategoryWithChildren(
  slug: string,
  perPage = 10,
  page = 1
) {
  // まず全カテゴリーを取得
  const categoriesRes = await fetch(`${API_BASE}/categories?per_page=100`)
  
  if (!categoriesRes.ok) {
    return {
      posts: [],
      categoryName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
  
  const allCategories = await categoriesRes.json()
  
  // 親カテゴリーを探す
  const parentCategory = allCategories.find((cat: any) => cat.slug === slug)
  
  if (!parentCategory) {
    return {
      posts: [],
      categoryName: '',
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
  
  // 子カテゴリーを再帰的に取得
  const descendantIds = getAllDescendantCategories(parentCategory.id, allCategories)
  
  // 親カテゴリーと全ての子孫カテゴリーのIDを集める
  const categoryIds = [
    parentCategory.id,
    ...descendantIds,
  ]
  
  // カテゴリーIDをカンマ区切りで結合
  const categoriesParam = categoryIds.join(',')
  
  // 投稿を取得
  const res = await fetch(
    `${API_BASE}/posts?categories=${categoriesParam}&per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`,
    {
      next: { tags: [`category-${slug}-with-children`], revalidate: 600 },
    }
  )
  
  if (!res.ok) {
    return {
      posts: [],
      categoryName: parentCategory.name,
      pagination: {
        page: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
  
  const posts = await res.json()
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1')
  const total = parseInt(res.headers.get('X-WP-Total') || '0')
  
  return {
    posts: z.array(WP_POST).parse(posts),
    categoryName: parentCategory.name,
    pagination: {
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
