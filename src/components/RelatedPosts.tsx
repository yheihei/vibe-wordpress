import Link from 'next/link'
import { Post } from '@/lib/wp'

type RelatedPostsProps = {
  posts: Post[]
  currentPostId: number
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // 現在の記事を除外
  const filteredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3)

  if (filteredPosts.length === 0) return null

  return (
    <aside
      className="mt-12 bg-gray-800 border-4 border-black p-6"
      aria-label="関連記事"
    >
      <h2 className="text-yellow-300 font-bold text-2xl mb-6">関連記事</h2>
      <ul className="space-y-4">
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.slug}`}
              className="block hover:bg-gray-700 p-3 transition-colors"
            >
              <h3
                className="text-green-400 font-bold mb-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <p className="text-gray-400 text-sm">
                {new Date(post.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
