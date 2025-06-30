import { fetchPageBySlug } from '@/lib/wp'
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
    title: `${page.title.rendered} | Vibe Coding Lair`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await fetchPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-4xl">
      <h1
        className="font-press-start text-3xl md:text-4xl text-yellow-200 mb-8 text-shadow"
        dangerouslySetInnerHTML={{ __html: page.title.rendered }}
      />

      <div
        className="wp-content text-gray-300 space-y-6"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  )
}
