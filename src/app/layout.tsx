import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { constructMetadata } from '@/lib/metadata'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/structured-data'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = constructMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#111827',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-900 text-white">
        <JsonLd data={generateWebSiteSchema()} />
        <JsonLd data={generateOrganizationSchema()} />
        <div className="flex flex-col min-h-screen bg-gray-900 text-lg text-gray-300">
          <Header />

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 border-t-4 border-black mt-12 py-6">
            <div className="container mx-auto px-4 text-center text-gray-500">
              <p>&copy; 2025 わいへい (yhei_hei). All rights reserved.</p>
              <p className="mt-2 text-sm">Powered by Retro Vibes & Code</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
