import { fetchPageBySlug, getFeaturedImageUrl } from '@/lib/wp'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug('about-me')

  if (!page) {
    return {
      title: 'ページが見つかりません',
    }
  }

  return {
    title: `${page.title.rendered} | Vibe Coding Lair`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
  }
}

export default async function AboutPage() {
  const page = await fetchPageBySlug('about-me')

  if (!page) {
    notFound()
  }

  const featuredImage = getFeaturedImageUrl(page)

  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-4xl">
      <h1
        className="font-press-start text-3xl md:text-4xl text-yellow-200 mb-8 text-shadow"
        dangerouslySetInnerHTML={{ __html: page.title.rendered }}
      />

      {featuredImage && (
        <img
          src={featuredImage}
          alt={page.title.rendered.replace(/<[^>]*>/g, '')}
          className="w-full max-w-2xl mx-auto object-cover border-4 border-black mb-8"
        />
      )}

      <div
        className="wp-content text-gray-300 space-y-6"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  )
}
