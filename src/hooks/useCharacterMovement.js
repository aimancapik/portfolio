import { useState, useEffect, useRef } from 'react';

export const useCharacterMovement = (initialX = 100, initialY = 100) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [target, setTarget] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down'); // up, down, left, right
  const frameRef = useRef(null);

  useEffect(() => {
    if (!target) {
      setIsMoving(false);
      return;
    }

    setIsMoving(true);

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const speed = 0.05; // Adjust for movement speed

    const animate = () => {
      setPosition(prev => {
        const nextX = lerp(prev.x, target.x, speed);
        const nextY = lerp(prev.y, target.y, speed);
        
        // Calculate direction based on movement
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          setDirection(dx > 0 ? 'right' : 'left');
        } else {
          setDirection(dy > 0 ? 'down' : 'up');
        }

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
          setIsMoving(false);
          setTarget(null);
          // Reached destination
          if (target.onComplete) {
            target.onComplete();
          }
          return { x: target.x, y: target.y };
        }

        frameRef.current = requestAnimationFrame(animate);
        return { x: nextX, y: nextY };
      });
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  const moveTo = (x, y, onComplete) => {
    setTarget({ x, y, onComplete });
  };

  return { position, isMoving, direction, moveTo };
};
