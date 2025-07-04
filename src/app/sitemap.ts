import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'
import { fetchAllPosts, fetchCategories, fetchTags } from '@/lib/wp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // 基本ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 投稿ページ
  let allPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await fetchAllPosts()
    allPosts = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error)
  }

  // カテゴリーページ
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await fetchCategories()
    categoryPages = categories
      .filter((cat) => cat.count > 0)
      .map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error)
  }

  // タグページ
  let tagPages: MetadataRoute.Sitemap = []
  try {
    const tags = await fetchTags()
    tagPages = tags
      .filter((tag) => tag.count > 0)
      .map((tag) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      }))
  } catch (error) {
    console.error('Failed to fetch tags for sitemap:', error)
  }

  return [...staticPages, ...allPosts, ...categoryPages, ...tagPages]
}
