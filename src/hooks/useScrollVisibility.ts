'use client'

import { useEffect, useState, useCallback } from 'react'

interface UseScrollVisibilityProps {
  threshold?: number
  onVisibilityChange?: (isVisible: boolean) => void
}

export function useScrollVisibility({
  threshold = 100,
  onVisibilityChange,
}: UseScrollVisibilityProps = {}) {
  const [isHeaderMounted, setIsHeaderMounted] = useState(false)
  const [headerAnimationClass, setHeaderAnimationClass] = useState('')
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const heroHeight = window.innerHeight // Full viewport height for hero

    // Check if scrolled past hero section
    const pastHero = scrollY > heroHeight - threshold

    if (pastHero && !hasScrolledPastHero) {
      // Show header when scrolling past hero
      setHasScrolledPastHero(true)
      setIsHeaderMounted(true)
      setHeaderAnimationClass('header-reveal')
      onVisibilityChange?.(true)
    } else if (!pastHero && hasScrolledPastHero) {
      // Hide header when scrolling back up to hero
      setHasScrolledPastHero(false)
      setHeaderAnimationClass('header-hide')
      onVisibilityChange?.(false)

      // Remove header from DOM after animation completes
      setTimeout(() => {
        setIsHeaderMounted(false)
      }, 300)
    }
  }, [hasScrolledPastHero, threshold, onVisibilityChange])

  useEffect(() => {
    let rafId: number
    let isScrolling = false

    const optimizedScroll = () => {
      if (!isScrolling) {
        rafId = requestAnimationFrame(() => {
          handleScroll()
          isScrolling = false
        })
        isScrolling = true
      }
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', optimizedScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', optimizedScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [handleScroll])

  return {
    isHeaderMounted,
    headerAnimationClass,
    hasScrolledPastHero,
  }
}
