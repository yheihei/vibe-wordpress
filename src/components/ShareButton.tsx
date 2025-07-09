'use client'

type ShareButtonProps = {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
  }

  return (
    <div className="mt-12 mb-8 border-t-4 border-dashed border-gray-600 pt-8">
      <div className="flex gap-4">
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 bg-black
                     border-2 border-black shadow-[4px_4px_0_0_#334155] 
                     hover:shadow-[2px_2px_0_0_#334155] hover:translate-x-[2px] hover:translate-y-[2px] 
                     transition-all duration-100"
          aria-label="Xでシェアする"
        >
          <img
            src="/images/x-logo-white.png"
            alt="X"
            width="20"
            height="20"
            className="object-contain"
          />
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 bg-[#1877F2]
                     border-2 border-black shadow-[4px_4px_0_0_#334155] 
                     hover:shadow-[2px_2px_0_0_#334155] hover:translate-x-[2px] hover:translate-y-[2px] 
                     transition-all duration-100"
          aria-label="Facebookでシェアする"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>

        <a
          href={shareLinks.hatena}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 bg-[#00A4DE]
                     border-2 border-black shadow-[4px_4px_0_0_#334155] 
                     hover:shadow-[2px_2px_0_0_#334155] hover:translate-x-[2px] hover:translate-y-[2px] 
                     transition-all duration-100"
          aria-label="はてなブックマークでシェアする"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zM8.88 17.9a2.48 2.48 0 01-2.48 2.48 2.48 2.48 0 01-2.48-2.48 2.48 2.48 0 012.48-2.48 2.48 2.48 0 012.48 2.48zM11.19 3.52H6.35v7.2c0 .28.23.52.52.52h1.19c.84 0 1.26.64 1.26 1.96v2.67c0 .28.22.51.51.51h.83c.28 0 .51-.23.51-.51V12.7c0-2.09-1.17-3.2-1.98-3.8 1.16-.36 1.98-1.44 1.98-2.93 0-1.65-1.18-2.45-1.98-2.45zm6.94 14.38a2.48 2.48 0 01-2.48 2.48 2.48 2.48 0 01-2.48-2.48 2.48 2.48 0 012.48-2.48 2.48 2.48 0 012.48 2.48zm.61-14.38h-2.81c-.28 0-.51.23-.51.51v7.91c0 .28.23.51.51.51h2.81c.28 0 .51-.23.51-.51V4.03a.51.51 0 00-.51-.51z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
