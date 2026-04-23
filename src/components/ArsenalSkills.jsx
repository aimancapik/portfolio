import { useRef, useEffect } from 'react'

export default function ArsenalSkills({ skills, progressRef }) {
  const barRefs = useRef([])
  const numRefs = useRef([])

  useEffect(() => {
    let rafId
    const tick = () => {
      const p = progressRef?.current ?? 0
      skills.forEach((skill, i) => {
        // stagger: each bar starts and ends at slightly different scroll points
        const start = 0.12 + i * 0.022
        const end   = 0.55 + i * 0.022
        const fill  = Math.max(0, Math.min(1, (p - start) / (end - start)))

        const bar = barRefs.current[i]
        if (bar) bar.style.width = `${fill * skill.level}%`

        const num = numRefs.current[i]
        if (num) num.textContent = `${Math.round(fill * skill.level)}%`
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef, skills])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {skills.map((skill, i) => (
        <div key={skill.name}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.3rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            <span>{skill.name}</span>
            <span
              ref={el => { numRefs.current[i] = el }}
              style={{ color: '#c8a96e', fontVariantNumeric: 'tabular-nums', minWidth: '2.5em', textAlign: 'right' }}
            >
              0%
            </span>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div
              ref={el => { barRefs.current[i] = el }}
              style={{
                height: '100%',
                width: 0,
                background: '#c8a96e',
                boxShadow: '0 0 8px rgba(200,169,110,0.5)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
