'use client'

import type React from 'react'
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react'

export type LimelightItem = {
  id: string
  label: React.ReactNode
  onClick?: () => void
}

type LimelightNavProps = {
  items: LimelightItem[]
  activeIndex?: number
  onItemClick?: (index: number, id: string) => void
  className?: string
  size?: 'sm' | 'md'
}

const S = {
  sm:  { nav: 'h-9 rounded-lg px-0.5',  btn: 'text-xs px-2.5 py-1',    spot: 'w-8 h-[2px]',  cone: 'top-[2px] h-8',  shadow: '0 15px 8px rgba(201,164,78,0.12)' },
  md:  { nav: 'h-11 rounded-xl px-1',    btn: 'text-[15px] px-4 py-1.5', spot: 'w-10 h-[3px]', cone: 'top-[3px] h-10', shadow: '0 25px 12px rgba(201,164,78,0.15)' },
} as const

export function LimelightNav({
  items,
  activeIndex: controlledIndex,
  onItemClick,
  className = '',
  size = 'md',
}: LimelightNavProps) {
  const [internalIndex, setInternalIndex] = useState(controlledIndex ?? 0)
  const activeIndex = controlledIndex ?? internalIndex
  const [isReady, setIsReady] = useState(false)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const spotlightRef = useRef<HTMLDivElement>(null)

  const itemsKey = items.map(i => i.id).join('|')
  const labelsKey = items.map(i => String(i.label)).join('|')

  const positionSpotlight = useCallback(() => {
    if (items.length === 0) return

    const spotlight = spotlightRef.current
    const activeItem = activeIndex >= 0 ? itemRefs.current[activeIndex] : null

    if (spotlight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - spotlight.offsetWidth / 2
      spotlight.style.left = `${newLeft}px`
      spotlight.style.opacity = '1'

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50)
      }
    } else if (spotlight) {
      spotlight.style.opacity = '0'
    }
  }, [activeIndex, isReady, items.length])

  useLayoutEffect(() => {
    positionSpotlight()
    // Reposition once layout settles after label-length changes (e.g. language switch)
    requestAnimationFrame(() => {
      positionSpotlight()
      setTimeout(positionSpotlight, 40)
    })
  }, [positionSpotlight, itemsKey, labelsKey])

  useEffect(() => {
    const activeItem = activeIndex >= 0 ? itemRefs.current[activeIndex] : null
    const nav = spotlightRef.current?.parentElement
    if (!activeItem || !nav || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => positionSpotlight())
    observer.observe(activeItem)
    observer.observe(nav)
    window.addEventListener('resize', positionSpotlight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', positionSpotlight)
    }
  }, [activeIndex, positionSpotlight])

  if (items.length === 0) return null

  const handleClick = (index: number, id: string, itemOnClick?: () => void) => {
    setInternalIndex(index)
    onItemClick?.(index, id)
    itemOnClick?.()
  }

  const s = S[size]

  return (
    <nav
      className={`relative inline-flex items-center ${s.nav} bg-warm-800/30 border border-warm-700/25 backdrop-blur-sm ${className}`}
    >
      {items.map(({ id, label, onClick }, index) => (
        <button
          key={id}
          ref={el => { itemRefs.current[index] = el }}
          className={`relative z-20 cursor-pointer whitespace-nowrap transition-colors duration-200 flex items-center justify-center ${s.btn} ${
            activeIndex === index
              ? 'text-gold-400 font-medium'
              : 'text-warm-400 hover:text-warm-200'
          }`}
          onClick={() => handleClick(index, id, onClick)}
        >
          {label}
        </button>
      ))}

      {/* Spotlight bar */}
      <div
        ref={spotlightRef}
        className={`absolute top-0 z-10 ${s.spot} rounded-full bg-gold-400 ${
          isReady ? 'transition-[left,opacity] duration-400 ease-in-out' : ''
        }`}
        style={{ left: '-999px', opacity: 0, boxShadow: s.shadow }}
      >
        <div
          className={`absolute left-[-30%] w-[160%] pointer-events-none ${s.cone}`}
          style={{
            clipPath: 'polygon(10% 100%, 25% 0, 75% 0, 90% 100%)',
            background: 'linear-gradient(to bottom, rgba(201,164,78,0.18), transparent)',
          }}
        />
      </div>
    </nav>
  )
}
