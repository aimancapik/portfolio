import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { locations } from '../data/locations';
import { useCharacterMovement } from '../hooks/useCharacterMovement';
import { useDialogue } from '../hooks/useDialogue';
import DialogueBox from './DialogueBox';
import StatsPanel from './StatsPanel';

const VW = 1200;
const VH = 750;

// ─── SVG terrain pieces ───────────────────────────────────────────────────────

const Sky = () => (
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f5a84a" />
      <stop offset="40%" stopColor="#f7c97a" />
      <stop offset="100%" stopColor="#b8d96e" />
    </linearGradient>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5ab4e8" />
      <stop offset="100%" stopColor="#3a8ec8" />
    </linearGradient>
    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5ec44a" />
      <stop offset="100%" stopColor="#3a8c2a" />
    </linearGradient>
    <filter id="pixelate">
      <feFlood x="4" y="4" height="2" width="2"/>
      <feComposite width="8" height="8"/>
      <feTile result="a"/>
      <feComposite in="SourceGraphic" in2="a" operator="in"/>
      <feMorphology operator="dilate" radius="4"/>
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

// Tree cluster — pixel-art style stacked triangles
const Tree = ({ x, y, h = 28, color = '#3a9e2a' }) => {
  const dark = '#2a6e1a';
  return (
    <g>
      <polygon points={`${x},${y - h} ${x - h * 0.55},${y} ${x + h * 0.55},${y}`} fill={color} />
      <polygon points={`${x},${y - h * 0.65} ${x - h * 0.5},${y + h * 0.2} ${x + h * 0.5},${y + h * 0.2}`} fill={color} />
      <rect x={x - 4} y={y + h * 0.18} width={8} height={h * 0.3} fill={dark} />
      {/* Shadow side */}
      <polygon points={`${x},${y - h} ${x + h * 0.55},${y}`} fill={dark} opacity={0.4} />
    </g>
  );
};

const TreeCluster = ({ cx, cy, count = 6, spread = 40, size = 28, color = '#3a9e2a' }) => {
  const trees = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = spread * (0.3 + Math.random() * 0.7);
    trees.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.5,
      h: size * (0.8 + Math.random() * 0.4),
    });
  }
  return (
    <g>
      {trees.sort((a, b) => a.y - b.y).map((t, i) => (
        <Tree key={i} x={t.x} y={t.y} h={t.h} color={color} />
      ))}
    </g>
  );
};

// Mountain silhouette
const Mountain = ({ x, y, w = 120, h = 80 }) => (
  <g>
    <polygon points={`${x},${y - h} ${x - w / 2},${y} ${x + w / 2},${y}`} fill="#c8b89a" />
    <polygon points={`${x},${y - h} ${x + w / 2},${y}`} fill="#a89878" opacity={0.5} />
    {/* Snow */}
    <polygon points={`${x},${y - h} ${x - w * 0.18},${y - h * 0.62} ${x + w * 0.18},${y - h * 0.62}`} fill="#f0ece4" />
  </g>
);

// River segment
const River = () => (
  <g>
    {/* Main vertical river */}
    <path d="M 590,180 C 570,280 610,380 590,480 C 570,560 600,640 580,750"
      fill="none" stroke="url(#waterGrad)" strokeWidth={38} strokeLinecap="round" />
    {/* River cliff edges */}
    <path d="M 590,180 C 570,280 610,380 590,480 C 570,560 600,640 580,750"
      fill="none" stroke="#8B6914" strokeWidth={46} strokeLinecap="round" opacity={0.5} />
    <path d="M 590,180 C 570,280 610,380 590,480 C 570,560 600,640 580,750"
      fill="none" stroke="url(#waterGrad)" strokeWidth={38} strokeLinecap="round" />
    {/* Horizontal lake bottom */}
    <ellipse cx={500} cy={680} rx={160} ry={55} fill="url(#waterGrad)" />
    <ellipse cx={500} cy={680} rx={160} ry={55} fill="none" stroke="#8B6914" strokeWidth={10} opacity={0.5} />
    {/* Water shimmer */}
    <path d="M 540,500 Q 560,510 580,500" fill="none" stroke="#8fd4f8" strokeWidth={2} opacity={0.6} />
    <path d="M 535,520 Q 558,530 578,520" fill="none" stroke="#8fd4f8" strokeWidth={2} opacity={0.6} />
    <path d="M 450,665 Q 480,675 510,665" fill="none" stroke="#8fd4f8" strokeWidth={2} opacity={0.6} />
    <path d="M 460,685 Q 490,695 520,685" fill="none" stroke="#8fd4f8" strokeWidth={2} opacity={0.6} />
    {/* Small side river top-right */}
    <path d="M 750,90 C 780,130 760,170 790,200 C 820,230 810,260 840,280"
      fill="none" stroke="#8B6914" strokeWidth={22} strokeLinecap="round" opacity={0.5} />
    <path d="M 750,90 C 780,130 760,170 790,200 C 820,230 810,260 840,280"
      fill="none" stroke="url(#waterGrad)" strokeWidth={16} strokeLinecap="round" />
  </g>
);

