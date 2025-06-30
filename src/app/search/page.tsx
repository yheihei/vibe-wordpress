import { searchPosts } from '@/lib/wp'
import { SearchForm } from '@/components/SearchForm'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const page = parseInt(params.page || '1')
  const { posts, pagination } = await searchPosts(query, 20, page)

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-press-start text-2xl md:text-3xl text-green-400 text-shadow mb-8">
        Search Results
      </h1>

      {/* Search Form */}
      <div className="mb-8">
        <SearchForm defaultValue={query} className="max-w-md" />
      </div>

      {/* Search Query Display */}
      {query && (
        <p className="text-gray-400 mb-6">
          検索結果: <span className="text-yellow-200">&quot;{query}&quot;</span>
        </p>
      )}

      {/* Search Results */}
      <div className="space-y-8">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <article
                key={post.id}
                className="border-l-4 border-green-400 pl-4 py-2 hover:border-yellow-200 transition-colors"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-green-400 hover:text-yellow-200 transition-colors"
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>
                </h2>
                
                <time className="text-sm text-gray-500 font-mono">
                  {new Date(post.date).toLocaleDateString('ja-JP')}
                </time>
                
                <div
                  className="mt-3 text-gray-300 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-block mt-3 text-yellow-200 hover:text-yellow-100 
                           font-mono text-sm transition-colors"
                >
                  &gt;&gt; Read More
                </Link>
              </article>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.hasPrev && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${pagination.page - 1}`}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 
                             font-mono border-2 border-gray-700 rounded transition-colors"
                  >
                    &lt; PREV
                  </Link>
                )}
                
                <span className="px-4 py-2 text-gray-400 font-mono">
                  {pagination.page} / {pagination.totalPages}
                </span>
                
                {pagination.hasNext && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${pagination.page + 1}`}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 
                             font-mono border-2 border-gray-700 rounded transition-colors"
                  >
                    NEXT &gt;
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            {query ? (
              <p className="text-gray-400 text-lg">
                「<span className="text-yellow-200">{query}</span>」に一致する記事が見つかりませんでした。
              </p>
            ) : (
              <p className="text-gray-400 text-lg">
                検索キーワードを入力してください。
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}