'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Image from 'next/image';

export default function JumpscareModal() {
  const { isJumpscareActive, resetJumpscare } = useGameStore();

  useEffect(() => {
    if (isJumpscareActive) {
      // Vibrate device if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 30, 100, 30, 100]);
      }

      // Play sound (placeholder)
      // const audio = new Audio('/sfx/scream.mp3');
      // audio.play();

      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        resetJumpscare();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isJumpscareActive, resetJumpscare]);

  return (
    <AnimatePresence>
      {isJumpscareActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <motion.div 
            className="relative w-full h-full animate-vibrate"
          >
             {/* Placeholder image from placehold.co */}
            <Image 
              src="https://placehold.co/1920x1080/red/black?text=NOPE+TRY+AGAIN" 
              alt="Jumpscare"
              fill
              className="object-cover"
              priority
            />
            <h1 className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white mix-blend-difference animate-glitch">
              TE VEO
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