// Dirt path network
const Paths = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Main path — left loop */}
    <path d="M 150,580 C 180,500 240,460 300,400 C 340,360 360,320 380,280 C 400,240 420,230 440,230"
      stroke="#c8a96e" strokeWidth={14} opacity={0.8} />
    {/* Center path going right */}
    <path d="M 440,230 C 480,220 520,210 570,200"
      stroke="#c8a96e" strokeWidth={14} opacity={0.8} />
    {/* Path to proppy */}
    <path d="M 570,200 C 600,190 630,185 680,175"
      stroke="#c8a96e" strokeWidth={14} opacity={0.8} />
    {/* Path right side — tavern */}
    <path d="M 680,175 C 750,185 800,230 870,300 C 920,350 960,400 1000,460"
      stroke="#c8a96e" strokeWidth={14} opacity={0.8} />
    {/* Path to ruins (mid-right) */}
    <path d="M 840,280 C 870,310 880,340 900,370"
      stroke="#c8a96e" strokeWidth={12} opacity={0.8} />
    {/* Path bottom — UTHM */}
    <path d="M 150,580 C 120,600 100,610 80,620"
      stroke="#c8a96e" strokeWidth={12} opacity={0.7} />
    {/* Path inner dirt lighter */}
    <path d="M 150,580 C 180,500 240,460 300,400 C 340,360 360,320 380,280 C 400,240 420,230 440,230"
      stroke="#e0c080" strokeWidth={6} opacity={0.4} />
    <path d="M 440,230 C 500,215 540,205 570,200 C 630,185 660,180 680,175"
      stroke="#e0c080" strokeWidth={6} opacity={0.4} />
    <path d="M 680,175 C 750,185 800,230 870,300 C 920,350 960,400 1000,460"
      stroke="#e0c080" strokeWidth={6} opacity={0.4} />
  </g>
);

// Pixel-art castle building
const Castle = ({ x, y, w = 60, h = 70, color = '#a09070', roofColor = '#c84040', label = '' }) => {
  const dark = '#605040';
  return (
    <g>
      {/* Shadow */}
      <ellipse cx={x} cy={y + 4} rx={w * 0.55} ry={8} fill="rgba(0,0,0,0.25)" />
      {/* Main body */}
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={color} />
      {/* Side shading */}
      <rect x={x + w / 2 - 8} y={y - h} width={8} height={h} fill={dark} opacity={0.4} />
      {/* Roof / dome */}
      <polygon points={`${x},${y - h - 28} ${x - w / 2 + 4},${y - h} ${x + w / 2 - 4},${y - h}`}
        fill={roofColor} />
      {/* Battlements */}
      {[-2, -1, 0, 1, 2].map(i => (
        <rect key={i} x={x + i * (w / 5) - 4} y={y - h - 4} width={7} height={10} fill={color} />
      ))}
      {/* Door */}
      <rect x={x - 7} y={y - 22} width={14} height={22} rx={6} fill={dark} />
      {/* Windows */}
      <rect x={x - w / 2 + 8} y={y - h + 18} width={10} height={10} rx={2} fill="#e8d4a0" opacity={0.8} />
      <rect x={x + w / 2 - 18} y={y - h + 18} width={10} height={10} rx={2} fill="#e8d4a0" opacity={0.8} />
      {/* Tower left */}
      <rect x={x - w / 2 - 10} y={y - h - 10} width={18} height={h + 10} fill={color} />
      <polygon points={`${x - w / 2 - 1},${y - h - 28} ${x - w / 2 - 10},${y - h - 10} ${x - w / 2 + 8},${y - h - 10}`}
        fill={roofColor} />
      {/* Tower right */}
      <rect x={x + w / 2 - 8} y={y - h - 10} width={18} height={h + 10} fill={color} />
      <polygon points={`${x + w / 2 + 1},${y - h - 28} ${x + w / 2 - 8},${y - h - 10} ${x + w / 2 + 10},${y - h - 10}`}
        fill={roofColor} />
    </g>
  );
};

