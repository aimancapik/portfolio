import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PORTRAIT_COLORS = {
  'UTHM Castle':      { bg: '#5c3d1e', icon: '🏰' },
  'AMAST City':       { bg: '#2d3a4a', icon: '🏙️' },
  'ProppyApp Tower':  { bg: '#3a3a5c', icon: '🗼' },
  'Skills Dungeon':   { bg: '#1a1a3a', icon: '⚔️' },
  'Project Ruins':    { bg: '#2a3a1a', icon: '🏚️' },
  'Tavern':           { bg: '#4a2a1a', icon: '🍺' },
};

const DialogueBox = ({ isOpen, content, typedText, isTyping, onClose, onSkip }) => {
  if (!content) return null;

  const portrait = PORTRAIT_COLORS[content.title] ?? { bg: '#0f3460', icon: '❓' };
  const showDetails = !isTyping && content.details?.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 220, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 220, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 120 }}
          className="fixed bottom-0 left-0 w-full z-50 p-3 md:p-6 pointer-events-none"
        >
          <div
            className="w-full max-w-4xl mx-auto pointer-events-auto cursor-pointer"
            onClick={isTyping ? onSkip : onClose}
          >
            {/* Details cards — slide in above dialogue when typing done */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 flex flex-wrap gap-2 justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {content.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-background/95 border border-gold/60 px-2 py-1 text-[7px] md:text-[9px] text-text/90 max-w-xs"
                      style={{ boxShadow: '2px 2px 0 #0f3460' }}
                    >
                      {detail}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main dialogue box */}
            <div
              className="w-full bg-accent border-4 border-white flex flex-col md:flex-row gap-3 md:gap-5 p-3 md:p-5 shadow-2xl"
              style={{ boxShadow: '4px 4px 0 #000, inset 0 0 0 2px #0f3460' }}
            >
              {/* Portrait */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 border-white flex items-center justify-center text-2xl md:text-3xl"
                style={{ background: portrait.bg, boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.1)' }}
              >
                {portrait.icon}
              </div>

              {/* Text area */}
              <div className="flex-1 flex flex-col gap-2 min-h-[80px]">
                <div className="flex items-end justify-between border-b-2 border-white/20 pb-2">
                  <h3 className="text-gold text-[10px] md:text-xs tracking-wide">{content.title}</h3>
                  <span className="text-text/60 text-[8px] md:text-[10px] uppercase">{content.subtitle}</span>
                </div>

                <div className="text-text text-[9px] md:text-xs leading-relaxed whitespace-pre-wrap min-h-[48px]">
                  {typedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block ml-0.5 w-[6px] h-[10px] bg-text align-middle"
                    />
                  )}
                </div>

                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-right"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-[8px] text-green border border-green px-2 py-1"
                    >
                      CLICK TO CLOSE ▼
                    </motion.span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DialogueBox;
