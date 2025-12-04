'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import GiftReveal from '@/components/GiftReveal';
import StoryBriefing from '@/components/StoryBriefing';
import WordSearch from '@/components/WordSearch';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import ColdMission from '@/components/ColdMission';
import AnniversaryCode from '@/components/AnniversaryCode';
import LuckyPanel from '@/components/LuckyPanel';
import { Snowflake } from 'lucide-react';

export default function Level2() {
  const [showBriefing, setShowBriefing] = useState(true);
  const [phase1Complete, setPhase1Complete] = useState(false);
  const [phase2Complete, setPhase2Complete] = useState(false);
  const [phase3Complete, setPhase3Complete] = useState(false);
  const [phase4Complete, setPhase4Complete] = useState(false); // Code 02 solved
  const [panelSolved, setPanelSolved] = useState(false); // Lucky Panel solved
  
  const { unlockLevel, levels, checkTimeLocks } = useGameStore();
  const router = useRouter();
  const levelConfig = levels.find(l => l.id === 2);

  useEffect(() => {
    checkTimeLocks();
    if (levelConfig?.isLocked) {
      router.push('/');
    }
  }, [checkTimeLocks, levelConfig, router]);

  const handlePhase1Solved = () => setPhase1Complete(true);
  const handlePhase2Solved = () => setPhase2Complete(true);
  const handleMissionComplete = () => setPhase3Complete(true);

  // Code 02 solved -> Unlock Panel
  const handleCodeSolved = () => {
    setPhase4Complete(true);
  };

  // Panel solved -> Unlock Gift
  const handlePanelSolved = () => {
    setPanelSolved(true);
    unlockLevel(3);
  };

  if (!levelConfig) return null;

  const overallProgress = [phase1Complete, phase2Complete, phase3Complete, phase4Complete, panelSolved].filter(Boolean).length;
  const totalPhases = 5;

  return (
    <div className="relative min-h-screen w-full bg-warm-cream text-gray-800 overflow-hidden">

      
      {/* Christmas Snowflakes Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
      </div>

      <StoryBriefing 
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title={levelConfig.title}
        briefing={levelConfig.briefing}
        realLifeClue={levelConfig.realLifeClue}
      />

      <GiftReveal 
        isOpen={panelSolved}
        onClose={() => {}}
        giftName="CÁMARA DIGITAL"
        giftImage="/camera-real.png"
        description="¡Para capturar todos nuestros momentos juntos! 📸💕"
        nextLevelUrl="/level-3"
        onNextLevel={() => router.push('/')}
      />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Header with Christmas Theme */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Snowflake className="text-blue-500" size={48} />
            <h1 className="text-4xl md:text-6xl font-black text-blue-600 animate-pulse font-serif">
              OPERACIÓN BAJO CERO
            </h1>
          </div>
          <p className="text-gray-500 font-mono text-sm font-bold">
            🎄 NIVEL 2 // RECUPERA LAS PALABRAS CLAVE
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between text-xs text-gray-600 font-mono mb-2">
              <span>PROGRESO GENERAL</span>
              <span className="text-blue-600 font-bold">{overallProgress}/{totalPhases} FASES</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border-2 border-blue-300">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(overallProgress / totalPhases) * 100}%` }}
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 h-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </header>

        {/* Puzzle Phases */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Phase 1: Word Search (MUCHO) */}
          <WordSearch 
            onSolved={handlePhase1Solved}
            isCompleted={phase1Complete}
          />

          {/* Phase 2: Sliding Puzzle (FRIO) */}
          <SlidingPuzzle 
            onSolved={handlePhase2Solved}
            isUnlocked={phase1Complete}
            isCompleted={phase2Complete}
          />

          {/* Phase 3: Cold Mission (Fridge) */}
          <ColdMission 
            onMissionComplete={handleMissionComplete}
            isUnlocked={phase2Complete}
            isCompleted={phase3Complete}
          />

          {/* Phase 4: Final Code (02) -> Unlocks Panel */}
          {!phase4Complete && (
            <AnniversaryCode 
              onFinalSolved={handleCodeSolved}
              isUnlocked={phase3Complete}
            />
          )}

          {/* Phase 5: Lucky Panel (Finale) */}
          {phase4Complete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <LuckyPanel 
                onSolved={handlePanelSolved}
                isUnlocked={true}
              />
            </motion.div>
          )}
        </div>

        {/* Footer Hint */}
        {!panelSolved && (
          <footer className="mt-12 text-center">
            <p className="text-blue-400 font-mono text-xs italic">
              &quot;❄️ A veces la respuesta está donde menos te lo esperas... y hace frío. ☃️&quot;
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
