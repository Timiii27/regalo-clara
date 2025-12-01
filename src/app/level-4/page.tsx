'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import GiftReveal from '@/components/GiftReveal';
import StoryBriefing from '@/components/StoryBriefing';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';

export default function Level4() {
  const [code, setCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);

  const { levels, checkTimeLocks } = useGameStore();
  const router = useRouter();
  const levelConfig = levels.find(l => l.id === 4);

  useEffect(() => {
    checkTimeLocks();
    if (levelConfig?.isLocked) {
      router.push('/');
    }
  }, [checkTimeLocks, levelConfig, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '1225') {
      setIsSuccess(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  if (!levelConfig) return null;

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4 font-mono text-white">
      <StoryBriefing 
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title={levelConfig.title}
        briefing={levelConfig.briefing}
        realLifeClue={levelConfig.realLifeClue}
      />

      <GiftReveal 
        isOpen={isSuccess}
        onClose={() => {}}
        giftName="VIAJE A PARÍS"
        giftImage="https://placehold.co/600x400/00f0ff/black?text=PARIS+TICKET"
        description="Prepara las maletas porque nos vamos el 25 de Diciembre. Joyeux Noël!"
      />

      {!isSuccess && (
        <div className="w-full max-w-2xl bg-white text-black p-8 rounded-lg shadow-2xl border-4 border-yellow-400">
          <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-bold uppercase tracking-tighter">Gate 12-25</h1>
            <div className="text-xl animate-pulse text-red-600 font-bold">BOARDING NOW</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-100 p-6 rounded border-2 border-dashed border-gray-400">
              <label className="block text-sm font-bold uppercase mb-2">Flight Code</label>
              <input 
                type="text" 
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-4xl text-center tracking-[1em] p-4 uppercase font-bold border-2 border-black focus:border-yellow-400 outline-none"
                placeholder="____"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 text-xl uppercase hover:bg-blue-700 transition-colors border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
            >
              Check In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
