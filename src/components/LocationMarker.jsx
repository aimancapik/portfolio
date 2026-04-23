import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_ICON = {
  castle:   '🏰',
  city:     '🏙️',
  tower:    '🗼',
  dungeon:  '⚔️',
  ruins:    '🏚️',
  building: '🍺',
};

const LocationMarker = ({ location, screenX, screenY, onClick, isHovered, isNearby, onHover, onLeave }) => {
  const icon = TYPE_ICON[location.type] ?? '📍';
  const active = isHovered || isNearby;

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: screenX,
        top: screenY,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      onClick={(e) => onClick(e, location)}
      onMouseEnter={() => onHover(location)}
      onMouseLeave={onLeave}
    >
      {/* Hit area */}
      <div className="w-14 h-14 relative flex items-center justify-center">

        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: location.color }}
          animate={
            active
              ? { opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }
              : { opacity: 0.25, scale: 1 }
          }
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Expanding ping on active */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="ping"
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: location.color }}
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 2.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Center dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: location.color,
            border: '2px solid #fff',
            boxShadow: active ? `0 0 14px ${location.color}, 0 0 4px #fff` : `0 0 4px ${location.color}`,
          }}
        />
      </div>

      {/* Name tag — always visible, bolder when active */}
      <motion.div
        animate={{ opacity: active ? 1 : 0.6, y: active ? -6 : 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          padding: '3px 8px',
          background: 'rgba(26,26,46,0.92)',
          border: `1px solid ${active ? location.color : 'rgba(255,255,255,0.2)'}`,
          boxShadow: active ? `0 0 10px ${location.color}55` : 'none',
          pointerEvents: 'none',
          marginBottom: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10 }}>{icon}</span>
          <span style={{ fontSize: 8, color: '#fff', fontFamily: "'Press Start 2P', cursive", letterSpacing: '0.05em' }}>
            {location.name}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationMarker;
