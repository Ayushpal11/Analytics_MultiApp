'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [randomPositions, setRandomPositions] = useState<Array<{ x: number; y: number; scale: number }>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const positions = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      }));

      setRandomPositions(positions);
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900"
      />
      {randomPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white dark:bg-gray-800 opacity-20"
          initial={{ x: pos.x, y: pos.y, scale: pos.scale }}
          animate={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            scale: Math.random() * 0.5 + 0.5,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
          }}
        />
      ))}
    </div>
  );
}