const Tower = ({ x, y, color = '#909090', roofColor = '#4060c0' }) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={22} ry={7} fill="rgba(0,0,0,0.25)" />
    <rect x={x - 16} y={y - 90} width={32} height={94} fill={color} />
    <rect x={x + 8} y={y - 90} width={8} height={94} fill="#606060" opacity={0.4} />
    {[-1, 0, 1].map(i => (
      <rect key={i} x={x + i * 10 - 4} y={y - 94} width={8} height={10} fill={color} />
    ))}
    <polygon points={`${x},${y - 110} ${x - 16},${y - 90} ${x + 16},${y - 90}`} fill={roofColor} />
    <line x1={x} y1={y - 110} x2={x} y2={y - 126} stroke="#c84040" strokeWidth={2} />
    <polygon points={`${x},${y - 140} ${x},${y - 126} ${x + 14},${y - 133}`} fill="#c84040" />
    <rect x={x - 6} y={y - 70} width={10} height={12} rx={4} fill="#303030" />
    <rect x={x - 10} y={y - 55} width={8} height={8} rx={1} fill="#e8d4a0" opacity={0.7} />
    <rect x={x + 2} y={y - 55} width={8} height={8} rx={1} fill="#e8d4a0" opacity={0.7} />
  </g>
);

const Ruins = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={35} ry={10} fill="rgba(0,0,0,0.2)" />
    <rect x={x - 30} y={y - 40} width={20} height={44} fill="#7a7060" />
    <rect x={x - 30} y={y - 44} width={8} height={10} fill="#7a7060" />
    <rect x={x - 18} y={y - 44} width={8} height={10} fill="#7a7060" />
    <rect x={x + 10} y={y - 30} width={22} height={34} fill="#8a8070" />
    <rect x={x + 10} y={y - 34} width={22} height={8} fill="#7a7060" />
    <rect x={x - 10} y={y - 18} width={18} height={22} fill="#6a6050" />
    <rect x={x - 8} y={y - 18} width={6} height={14} rx={3} fill="#303030" />
    <polygon points={`${x - 5},${y - 60} ${x - 14},${y - 40} ${x + 4},${y - 40}`} fill="#8a8070" />
    <rect x={x + 32} y={y - 22} width={5} height={26} fill="#7a7060" />
    <rect x={x - 38} y={y - 10} width={8} height={14} fill="#6a6050" />
  </g>
);

const Tavern = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={30} ry={8} fill="rgba(0,0,0,0.25)" />
    <rect x={x - 28} y={y - 48} width={56} height={52} fill="#b07840" />
    <rect x={x + 16} y={y - 48} width={12} height={52} fill="#906030" opacity={0.5} />
    <polygon points={`${x},${y - 68} ${x - 30},${y - 48} ${x + 30},${y - 48}`} fill="#8B2020" />
    <rect x={x - 30} y={y - 52} width={60} height={6} fill="#a03030" />
    <rect x={x - 10} y={y - 30} width={20} height={34} rx={2} fill="#5c3010" />
    <rect x={x - 14} y={y - 38} width={12} height={14} rx={1} fill="#e8d090" opacity={0.8} />
    <rect x={x + 2} y={y - 38} width={12} height={14} rx={1} fill="#e8d090" opacity={0.8} />
    {/* Sign */}
    <rect x={x - 8} y={y - 72} width={16} height={10} fill="#c8a050" />
    <rect x={x - 6} y={y - 70} width={12} height={6} fill="#e8c060" opacity={0.6} />
  </g>
);

