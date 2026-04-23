import { useRef, useEffect, useState } from 'react'
import ArsenalSkills from './ArsenalSkills'
import TheCallCTA from './TheCallCTA'

function drawFrame(canvas, frames, idx, chapter) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const [top, bot] = chapter.fallbackGradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0, top)
  grad.addColorStop(1, bot)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const frame = frames?.[idx]
  if (frame?.complete && frame.naturalWidth > 0 && !frame._failed) {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  }
}

function ChapterText({ chapter, compact }) {
  return (
    <>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: compact ? 'clamp(2rem, 5vw, 4rem)' : 'clamp(3.2rem, 8vw, 10rem)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        color: '#fff',
        lineHeight: 0.9,
        marginBottom: compact ? '0.8rem' : '1.4rem',
        textShadow: '0 2px 60px rgba(0,0,0,0.9)',
      }}>
        {chapter.tag}
      </div>

      {chapter.subtitle && (
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: compact ? 'clamp(0.85rem, 1.5vw, 1rem)' : 'clamp(1rem, 2.2vw, 1.4rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: compact ? '0.6rem' : '1.2rem',
          textShadow: '0 1px 20px rgba(0,0,0,0.8)',
          lineHeight: 1.5,
        }}>
          {chapter.subtitle}
        </div>
      )}

      {chapter.body && (
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.9,
          maxWidth: 460,
          textShadow: '0 1px 12px rgba(0,0,0,0.8)',
        }}>
          {chapter.body}
        </div>
      )}
    </>
  )
}

// fade zone fraction — how much of progress is used for fade in/out
const FADE_IN  = 0.04   // 0→FADE_IN   : fade from black
const FADE_OUT = 0.94   // FADE_OUT→1  : fade to black

export default function ChapterSection({ chapter, frames, onActive }) {
  const sectionRef      = useRef(null)
  const canvasRef       = useRef(null)
  const overlayRef      = useRef(null)
  const fadeRef         = useRef(null)
  const targetP         = useRef(0)
  const currentP        = useRef(0)
  const skillProgressRef = useRef(0)

  const [showContent, setShowContent] = useState(false)
  const contentShown  = useRef(false)

  // canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(canvas, frames, 0, chapter)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [frames, chapter])

  // scroll → target, rAF → lerp + draw + fade
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      targetP.current = scrollable > 0
        ? Math.max(0, Math.min(1, -rect.top / scrollable))
        : 0

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        onActive(chapter.number, chapter.tag)
      }
    }

    let rafId
    const tick = () => {
      const diff = targetP.current - currentP.current
      if (Math.abs(diff) < 0.002) {
        currentP.current = targetP.current
      } else {
        currentP.current += diff * 0.12
      }
      const p = currentP.current

      // draw frame
      const canvas = canvasRef.current
      if (canvas) {
        const total = frames?.length ?? 1
        const idx   = Math.min(Math.floor(p * total), total - 1)
        drawFrame(canvas, frames, idx, chapter)
      }

      // text overlay — fade in on entry, fade out on exit
      const overlay = overlayRef.current
      if (overlay) {
        const opacity = p < FADE_IN  ? p / FADE_IN
                      : p > FADE_OUT ? (1 - p) / (1 - FADE_OUT)
                      : 1
        const y = p < FADE_IN ? 28 * (1 - p / FADE_IN) : 0
        overlay.style.opacity       = opacity
        overlay.style.transform     = `translateY(${y}px)`
        overlay.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto'
      }

      // black fade overlay — cinematic chapter transitions
      const fade = fadeRef.current
      if (fade) {
        let black = 0
        if (p < FADE_IN)   black = 1 - (p / FADE_IN)
        else if (p > FADE_OUT) black = (p - FADE_OUT) / (1 - FADE_OUT)
        fade.style.opacity = black
      }

      skillProgressRef.current = p

      if (p > 0.12 && !contentShown.current) {
        contentShown.current = true
        setShowContent(true)
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [frames, chapter, onActive])

  return (
    <div ref={sectionRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        {/* readability tint */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'none',
        }} />

        {/* text content */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
          {chapter.textPosition === 'bottom-left' && (
            <div style={{ position: 'absolute', bottom: '8%', left: '5%', maxWidth: 520 }}>
              <ChapterText chapter={chapter} />
            </div>
          )}

          {chapter.textPosition === 'center' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', maxWidth: 640, padding: '0 2rem' }}>
                <ChapterText chapter={chapter} />
              </div>
            </div>
          )}

          {chapter.textPosition === 'right' && (
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0, right: '5%',
              width: 'min(340px, 88vw)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.5rem',
            }}>
              <ChapterText chapter={chapter} compact />
              {chapter.skills && (
                <ArsenalSkills skills={chapter.skills} progressRef={skillProgressRef} />
              )}
            </div>
          )}

          {chapter.textPosition === 'center-cta' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '2.5rem',
            }}>
              <div style={{ textAlign: 'center', maxWidth: 600, padding: '0 2rem' }}>
                <ChapterText chapter={chapter} />
              </div>
              <TheCallCTA show={showContent} />
            </div>
          )}
        </div>

        {/* cinematic black fade — topmost, covers canvas + text */}
        <div
          ref={fadeRef}
          style={{
            position: 'absolute', inset: 0,
            background: '#000',
            opacity: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
