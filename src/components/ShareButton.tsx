'use client'

type ShareButtonProps = {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`

  return (
    <div className="mt-12 mb-8 border-t-4 border-dashed border-gray-600 pt-8">
      <a
        href={shareUrl}
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
    </div>
  )
}
