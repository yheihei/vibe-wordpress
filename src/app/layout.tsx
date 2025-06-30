import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vibe Coding Lair',
  description:
    'The digital playground of わいへい (Waihei). I build games, explore AI, and write about Vibe Coding.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-900 text-white">
        <div className="flex flex-col min-h-screen bg-gray-900 text-lg text-gray-300">
          {/* Header */}
          <header className="bg-gray-900 border-b-4 border-black sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
              <Link href="/" className="text-center sm:text-left">
                <h1 className="font-press-start text-xl md:text-2xl text-green-400 text-shadow hover:text-green-300 transition-colors">
                  Vibe Coding Lair
                </h1>
              </Link>
              <nav className="mt-4 sm:mt-0">
                <ul className="flex space-x-4 md:space-x-6 text-lg">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-yellow-200 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/archive"
                      className="hover:text-yellow-200 transition-colors"
                    >
                      Archive
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-yellow-200 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 border-t-4 border-black mt-12 py-6">
            <div className="container mx-auto px-4 text-center text-gray-500">
              <p>&copy; 2024 わいへい (Waihei). All rights reserved.</p>
              <p className="mt-2 text-sm">Powered by Retro Vibes & Code</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
