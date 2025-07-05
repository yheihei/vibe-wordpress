'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { useScrollVisibility } from '@/hooks/useScrollVisibility'

export function HeaderWrapper() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  const { isHeaderMounted, headerAnimationClass } = useScrollVisibility({
    threshold: 100,
  })

  // Always show header on non-home pages
  if (!isHomePage) {
    return <Header />
  }

  // On home page, conditionally show header based on scroll
  return isHeaderMounted ? <Header className={headerAnimationClass} /> : null
}