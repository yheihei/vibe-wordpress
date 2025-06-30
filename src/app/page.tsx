import Link from 'next/link'
import {
  fetchLatestPosts,
  fetchCategories,
  getFeaturedImageUrl,
  getPostCategories,
} from '@/lib/wp'

export const revalidate = 300 // 5分毎にISR

export default async function HomePage() {
  let posts, categories

  try {
    const result = await fetchLatestPosts(9) // 3x3グリッド用に9記事
    posts = result.posts
    categories = await fetchCategories()
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-400">データの取得に失敗しました。</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Welcome Banner */}
      <div className="bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b] hover:shadow-[10px_10px_0_0_#1e293b] transition-all duration-200">
        <div className="text-center">
          <h1 className="font-press-start text-2xl md:text-4xl text-green-400 text-shadow mb-4">
            <span>&gt; Welcome to the Lair</span>
            <span className="blinking-cursor">_</span>
          </h1>
          <div className="animate-fade-in space-y-6">
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              This is the digital playground of わいへい (Waihei). I build
              games, explore AI, and write about &apos;Vibe Coding&apos;.
            </p>
            <a
              href="https://example.com/my-awesome-browser-game"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-press-start text-lg bg-yellow-400 text-black px-8 py-4 border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:bg-yellow-300 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all transform"
            >
              Play My Game!
            </a>
          </div>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="animate-fade-in">
        <h2 className="font-press-start text-2xl text-yellow-300 mb-6 text-center text-shadow-sm">
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
                className="bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b] hover:shadow-[10px_10px_0_0_#1e293b] transition-all duration-200 h-full flex flex-col"
              >
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                    className="w-full h-40 object-cover border-2 border-black mb-4"
                  />
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
                  <h2 className="font-press-start text-lg text-yellow-300 my-2 text-shadow-sm flex-grow">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-yellow-200"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h2>
                  <div
                    className="text-gray-300 text-base mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
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
          <div className="text-center mt-8">
            <Link
              href="/archive"
              className="font-press-start text-lg bg-green-500 text-black px-6 py-3 border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:bg-green-400 active:translate-x-1 active:translate-y-1 transition-all transform"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="font-press-start text-xl text-yellow-300 mb-4 text-center text-shadow-sm">
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
  )
}
