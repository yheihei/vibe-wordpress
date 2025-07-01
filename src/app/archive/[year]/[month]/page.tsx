import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fetchPostsByDate,
  getFeaturedImageUrl,
  getPostCategories,
} from '@/lib/wp'

type Props = {
  params: Promise<{
    year: string
    month: string
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function ArchivePage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1

  // 年月の検証
  const year = parseInt(resolvedParams.year)
  const month = parseInt(resolvedParams.month)

  if (
    isNaN(year) ||
    isNaN(month) ||
    year < 1970 ||
    year > new Date().getFullYear() + 1 ||
    month < 1 ||
    month > 12
  ) {
    notFound()
  }

  const { posts, pagination } = await fetchPostsByDate(
    resolvedParams.year,
    resolvedParams.month,
    10,
    page
  )

  if (posts.length === 0 && page === 1) {
    notFound()
  }

  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {year}年{monthNames[month - 1]}の記事
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">この月の記事はありません。</p>
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
                        className="w-full aspect-video object-cover"
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
                  href={`/archive/${resolvedParams.year}/${resolvedParams.month}?page=${page - 1}`}
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
                  href={`/archive/${resolvedParams.year}/${resolvedParams.month}?page=${page + 1}`}
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
  const year = parseInt(resolvedParams.year)
  const month = parseInt(resolvedParams.month)

  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]

  return {
    title: `${year}年${monthNames[month - 1]}の記事 | Vibe`,
    description: `${year}年${monthNames[month - 1]}に投稿された記事の一覧です。`,
  }
}