// Map buildings keyed by location type
const BUILDINGS = {
  castle:   (loc) => <Castle key={loc.id} x={loc.x} y={loc.y} color="#a09880" roofColor="#5080c0" w={70} h={75} />,
  city:     (loc) => <Castle key={loc.id} x={loc.x} y={loc.y} color="#909880" roofColor="#c05030" w={56} h={60} />,
  dungeon:  (loc) => <Castle key={loc.id} x={loc.x} y={loc.y} color="#707880" roofColor="#804040" w={52} h={55} />,
  tower:    (loc) => <Tower  key={loc.id} x={loc.x} y={loc.y} />,
  ruins:    (loc) => <Ruins  key={loc.id} x={loc.x} y={loc.y} />,
  building: (loc) => <Tavern key={loc.id} x={loc.x} y={loc.y} />,
};

// SVG pixel-art character sprite
const SvgCharacter = ({ x, y, isMoving, direction }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={2} rx={9} ry={3} fill="rgba(0,0,0,0.3)" />
      {/* Legs */}
      <motion.rect
        x={-7} y={10} width={6} height={10} rx={1} fill="#3a2a1a"
        animate={isMoving ? { y: [10, 12, 10] } : { y: 10 }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.rect
        x={1} y={10} width={6} height={10} rx={1} fill="#3a2a1a"
        animate={isMoving ? { y: [12, 10, 12] } : { y: 10 }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      {/* Boots */}
      <rect x={-8} y={19} width={8} height={4} rx={1} fill="#5c3d1e" />
      <rect x={0} y={19} width={8} height={4} rx={1} fill="#5c3d1e" />
      {/* Body */}
      <rect x={-8} y={-2} width={16} height={13} rx={1} fill="#eaeaea" />
      <rect x={-8} y={8} width={16} height={3} fill="#e94560" />
      {/* Arms */}
      <motion.rect
        x={-13} y={-1} width={6} height={10} rx={2} fill="#eaeaea"
        animate={isMoving ? { rotate: [-20, 20, -20] } : { rotate: 0 }}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{ transformOrigin: '-10px -1px' }}
      />
      <motion.rect
        x={7} y={-1} width={6} height={10} rx={2} fill="#eaeaea"
        animate={isMoving ? { rotate: [20, -20, 20] } : { rotate: 0 }}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{ transformOrigin: '10px -1px' }}
      />
      {/* Head */}
      <rect x={-7} y={-16} width={14} height={14} rx={2} fill="#f5c9a0" />
      {/* Hair */}
      <rect x={-7} y={-18} width={14} height={5} rx={2} fill="#2a1a0a" />
      {/* Eyes */}
      {direction === 'down' && <>
        <rect x={-4} y={-11} width={3} height={3} rx={1} fill="#1a1a2e" />
        <rect x={1} y={-11} width={3} height={3} rx={1} fill="#1a1a2e" />
      </>}
      {direction === 'up' && <>
        <rect x={-4} y={-9} width={8} height={2} fill="#1a1a2e" opacity={0.5} />
      </>}
      {direction === 'left' && <>
        <rect x={-5} y={-11} width={3} height={3} rx={1} fill="#1a1a2e" />
      </>}
      {direction === 'right' && <>
        <rect x={2} y={-11} width={3} height={3} rx={1} fill="#1a1a2e" />
      </>}
    </g>
  );
};

