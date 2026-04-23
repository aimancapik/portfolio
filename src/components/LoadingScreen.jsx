import { motion } from 'framer-motion'

export default function LoadingScreen({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        gap: '1.5rem',
      }}
    >
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 10,
        fontWeight: 300,
        color: '#c8a96e',
        letterSpacing: '0.5em',
      }}>
        LOADING
      </div>

      <div style={{ width: 180, height: 1, background: 'rgba(200,169,110,0.2)' }}>
        <motion.div
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ duration: 0.2 }}
          style={{
            height: '100%',
            background: '#c8a96e',
            boxShadow: '0 0 8px rgba(200,169,110,0.6)',
          }}
        />
      </div>

      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 10,
        fontWeight: 300,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.2em',
      }}>
        {Math.round(progress * 100)}%
      </div>
    </motion.div>
  )
}
