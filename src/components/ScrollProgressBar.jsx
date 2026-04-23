import { useEffect, useState } from 'react'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handle = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      background: 'rgba(200,169,110,0.15)',
      zIndex: 1000,
    }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: '#c8a96e',
        boxShadow: '0 0 8px rgba(200,169,110,0.8)',
        transition: 'width 0.08s linear',
      }} />
    </div>
  )
}
