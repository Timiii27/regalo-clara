'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface TrapButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function TrapButton({ children, onClick, className }: TrapButtonProps) {
  const controls = useAnimation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { incrementFailedAttempts } = useGameStore();

  const handleHover = async () => {
    // 80% chance to move
    if (Math.random() > 0.2) {
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 300;
      
      await controls.start({
        x,
        y,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      });
      
      incrementFailedAttempts();
    }
  };

  return (
    <motion.button
      animate={controls}
      onHoverStart={handleHover}
      onClick={onClick}
      className={`
        bg-hot-pink text-white font-bold py-3 px-6 
        neo-brutal-border neo-brutal-shadow
        hover:bg-neon-green hover:text-black hover:scale-110
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
