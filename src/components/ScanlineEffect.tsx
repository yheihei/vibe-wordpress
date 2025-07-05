'use client'

interface ScanlineEffectProps {
  isActive: boolean
}

export default function ScanlineEffect({ isActive }: ScanlineEffectProps) {
  if (!isActive) return null

  return (
    <div className="scanline-container">
      <div className="scanline" />
      <div className="glitch-lines" />
    </div>
  )
}