// Location hotspot + label overlay
const LocationHotspot = ({ loc, isHovered, isNearby, onHover, onLeave, onClick }) => {
  const active = isHovered || isNearby;
  const TYPE_ICON = { castle: '🏰', city: '🏙️', tower: '🗼', dungeon: '⚔️', ruins: '🏚️', building: '🍺' };
  const icon = TYPE_ICON[loc.type] ?? '📍';

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(loc)}
      onMouseLeave={onLeave}
      onClick={(e) => onClick(e, loc)}
    >
      {/* Invisible large hit area */}
      <circle cx={loc.x} cy={loc.y} r={48} fill="transparent" />

      {/* Glow ring */}
      <motion.circle
        cx={loc.x} cy={loc.y} r={32}
        fill="none"
        stroke={loc.color}
        strokeWidth={2}
        animate={active
          ? { opacity: [0.5, 1, 0.5], r: [30, 36, 30] }
          : { opacity: 0.3, r: 30 }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      {/* Ping ring */}
      {active && (
        <motion.circle
          cx={loc.x} cy={loc.y} r={30}
          fill="none" stroke={loc.color} strokeWidth={1.5}
          initial={{ opacity: 0.7, r: 30 }}
          animate={{ opacity: 0, r: 60 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Center dot */}
      <circle cx={loc.x} cy={loc.y} r={5} fill={loc.color}
        style={{ filter: active ? `drop-shadow(0 0 6px ${loc.color})` : 'none' }} />

      {/* Name tag — SVG foreignObject for pixel font */}
      <foreignObject
        x={loc.x - 70} y={loc.y - 58}
        width={140} height={30}
        style={{ pointerEvents: 'none', overflow: 'visible' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            background: 'rgba(26,26,46,0.92)',
            border: `1px solid ${active ? loc.color : 'rgba(255,255,255,0.2)'}`,
            boxShadow: active ? `0 0 10px ${loc.color}55` : 'none',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            opacity: active ? 1 : 0.65,
            transition: 'all 0.2s',
            transform: active ? 'translateY(-4px)' : 'none',
            width: 'fit-content',
            margin: '0 auto',
          }}
        >
          <span style={{ fontSize: 10 }}>{icon}</span>
          <span style={{
            fontSize: 7,
            color: '#fff',
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '0.05em',
          }}>{loc.name}</span>
        </div>
      </foreignObject>
    </g>
  );
};

// ─── Main WorldMap component ──────────────────────────────────────────────────

const WorldMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [nearbyLocation, setNearbyLocation] = useState(null);

  const { position, isMoving, direction, moveTo } = useCharacterMovement(500, 420);
  const { isOpen, content, typedText, isTyping, openDialogue, closeDialogue, skipTyping } = useDialogue();

  // Proximity check in SVG coords
  useEffect(() => {
    const PROX = 80;
    let closest = null, minD = Infinity;
    for (const loc of locations) {
      const dx = position.x - loc.x;
      const dy = position.y - loc.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < PROX && d < minD) { minD = d; closest = loc; }
    }
    setNearbyLocation(closest);
  }, [position]);

  const handleSvgClick = (e) => {
    if (isOpen) { isTyping ? skipTyping() : closeDialogue(); return; }
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    moveTo(svgP.x, svgP.y);
  };

  const handleLocationClick = (loc) => {
    if (isOpen) { isTyping ? skipTyping() : closeDialogue(); return; }
    moveTo(loc.x, loc.y + 60, () => openDialogue(loc.content));
  };

  // Sort locations by Y so buildings overlap correctly (painter's algo)
  const sortedLocs = [...locations].sort((a, b) => a.y - b.y);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#2a4a1a' }}>
      <StatsPanel />

      {/* Location name HUD */}
      <div className="fixed top-4 right-20 z-40 pointer-events-none">
        <motion.div
          key={nearbyLocation?.id ?? 'wild'}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="border-2 border-gold px-3 py-2 text-right"
          style={{ background: 'rgba(26,26,46,0.92)', boxShadow: '3px 3px 0 #000' }}
        >
          <div className="text-[7px] text-text/50 uppercase tracking-widest mb-1">Location</div>
          <div className="text-[9px] md:text-[11px] text-gold">
            {nearbyLocation ? nearbyLocation.name : '— Wilderness —'}
          </div>
        </motion.div>
      </div>

      {/* Full-screen SVG map */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
        onClick={handleSvgClick}
      >
        <Sky />

        {/* Sky background */}
        <rect width={VW} height={VH} fill="url(#skyGrad)" />

        {/* Mountains backdrop */}
        <Mountain x={180} y={148} w={180} h={100} />
        <Mountain x={340} y={138} w={140} h={85} />
        <Mountain x={490} y={145} w={120} h={75} />
        <Mountain x={640} y={132} w={160} h={95} />
        <Mountain x={820} y={140} w={140} h={80} />
        <Mountain x={980} y={148} w={170} h={90} />
        <Mountain x={1100} y={144} w={130} h={75} />

        {/* Main ground */}
        <ellipse cx={600} cy={500} rx={680} ry={420} fill="#4ab030" />
        <rect x={0} y={320} width={VW} height={VH - 320} fill="#4ab030" />

        {/* Ground variation patches */}
        <ellipse cx={200} cy={450} rx={180} ry={120} fill="#3a9820" opacity={0.5} />
        <ellipse cx={900} cy={500} rx={200} ry={140} fill="#3a9820" opacity={0.5} />
        <ellipse cx={550} cy={650} rx={220} ry={100} fill="#5ac040" opacity={0.4} />

        {/* Dirt paths */}
        <Paths />

        {/* River */}
        <River />

        {/* Forest clusters — behind buildings */}
        <TreeCluster cx={120} cy={350} count={8} spread={55} size={32} color="#2a8a18" />
        <TreeCluster cx={240} cy={300} count={7} spread={50} size={28} color="#3a9a20" />
        <TreeCluster cx={160} cy={480} count={9} spread={60} size={30} color="#2a8a18" />
        <TreeCluster cx={350} cy={420} count={6} spread={45} size={26} color="#3a9a20" />
        <TreeCluster cx={460} cy={360} count={7} spread={48} size={28} color="#2a8a18" />
        <TreeCluster cx={640} cy={300} count={6} spread={44} size={26} color="#3a9a20" />
        <TreeCluster cx={700} cy={420} count={8} spread={52} size={30} color="#2a8a18" />
        <TreeCluster cx={820} cy={380} count={7} spread={50} size={28} color="#3a9a20" />
        <TreeCluster cx={950} cy={320} count={6} spread={44} size={26} color="#2a8a18" />
        <TreeCluster cx={1060} cy={420} count={8} spread={55} size={30} color="#3a9a20" />
        <TreeCluster cx={1150} cy={350} count={7} spread={48} size={28} color="#2a8a18" />
        <TreeCluster cx={320} cy={600} count={8} spread={55} size={30} color="#2a8a18" />
        <TreeCluster cx={480} cy={580} count={6} spread={44} size={26} color="#3a9a20" />
        <TreeCluster cx={750} cy={560} count={9} spread={58} size={32} color="#2a8a18" />
        <TreeCluster cx={900} cy={600} count={7} spread={50} size={28} color="#3a9a20" />

        {/* Buildings (sorted by Y — painter's algorithm) */}
        {sortedLocs.map(loc => BUILDINGS[loc.type]?.(loc))}

        {/* Location hotspots */}
        {sortedLocs.map(loc => (
          <LocationHotspot
            key={loc.id}
            loc={loc}
            isHovered={hoveredLocation?.id === loc.id}
            isNearby={nearbyLocation?.id === loc.id}
            onHover={setHoveredLocation}
            onLeave={() => setHoveredLocation(null)}
            onClick={(e, l) => { e.stopPropagation(); handleLocationClick(l); }}
          />
        ))}

        {/* Character */}
        <SvgCharacter
          x={position.x}
          y={position.y}
          isMoving={isMoving}
          direction={direction}
        />

        {/* Animated clouds */}
        {[
          { cy: 60, r: 28, cx: 0 },
          { cy: 80, r: 20, cx: 200 },
          { cy: 50, r: 35, cx: 500 },
          { cy: 70, r: 22, cx: 900 },
        ].map((c, i) => (
          <motion.ellipse
            key={i}
            cx={c.cx} cy={c.cy} rx={c.r * 2.2} ry={c.r}
            fill="white" opacity={0.75}
            animate={{ cx: [c.cx, VW + 200] }}
            transition={{ duration: 40 + i * 12, repeat: Infinity, ease: 'linear', delay: i * 9 }}
          />
        ))}

        {/* Vignette overlay */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="40%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
        </defs>
        <rect width={VW} height={VH} fill="url(#vignette)" style={{ pointerEvents: 'none' }} />
      </svg>

      {/* Dialogue */}
      <DialogueBox
        isOpen={isOpen}
        content={content}
        typedText={typedText}
        isTyping={isTyping}
        onClose={closeDialogue}
        onSkip={skipTyping}
      />

      {isOpen && (
        <div className="absolute inset-0 bg-black/50 z-40 pointer-events-none" />
      )}
    </div>
  );
};

export default WorldMap;
