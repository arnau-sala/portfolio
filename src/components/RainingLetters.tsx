'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#'

export function RainingLettersBackground() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  const createCharacters = useCallback(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 300
    const chars: Character[] = []
    for (let i = 0; i < count; i++) {
      chars.push({
        char: ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      })
    }
    return chars
  }, [])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  useEffect(() => {
    const update = () => {
      const next = new Set<number>()
      const count = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < count; i++) {
        next.add(Math.floor(Math.random() * characters.length))
      }
      setActiveIndices(next)
    }
    const id = setInterval(update, 50)
    return () => clearInterval(id)
  }, [characters.length])

  useEffect(() => {
    let frameId: number
    const tick = () => {
      setCharacters(prev =>
        prev.map(c => ({
          ...c,
          y: c.y + c.speed,
          ...(c.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
          }),
        }))
      )
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {characters.map((c, i) => {
        const active = activeIndices.has(i)
        return (
          <span
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              color: active ? '#c9a44e' : 'rgba(201,164,78,0.25)',
              fontWeight: active ? 700 : 300,
              transform: `translate(-50%, -50%) scale(${active ? 1.25 : 1})`,
              textShadow: active
                ? '0 0 8px rgba(201,164,78,0.6), 0 0 14px rgba(201,164,78,0.3)'
                : 'none',
              transition: 'color 0.1s, transform 0.1s, text-shadow 0.1s',
              willChange: 'transform, top',
              fontSize: 'clamp(1rem, 2vw, 1.8rem)',
            }}
          >
            {c.char}
          </span>
        )
      })}
    </div>
  )
}

interface ScrambledTextProps {
  text: string
  className?: string
  delay?: number
}

export function ScrambledText({ text, className, delay = 400 }: ScrambledTextProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const queue: Array<{ to: string; start: number; end: number; char?: string }> = []
    for (let i = 0; i < text.length; i++) {
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push({ to: text[i], start, end })
    }

    let frame = 0
    let frameId: number

    const update = () => {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i++) {
        const { to, start, end } = queue[i]
        let { char } = queue[i]
        if (frame >= end) {
          complete++
          output += to
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            queue[i].char = char
          }
          output += `<span class="scramble-dud">${char}</span>`
        } else {
          output += ''
        }
      }
      el.innerHTML = output
      el.style.visibility = 'visible'
      if (complete < queue.length) {
        frameId = requestAnimationFrame(update)
        frame++
      }
    }

    el.style.visibility = 'hidden'
    const timer = setTimeout(update, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frameId)
    }
  }, [text, delay])

  return (
    <h1 ref={ref} className={className} style={{ visibility: 'hidden', minHeight: '1.2em' }}>
      {text}
    </h1>
  )
}
