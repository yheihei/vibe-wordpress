import { fetchPageBySlug, getFeaturedImageUrl } from '@/lib/wp'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchPageBySlug(slug)

  if (!page) {
    return {
      title: 'ページが見つかりません',
    }
  }

  return {
    title: `${page.title.rendered} | Y-Game`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await fetchPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const featuredImage = getFeaturedImageUrl(page)

  return (
    <div className="bg-slate-800 text-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#1e293b]">
      <article className="max-w-2xl mx-auto">
        <div className="border-b-4 border-dashed border-gray-600 pb-4 mb-4">
          <h1
            className="font-gothic text-3xl md:text-4xl text-yellow-300 my-4 text-shadow-sm"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
        </div>

        {featuredImage && (
          <img
            src={featuredImage}
            alt={page.title.rendered.replace(/<[^>]*>/g, '')}
            className="w-full object-cover border-4 border-black my-6"
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
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </article>
    </div>
  )
}
