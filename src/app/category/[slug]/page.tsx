import { fetchPostsByCategory, fetchPostsByCategoryWithChildren, getFeaturedImageUrl, fetchCategories } from '@/lib/wp'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 600

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

interface CategoryWithPosts {
  posts: any[]
  categoryName: string
  pagination: {
    page: number
    totalPages: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
  childCategories?: any[]
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  
  // まず通常のカテゴリー取得を試みる
  let result = await fetchPostsByCategory(slug, 10, 1)
  
  // 投稿が0件の場合、子カテゴリーを含めて取得を試みる
  if (result.posts.length === 0) {
    result = await fetchPostsByCategoryWithChildren(slug, 10, 1)
  }

  return {
    title: `Category: ${result.categoryName || slug} | Vibe Coding Lair`,
    description: `${result.categoryName || slug}カテゴリの記事一覧`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1', 10)

  // まず通常のカテゴリー取得を試みる
  let result = await fetchPostsByCategory(slug, 10, page) as CategoryWithPosts
  
  // 投稿が0件かつ1ページ目の場合、子カテゴリーを含めて取得を試みる
  if (result.posts.length === 0 && page === 1) {
    result = await fetchPostsByCategoryWithChildren(slug, 10, page) as CategoryWithPosts
  }

  const { posts, categoryName, pagination } = result

  // カテゴリー名が空の場合のみ404を返す（カテゴリー自体が存在しない）
  if (!categoryName) {
    notFound()
  }

  // 子カテゴリーを取得
  const categories = await fetchCategories()
  const currentCategory = categories.find(cat => cat.slug === slug)
  const childCategories = currentCategory ? categories.filter(cat => cat.parent === currentCategory.id) : []

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-press-start text-2xl md:text-3xl text-yellow-200 mb-8 text-shadow">
        Category: {categoryName}
      </h1>

      {posts.length === 0 ? (
        <div className="bg-black border-4 border-gray-800 p-8 text-center">
          <p className="text-gray-400 mb-6">
            このカテゴリーまたはサブカテゴリーにはまだ記事がありません。
          </p>
          {childCategories.length > 0 && (
            <div className="mt-8">
              <h2 className="font-press-start text-lg text-yellow-200 mb-4">
                SUBCATEGORIES
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {childCategories.map((child) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.slug}`}
                    className="inline-block px-4 py-2 bg-gray-800 text-green-400 hover:bg-gray-700 transition-colors font-bold border-2 border-green-400"
                  >
                    {child.name} ({child.count})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => {
          const featuredImage = getFeaturedImageUrl(post)

          return (
            <article
              key={post.id}
              className="bg-black border-4 border-gray-800 p-6 hover:border-green-400 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {featuredImage && (
                  <div className="md:w-1/3">
                    <Link href={`/posts/${post.slug}`}>
                      <img
                        src={featuredImage}
                        alt=""
                        className="w-full aspect-video md:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  </div>
                )}

                <div className={featuredImage ? 'md:w-2/3' : 'w-full'}>
                  <h2 className="font-gothic text-xl md:text-2xl mb-3">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                    </Link>
                  </h2>

                  <time className="text-sm text-gray-500 block mb-3">
                    {new Date(post.date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>

                  <div
                    className="text-gray-300 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />

                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-block px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors font-bold"
                  >
                    READ MORE &gt;&gt;
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
        </div>
      )}

      {/* ページネーション */}
      {pagination.totalPages > 1 && (
        <nav
          className="mt-12 flex justify-center items-center gap-4"
          aria-label="ページネーション"
        >
          {/* 前へボタン */}
          {pagination.hasPrev ? (
            <Link
              href={`/category/${slug}?page=${page - 1}`}
              className="px-4 py-2 bg-gray-800 text-green-400 hover:bg-gray-700 transition-colors font-bold border-2 border-green-400"
            >
              &lt;&lt; PREV
            </Link>
          ) : (
            <span className="px-4 py-2 bg-gray-900 text-gray-600 font-bold border-2 border-gray-600 cursor-not-allowed">
              &lt;&lt; PREV
            </span>
          )}

          {/* ページ番号 */}
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const pageNum = i + 1
              const isCurrentPage = pageNum === page

              // 現在のページの前後2ページ、最初と最後のページを表示
              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <Link
                    key={pageNum}
                    href={`/category/${slug}?page=${pageNum}`}
                    className={`px-3 py-2 font-bold transition-colors ${
                      isCurrentPage
                        ? 'bg-green-400 text-black'
                        : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              }

              // 省略記号を表示
              if (pageNum === page - 3 || pageNum === page + 3) {
                return (
                  <span key={pageNum} className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }

              return null
            })}
          </div>

          {/* 次へボタン */}
          {pagination.hasNext ? (
            <Link
              href={`/category/${slug}?page=${page + 1}`}
              className="px-4 py-2 bg-gray-800 text-green-400 hover:bg-gray-700 transition-colors font-bold border-2 border-green-400"
            >
              NEXT &gt;&gt;
            </Link>
          ) : (
            <span className="px-4 py-2 bg-gray-900 text-gray-600 font-bold border-2 border-gray-600 cursor-not-allowed">
              NEXT &gt;&gt;
            </span>
          )}
        </nav>
      )}

      {/* ページ情報 */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        {pagination.total}件中 {(page - 1) * 10 + 1}-
        {Math.min(page * 10, pagination.total)}件を表示
      </div>
    </div>
  )
}
