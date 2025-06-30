import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fetchPostsByTag,
  getFeaturedImageUrl,
  getPostCategories,
} from '@/lib/wp'

type Props = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function TagPage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { posts, tagName, pagination } = await fetchPostsByTag(
    resolvedParams.slug,
    10,
    page
  )

  if (posts.length === 0 && page === 1) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">タグ: {tagName}</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">このタグの記事はありません。</p>
      ) : (
        <>
          <div className="space-y-8">
            {posts.map((post) => {
              const featuredImage = getFeaturedImageUrl(post)
              const categories = getPostCategories(post)
              const date = new Date(post.date)

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Link href={`/posts/${post.slug}`}>
                    {featuredImage && (
                      <img
                        src={featuredImage}
                        alt={post.title.rendered}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h2
                        className="text-xl font-bold mb-2 hover:text-blue-600"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                      <div className="text-sm text-gray-600 mb-3">
                        {date.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {categories.length > 0 && (
                          <span className="ml-3">
                            {categories.map((cat) => cat.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-gray-700 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      />
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {pagination.hasPrev && (
                <Link
                  href={`/tag/${resolvedParams.slug}?page=${page - 1}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  前のページ
                </Link>
              )}
              <span className="px-4 py-2">
                {page} / {pagination.totalPages}
              </span>
              {pagination.hasNext && (
                <Link
                  href={`/tag/${resolvedParams.slug}?page=${page + 1}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  次のページ
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params
  const { tagName } = await fetchPostsByTag(resolvedParams.slug, 1, 1)

  return {
    title: `タグ: ${tagName} | Vibe`,
    description: `${tagName}タグが付けられた記事の一覧です。`,
  }
}
