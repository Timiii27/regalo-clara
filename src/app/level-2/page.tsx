'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import TrapButton from '@/components/TrapButton';
import JumpscareModal from '@/components/JumpscareModal';
import GiftReveal from '@/components/GiftReveal';
import StoryBriefing from '@/components/StoryBriefing';

export default function Level2() {
  const [focusValue, setFocusValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  
  const { unlockLevel, levels, checkTimeLocks } = useGameStore();
  const router = useRouter();
  const levelConfig = levels.find(l => l.id === 2);

  // Target value is 85mm (represented as 85 on slider 0-100)
  const TARGET_VALUE = 85;
  const TOLERANCE = 5;

  useEffect(() => {
    checkTimeLocks();
    if (levelConfig?.isLocked) {
      router.push('/');
    }
  }, [checkTimeLocks, levelConfig, router]);

  useEffect(() => {
    if (Math.abs(focusValue - TARGET_VALUE) <= TOLERANCE) {
      setIsUnlocked(true);
      unlockLevel(3);
    } else {
      setIsUnlocked(false);
    }
  }, [focusValue, unlockLevel]);

  const blurAmount = Math.abs(focusValue - TARGET_VALUE) / 2;

  if (!levelConfig) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center p-4">
      <JumpscareModal />
      
      <StoryBriefing 
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title={levelConfig.title}
        briefing={levelConfig.briefing}
        realLifeClue={levelConfig.realLifeClue}
      />

      <GiftReveal 
        isOpen={isUnlocked}
        onClose={() => {}}
        giftName="INSTAX MINI 12"
        giftImage="https://placehold.co/600x400/ff0099/white?text=INSTAX+MINI"
        description="Para capturar todos nuestros momentos juntos (y a la perra)."
        nextLevelUrl="/level-3"
        onNextLevel={() => router.push('/level-3')}
      />
      
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-300 ease-out"
        style={{ 
          filter: `blur(${blurAmount}px)`,
          backgroundImage: 'url(https://placehold.co/1920x1080/1a1a1a/white?text=CLUE:+UNDER+THE+COUCH)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* UI Overlay */}
      <div className={`relative z-10 w-full max-w-md bg-black/50 backdrop-blur-sm p-8 border-2 border-neon-green neo-brutal-shadow transition-opacity duration-500 ${isUnlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h1 className="text-4xl font-black text-neon-green mb-8 text-center animate-pulse">
          LEVEL 2: PAPARAZZI
        </h1>

        <div className="space-y-6">
          <label className="block text-white font-mono text-sm uppercase tracking-widest">
            Focus Lens: {focusValue}mm
          </label>
          
          <input
            type="range"
            min="0"
            max="100"
            value={focusValue}
            onChange={(e) => setFocusValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
          />
          
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>0mm</span>
            <span>50mm</span>
            <span>100mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
