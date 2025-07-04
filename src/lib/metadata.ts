import { Metadata } from 'next'

export const siteConfig = {
  name: 'Y-Game',
  title: 'Y-Game - わいへいのデジタルプレイグラウンド',
  description:
    'The digital playground of わいへい (Waihei). I build games, explore AI, and write about Vibe Coding.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yhei-web-design.com',
  ogImage: '/og-image.jpg',
  author: {
    name: 'わいへい (yhei_hei)',
    twitter: '@yhei_hei',
    url: 'https://yhei-web-design.com',
  },
  links: {
    twitter: 'https://twitter.com/yhei_hei',
    github: 'https://github.com/yhei',
  },
}

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  ...props
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
} & Metadata = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      'ゲーム開発',
      'AI',
      'Vibe Coding',
      'レトロゲーム',
      'プログラミング',
      'Next.js',
      'WordPress',
    ],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${siteConfig.url}${image}`],
      creator: siteConfig.author.twitter,
    },
    icons: {
      icon: '/favicon.jpg',
      apple: '/favicon.jpg',
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...props,
  }
}
