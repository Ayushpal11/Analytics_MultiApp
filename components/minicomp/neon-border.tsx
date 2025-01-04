import { motion } from 'framer-motion';

export const NeonBorder = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <div className="relative">
    <motion.div
      className={`absolute inset-0 rounded-lg neon-border`}
      style={{ '--neon-color': `var(--${color})` } as React.CSSProperties}
      animate={{
        boxShadow: [
          `0 0 10px var(--${color}), 0 0 20px var(--${color}), 0 0 30px var(--${color}), 0 0 40px var(--${color})`,
          `0 0 20px var(--${color}), 0 0 30px var(--${color}), 0 0 40px var(--${color}), 0 0 50px var(--${color})`,
          `0 0 10px var(--${color}), 0 0 20px var(--${color}), 0 0 30px var(--${color}), 0 0 40px var(--${color})`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
    <div className="relative glassmorphism p-6 rounded-lg">
      {children}
    </div>
  </div>
);

