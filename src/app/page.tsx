import {
  fetchCategories,
  fetchLatestPosts,
  fetchPostsByCategoryWithChildren,
  getFeaturedImageUrl,
  getPostCategories,
} from '@/lib/wp'
import Link from 'next/link'
import HeroHeader from '@/components/HeroHeader'

export const revalidate = 300 // 5分毎にISR

export default async function HomePage() {
  let posts, categories, portfolioPosts

  try {
    // 並列でデータを取得してパフォーマンスを向上
    const [latestResult, categoriesData, portfolioResult] = await Promise.all([
      fetchLatestPosts(6), // 2x3グリッド用に6記事
      fetchCategories(),
      fetchPostsByCategoryWithChildren('portfolio', 6, 1),
    ])

    posts = latestResult.posts
    categories = categoriesData
    portfolioPosts = portfolioResult.posts
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-400">データの取得に失敗しました。</p>
      </div>
    )
  }

  return (
    <>
      {/* Hero Header */}
      <HeroHeader />

      <div className="space-y-20 px-4 md:px-8 lg:px-12">

      {/* Latest Posts */}
      <div className="animate-fade-in">
        <h2 className="font-press-start text-3xl md:text-4xl text-yellow-300 mb-8 text-center text-shadow-sm">
          Latest Transmissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const featuredImage = getFeaturedImageUrl(post)
            const postCategories = getPostCategories(post)
            const mainCategory = postCategories[0]

            return (
              <div
                key={post.id}
                className="bg-slate-800 text-white border-4 border-black p-3 sm:p-4 shadow-[8px_8px_0_0_#1e293b] hover:shadow-[10px_10px_0_0_#1e293b] transition-all duration-200 h-full flex flex-col"
              >
                {featuredImage && (
                  <Link href={`/posts/${post.slug}`}>
                    <img
                      src={featuredImage}
                      alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                      className="w-full aspect-video object-cover border-2 border-black mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </Link>
                )}
                <div className="flex-grow flex flex-col">
                  {mainCategory && (
                    <Link
                      href={`/category/${mainCategory.slug}`}
                      className="text-sm text-green-400 font-bold uppercase hover:underline"
                    >
                      {mainCategory.name}
                    </Link>
                  )}
                  <h2 className="font-gothic text-xl md:text-2xl text-yellow-300 my-2 text-shadow-sm flex-grow">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-yellow-200"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h2>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-600 flex justify-between items-center text-sm text-gray-400">
                    <span>
                      {new Date(post.date).toLocaleDateString('ja-JP')}
                    </span>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-bold text-green-400 hover:text-green-300"
                    >
                      READ &gt;
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500">まだ記事がありません。</p>
        )}

        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/archive"
              className="font-press-start text-lg bg-green-500 text-black px-6 py-3 border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:bg-green-400 active:translate-x-1 active:translate-y-1 transition-all transform"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>

      {/* Portfolio Section */}
      {portfolioPosts.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="font-press-start text-3xl md:text-4xl text-yellow-300 mb-8 text-center text-shadow-sm">
            Portfolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioPosts.map((post) => {
              const featuredImage = getFeaturedImageUrl(post)
              const postCategories = getPostCategories(post)
              const mainCategory = postCategories[0]

              return (
                <div
                  key={post.id}
                  className="bg-slate-800 text-white border-4 border-black p-3 sm:p-4 shadow-[8px_8px_0_0_#1e293b] hover:shadow-[10px_10px_0_0_#1e293b] transition-all duration-200 h-full flex flex-col"
                >
                  {featuredImage && (
                    <Link href={`/posts/${post.slug}`}>
                      <img
                        src={featuredImage}
                        alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                        className="w-full aspect-video object-cover border-2 border-black mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  )}
                  <div className="flex-grow flex flex-col">
                    {mainCategory && (
                      <Link
                        href={`/category/${mainCategory.slug}`}
                        className="text-sm text-green-400 font-bold uppercase hover:underline"
                      >
                        {mainCategory.name}
                      </Link>
                    )}
                    <h2 className="font-gothic text-xl md:text-2xl text-yellow-300 my-2 text-shadow-sm flex-grow">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-yellow-200"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                    </h2>
                    <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-600 flex justify-between items-center text-sm text-gray-400">
                      <span>
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </span>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="font-bold text-green-400 hover:text-green-300"
                      >
                        READ &gt;
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/category/portfolio"
              className="font-press-start text-lg bg-blue-500 text-black px-6 py-3 border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:bg-blue-400 active:translate-x-1 active:translate-y-1 transition-all transform"
            >
              View All Portfolio
            </Link>
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="font-press-start text-xl md:text-2xl text-yellow-300 mb-6 text-center text-shadow-sm">
            Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-4 py-2 bg-slate-700 border-2 border-black hover:bg-slate-600 transition-colors text-green-400 font-bold"
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
