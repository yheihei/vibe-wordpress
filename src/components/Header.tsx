import Link from 'next/link'
import { SearchForm } from './SearchForm'

interface HeaderProps {
  className?: string
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header
      className={`bg-gray-900 border-b-4 border-black sticky top-0 z-[200] ${className}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Logo and Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Link href="/" className="text-center sm:text-left">
              <h1 className="font-press-start text-xl md:text-2xl text-green-400 text-shadow hover:text-green-300 transition-colors">
                Y-Game
              </h1>
            </Link>
            <nav>
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
                    href="/pages/about-me"
                    className="hover:text-yellow-200 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://qiita.com/yheihei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-200 transition-colors"
                  >
                    Qiita
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Search Form */}
          <div className="w-full sm:w-auto">
            <SearchForm className="justify-center sm:justify-end" />
          </div>
        </div>
      </div>
    </header>
  )
}
