import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function IntroSplash({ visible }) {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    if (!visible) { setShowScroll(false); return }
    const t = setTimeout(() => setShowScroll(true), 2000)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(2.8rem, 9vw, 8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 0 80px rgba(200,169,110,0.25)',
              lineHeight: 1.05,
            }}
          >
            RISING FROM<br />THE CODE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.35em',
              marginTop: '1.75rem',
              textTransform: 'uppercase',
            }}
          >
            A story by Aiman Syafiq
          </motion.p>

          <AnimatePresence>
            {showScroll && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.9rem',
                }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 9,
                  fontWeight: 300,
                  color: '#c8a96e',
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  animation: 'pulse-scroll 2.2s ease-in-out infinite',
                }}>
                  Scroll to Begin
                </span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #c8a96e, transparent)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
