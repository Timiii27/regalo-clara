'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import JumpscareModal from '@/components/JumpscareModal';
import GiftReveal from '@/components/GiftReveal';
import StoryBriefing from '@/components/StoryBriefing';

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const ScrambleText = ({ text, isRevealed }: { text: string, isRevealed: boolean }) => {
  const [display, setDisplay] = useState(text);
  
  useEffect(() => {
    if (isRevealed) {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join('')
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
      return () => clearInterval(interval);
    } else {
      // Keep scrambling if not fully revealed
      const interval = setInterval(() => {
        setDisplay(
          text.split('').map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join('')
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRevealed, text]);

  return <span>{display}</span>;
};

export default function Level3() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFlickering, setIsFlickering] = useState(false);
  const [foundClue, setFoundClue] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [showBriefing, setShowBriefing] = useState(true);

  const { unlockLevel, levels, checkTimeLocks } = useGameStore();
  const router = useRouter();
  const clueRef = useRef<HTMLButtonElement>(null);
  const levelConfig = levels.find(l => l.id === 3);

  useEffect(() => {
    checkTimeLocks();
    if (levelConfig?.isLocked) {
      router.push('/');
    }
  }, [checkTimeLocks, levelConfig, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Random flickering effect
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 100 + Math.random() * 200);
      }
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(flickerInterval);
    };
  }, []);

  // Check if mouse is over clue to decrypt
  useEffect(() => {
    if (!clueRef.current) return;
    
    const rect = clueRef.current.getBoundingClientRect();
    const isOver = 
      mousePosition.x >= rect.left && 
      mousePosition.x <= rect.right && 
      mousePosition.y >= rect.top && 
      mousePosition.y <= rect.bottom;

    if (isOver) {
      const timer = setInterval(() => {
        setHoverTime(prev => Math.min(prev + 10, 100));
      }, 100);
      return () => clearInterval(timer);
    } else {
      setHoverTime(0);
    }
  }, [mousePosition]);

  const handleFoundClue = () => {
    if (hoverTime >= 100) {
      setFoundClue(true);
      unlockLevel(4);
    }
  };

  if (!levelConfig) return null;

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden cursor-none">
      <JumpscareModal />
      
      <StoryBriefing 
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title={levelConfig.title}
        briefing={levelConfig.briefing}
        realLifeClue={levelConfig.realLifeClue}
      />

      <GiftReveal 
        isOpen={foundClue}
        onClose={() => {}}
        giftName="ALMOHADA VISCOELÁSTICA"
        giftImage="https://placehold.co/600x400/ccff00/black?text=ALMOHADA"
        description="Para que sueñes con los angelitos (o conmigo)."
        nextLevelUrl="/level-4"
        onNextLevel={() => router.push('/level-4')}
      />

      {/* Flashlight Effect */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none bg-black transition-opacity duration-75"
        style={{
          background: `radial-gradient(circle ${isFlickering ? 130 : 150}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`,
          opacity: isFlickering ? 0.8 : 1
        }}
      />

      {/* Hidden Content */}
      <div className="absolute inset-0 z-10 flex flex-wrap items-center justify-center p-10 font-mono text-gray-800 select-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="m-4 text-xl opacity-20 rotate-12">
            <ScrambleText text="sueños raros..." isRevealed={false} />
          </span>
        ))}
        
        {/* Real Clue */}
        <button 
          ref={clueRef}
          onClick={handleFoundClue}
          className="absolute top-1/3 left-1/4 text-white font-bold text-2xl transition-colors cursor-pointer z-30 p-4 border border-transparent hover:border-neon-green"
          style={{ pointerEvents: 'auto' }}
        >
          <ScrambleText 
            text="LA ALMOHADA ESTÁ EN EL ARMARIO" 
            isRevealed={hoverTime >= 100} 
          />
        </button>

        {/* Decoys */}
        <span className="absolute top-2/3 right-1/4 text-red-900 text-xl">
          <ScrambleText text="no mires atrás" isRevealed={false} />
        </span>
      </div>

      {/* Instructions */}
      <div className="fixed top-4 left-4 z-30 text-white/50 font-mono text-sm pointer-events-none">
        LEVEL 3: DREAM WORLD <br/>
        (Hold light to decrypt)
      </div>
    </div>
  );
}
