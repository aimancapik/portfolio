import React from 'react';
import { motion } from 'framer-motion';

// CSS pixel-art character — 4-frame walk cycle via keyframe animation
// Body: white tunic, colored direction indicator, shadow beneath

const Character = ({ position, isMoving, direction }) => {
  return (
    <div
      className="absolute z-20"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
      }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1"
        style={{
          width: 18,
          height: 5,
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }}
      />

      {/* Character body */}
      <motion.div
        animate={isMoving ? { y: [0, -3, 0, -3, 0] } : { y: 0 }}
        transition={isMoving ? { duration: 0.4, repeat: Infinity, ease: 'linear' } : {}}
        style={{ position: 'relative', width: 20, height: 28 }}
      >
        {/* Head */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            background: '#f5c9a0',
            border: '1.5px solid #2a1a0a',
            boxShadow: '1px 1px 0 #2a1a0a',
          }}
        >
          {/* Eyes based on direction */}
          {direction === 'down' && (
            <>
              <div style={{ position: 'absolute', top: 4, left: 2, width: 2, height: 2, background: '#1a1a2e' }} />
              <div style={{ position: 'absolute', top: 4, right: 2, width: 2, height: 2, background: '#1a1a2e' }} />
            </>
          )}
          {direction === 'up' && (
            <div style={{ position: 'absolute', bottom: 1, left: 2, right: 2, height: 1, background: '#2a1a0a' }} />
          )}
          {direction === 'left' && (
            <div style={{ position: 'absolute', top: 4, left: 1, width: 2, height: 2, background: '#1a1a2e' }} />
          )}
          {direction === 'right' && (
            <div style={{ position: 'absolute', top: 4, right: 1, width: 2, height: 2, background: '#1a1a2e' }} />
          )}
          {/* Hair */}
          <div style={{ position: 'absolute', top: -2, left: 0, right: 0, height: 3, background: '#2a1a0a' }} />
        </div>

        {/* Body / tunic */}
        <div
          style={{
            position: 'absolute',
            top: 11,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 14,
            height: 10,
            background: '#eaeaea',
            border: '1.5px solid #0f3460',
            boxShadow: '1px 1px 0 #0f3460',
          }}
        >
          {/* Belt */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#e94560' }} />
        </div>

        {/* Legs — alternate when moving */}
        <motion.div
          animate={isMoving ? { x: [-2, 2, -2] } : { x: 0 }}
          transition={isMoving ? { duration: 0.3, repeat: Infinity, ease: 'linear' } : {}}
          style={{ position: 'absolute', top: 20, left: 3, width: 5, height: 8, background: '#3a2a1a', border: '1px solid #1a0a00' }}
        />
        <motion.div
          animate={isMoving ? { x: [2, -2, 2] } : { x: 0 }}
          transition={isMoving ? { duration: 0.3, repeat: Infinity, ease: 'linear' } : {}}
          style={{ position: 'absolute', top: 20, right: 3, width: 5, height: 8, background: '#3a2a1a', border: '1px solid #1a0a00' }}
        />

        {/* Boots */}
        <div style={{ position: 'absolute', bottom: 0, left: 2, width: 6, height: 3, background: '#5c3d1e' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 2, width: 6, height: 3, background: '#5c3d1e' }} />
      </motion.div>

      {/* Exclamation when near a location */}
    </div>
  );
};

export default Character;
