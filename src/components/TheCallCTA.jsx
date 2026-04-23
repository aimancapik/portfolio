import { motion } from 'framer-motion'

const BUTTONS = [
  { label: 'View GitHub',          href: 'https://github.com/aimancapik',                    primary: true  },
  { label: 'Connect on LinkedIn',  href: 'https://www.linkedin.com/in/aimansyafiq-/',              primary: false },
  { label: 'Send a Message',       href: 'mailto:aimancapik@gmail.com',                       primary: false },
]

export default function TheCallCTA({ show }) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      {BUTTONS.map((btn, i) => (
        <motion.a
          key={btn.label}
          href={btn.href}
          target={btn.href.startsWith('mailto') ? undefined : '_blank'}
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
          transition={{ duration: 0.55, delay: i * 0.12 + 0.2 }}
          style={{
            display: 'inline-block',
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '0.85rem 2.5rem',
            border: '1px solid #c8a96e',
            color: btn.primary ? '#000' : '#c8a96e',
            background: btn.primary ? '#c8a96e' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            if (!btn.primary) {
              e.currentTarget.style.background = 'rgba(200,169,110,0.1)'
            }
          }}
          onMouseLeave={e => {
            if (!btn.primary) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          {btn.label}
        </motion.a>
      ))}
    </div>
  )
}
