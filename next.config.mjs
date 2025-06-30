/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yhei-web-design.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      },
      // 開発時のプレースホルダー画像用
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ISRとオンデマンドISRのサポート
  experimental: {
    // incrementalCacheHandlerPath: process.env.NODE_ENV === 'production' ? '@vercel/cache-handler' : undefined,
  },
}

export default nextConfig