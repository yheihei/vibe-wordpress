import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/wp-admin/',
          '/wp-content/uploads/',
          '/*?s=',
          '/*?p=',
          '/*?replytocom=',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
