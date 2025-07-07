import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fetchPostBySlug,
  getFeaturedImageUrl,
  getPostCategories,
  fetchPostsByCategory,
  type Post,
} from '@/lib/wp'
import { constructMetadata, siteConfig } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import {
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
} from '@/lib/structured-data'
import { TableOfContents } from '@/components/TableOfContents'
import { ArticleSummary } from '@/components/ArticleSummary'
import { RelatedPosts } from '@/components/RelatedPosts'
import { ShareButton } from '@/components/ShareButton'
import {
  addHeadingIds,
  calculateReadingTime,
  getWordCount,
} from '@/lib/content-utils'

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
    return constructMetadata({
      title: '記事が見つかりません | Y-Game',
      noIndex: true,
    })
  }

  // HTMLタグを除去
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '')
  const plainExcerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .slice(0, 160)

  const featuredImage = getFeaturedImageUrl(post)
  const postUrl = `${siteConfig.url}/posts/${slug}`

  return constructMetadata({
    title: `${plainTitle} | ${siteConfig.name}`,
    description: plainExcerpt,
    image: featuredImage || siteConfig.ogImage,
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [siteConfig.author.name],
      url: postUrl,
    },
    alternates: {
      canonical: postUrl,
    },
  })
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

  // コンテンツ処理
  const processedContent = addHeadingIds(post.content.rendered)
  const readingTime = calculateReadingTime(post.content.rendered)
  const wordCount = getWordCount(post.content.rendered)

  // 関連記事を取得（同じカテゴリーの記事）
  let relatedPosts: Post[] = []
  if (mainCategory) {
    const { posts } = await fetchPostsByCategory(mainCategory.slug, 4, 1)
    relatedPosts = posts
  }

  const postUrl = `${siteConfig.url}/posts/${slug}`
  const breadcrumbItems = [
    { name: 'ホーム', url: siteConfig.url },
    { name: post.title.rendered.replace(/<[^>]*>/g, ''), url: postUrl },
  ]

  if (mainCategory) {
    breadcrumbItems.splice(1, 0, {
      name: mainCategory.name,
      url: `${siteConfig.url}/category/${mainCategory.slug}`,
    })
  }

  return (
    <>
      <JsonLd
        data={generateBlogPostingSchema(
          post,
          postUrl,
          featuredImage || undefined
        )}
      />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <main className="bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b]">
        <article className="max-w-2xl mx-auto">
          <header className="border-b-4 border-dashed border-gray-600 pb-4 mb-4">
            {mainCategory && (
              <Link
                href={`/category/${mainCategory.slug}`}
                className="text-green-400 font-bold uppercase hover:underline"
                aria-label={`カテゴリー: ${mainCategory.name}`}
              >
                {mainCategory.name}
              </Link>
            )}
            <h1
              className="font-gothic text-3xl md:text-4xl text-yellow-300 my-4 text-shadow-sm"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <time className="text-gray-400" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </time>
          </header>

          {featuredImage && (
            <figure className="my-6">
              <img
                src={featuredImage}
                alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                className="w-full object-cover border-4 border-black"
              />
            </figure>
          )}

          <ArticleSummary readingTime={readingTime} wordCount={wordCount} />

          <TableOfContents content={processedContent} />

          <section
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
            dangerouslySetInnerHTML={{ __html: processedContent }}
            aria-label="記事本文"
          />

          <ShareButton
            url={postUrl}
            title={post.title.rendered.replace(/<[^>]*>/g, '')}
          />

          <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
        </article>
      </main>
    </>
  )
}
