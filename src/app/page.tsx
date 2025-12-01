'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import HintModal from '@/components/HintModal';
import LoginModal from '@/components/LoginModal';
import { Lock, Unlock, Heart, Star } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleShowHint = () => {
    setShowLogin(false); // Close login modal when showing hint
    setShowHint(true);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    setShowLogin(true); // Reopen login modal when closing hint
  };

  const {
    levels,
    checkTimeLocks,
    incrementFailedAttempts,
    unlockLevel
  } = useGameStore();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkTimeLocks();
  }, [checkTimeLocks]);

  const handleLoginSubmit = (password: string) => {
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsTyping(false);
      if (password.toLowerCase() === 'canela') {
        unlockLevel(1);
        router.push('/level-1');
      } else {
        incrementFailedAttempts();
        const form = document.getElementById('login-form');
        form?.classList.add('animate-shake');
        setTimeout(() => form?.classList.remove('animate-shake'), 500);
      }
    }, 800);
  };

  const handleLevelClick = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    // Level 1 always requires password
    if (levelId === 1) {
      setShowLogin(true);
      return;
    }

    // Other levels
    if (level.isLocked) {
      return;
    }

    router.push(`/level-${levelId}`);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-warm-cream text-gray-800 p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center justify-center">
      <HintModal isOpen={showHint} onClose={handleCloseHint} levelId={1} />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSubmit={handleLoginSubmit}
        onHint={handleShowHint}
        isTyping={isTyping}
      />

      {/* Snowflakes */}
      <div className="snowflake">❄</div>
      <div className="snowflake">❅</div>
      <div className="snowflake">❆</div>
      <div className="snowflake">❄</div>
      <div className="snowflake">❅</div>
      <div className="snowflake">❆</div>
      <div className="snowflake">❄</div>
      <div className="snowflake">❅</div>
      <div className="snowflake">❆</div>
      <div className="snowflake">❄</div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <header className="mb-12 text-center relative">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="inline-block"
          >
            <div className="flex justify-center mb-4">
              <Star className="text-christmas-gold w-12 h-12 fill-current animate-spin-slow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-christmas-red tracking-tight mb-2 font-serif text-shadow-sm">
              Regalos para Clara
            </h1>
            <p className="text-xl text-christmas-green italic">
              Una Navidad llena de sorpresas
            </p>
          </motion.div>
        </header>

        <div className="flex justify-center">
          {/* Advent Calendar */}
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {levels.map((level, index) => {
                // Level 1 is always "available" (not grayed out) but requires password
                const isLevel1 = level.id === 1;
                const isAvailable = isLevel1 || !level.isLocked;
                
                return (
                  <motion.div
                    key={level.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 * index }}
                    onClick={() => handleLevelClick(level.id)}
                    className={`
                      relative aspect-square rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                      ${isAvailable
                        ? 'bg-christmas-red text-white shadow-lg hover:scale-105 hover:rotate-1'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}
                    `}
                  >
                    {/* Ribbon for available levels */}
                    {isAvailable && (
                      <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-christmas-green/20 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-christmas-green/20 pointer-events-none"></div>
                      </>
                    )}

                    <div className="relative z-10">
                      <span className="text-5xl md:text-6xl font-bold mb-2 block">{level.id}</span>
                      <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
                        {isLevel1 ? 'DISPONIBLE' : level.isLocked ? 'CERRADO' : 'ABIERTO'}
                      </span>
                    </div>

                    {isAvailable ? (
                      <Unlock className="absolute top-4 right-4 w-6 h-6 opacity-80" />
                    ) : (
                      <Lock className="absolute top-4 right-4 w-6 h-6 opacity-50" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Hecho con mucho <Heart size={16} className="text-christmas-red fill-current animate-pulse" /> para ti
          </p>
        </footer>
      </div>
    </main>
  );
}
