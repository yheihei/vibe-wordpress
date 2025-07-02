import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fetchPostBySlug,
  getFeaturedImageUrl,
  getPostCategories,
} from '@/lib/wp'

export const dynamic = 'force-static'
export const revalidate = 300 // 5分毎にISR

type Props = {
  params: Promise<{ slug: string }>
}

// メタデータの動的生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    return {
      title: '記事が見つかりません | Vibe Coding Lair',
    }
  }

  // HTMLタグを除去
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '')
  const plainExcerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .slice(0, 160)

  return {
    title: `${plainTitle} | Vibe Coding Lair`,
    description: plainExcerpt,
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const featuredImage = getFeaturedImageUrl(post)
  const categories = getPostCategories(post)
  const mainCategory = categories[0]

  return (
    <div className="bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b]">
      <article>
        <div className="border-b-4 border-dashed border-gray-600 pb-4 mb-4">
          {mainCategory && (
            <Link
              href={`/category/${mainCategory.slug}`}
              className="text-green-400 font-bold uppercase hover:underline"
            >
              {mainCategory.name}
            </Link>
          )}
          <h1
            className="font-gothic text-3xl md:text-4xl text-yellow-300 my-4 text-shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-gray-400">
            {new Date(post.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>

        {featuredImage && (
          <img
            src={featuredImage}
            alt={post.title.rendered.replace(/<[^>]*>/g, '')}
            className="w-full max-w-2xl mx-auto object-cover border-4 border-black my-6"
          />
        )}

        <div
          className="prose prose-invert prose-lg max-w-none font-gothic
            prose-headings:font-gothic prose-headings:text-yellow-300 
            prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
            prose-h2:mt-12 prose-h3:mt-10 prose-h4:mt-8
            prose-p:text-gray-300 prose-p:text-xl prose-p:leading-loose prose-p:mb-6
            prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1
            prose-pre:bg-gray-900 prose-pre:border-2 prose-pre:border-black
            prose-blockquote:border-l-4 prose-blockquote:border-yellow-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:mb-10
            prose-ul:list-disc prose-ul:ml-6 prose-ul:pl-0 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:pl-0 prose-ol:mb-6
            prose-li:text-gray-300
            prose-img:border-4 prose-img:border-black prose-img:my-8
            [&_p+h2]:!mt-16 [&_p+h3]:!mt-14 [&_p+h4]:!mt-12
            [&_ul+h2]:!mt-16 [&_ul+h3]:!mt-14 [&_ul+h4]:!mt-12
            [&_ol+h2]:!mt-16 [&_ol+h3]:!mt-14 [&_ol+h4]:!mt-12
            [&_blockquote+h2]:!mt-16 [&_blockquote+h3]:!mt-14 [&_blockquote+h4]:!mt-12"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </div>
  )
}
