import { motion, AnimatePresence } from 'framer-motion'

const hudText = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 300,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
}

export default function HUD({ activeChapter, chapterTag }) {
  return (
    <>
      <div style={{ position: 'fixed', top: 28, left: 28, zIndex: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapter}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            style={{ ...hudText, fontSize: 11, color: '#c8a96e' }}
          >
            {activeChapter} / 04
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ position: 'fixed', top: 28, right: 28, zIndex: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={chapterTag}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            style={{ ...hudText, fontSize: 10, color: 'rgba(255,255,255,0.45)' }}
          >
            {chapterTag}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
