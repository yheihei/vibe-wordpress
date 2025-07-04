import { siteConfig } from './metadata'
import { Post } from './wp'

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBlogPostingSchema(
  post: Post,
  url: string,
  imageUrl?: string
) {
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '')
  const plainExcerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .slice(0, 160)
  const plainContent = post.content.rendered.replace(/<[^>]*>/g, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: plainTitle,
    description: plainExcerpt,
    url: url,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    articleBody: plainContent,
    wordCount: plainContent.split(/\s+/).length,
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
    description: 'ゲーム開発者、AIエンジニア、Vibe Codingの実践者',
  }
}
