'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import ConsoleEasterEgg from '@/components/ConsoleEasterEgg';
import JumpscareModal from '@/components/JumpscareModal';
import StoryBriefing from '@/components/StoryBriefing';
import { Lock, Unlock, CheckCircle } from 'lucide-react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [pawPrints, setPawPrints] = useState<{id: number, x: number, delay: number, duration: number}[]>([]);
  const [showBriefing, setShowBriefing] = useState(false);
  
  const { 
    levels, 
    checkTimeLocks, 
    unlockLevel, 
    incrementFailedAttempts,
    unlockedLevels 
  } = useGameStore();
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkTimeLocks();
    
    // Paw prints animation setup
    const prints = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 1000,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10
    }));
    setPawPrints(prints);
  }, [checkTimeLocks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'canela') {
      unlockLevel(2); // Unlocks level 2 mechanically
      setShowBriefing(true); // Show briefing for Level 1 completion/Level 2 intro context
    } else {
      incrementFailedAttempts();
      const form = document.getElementById('login-form');
      form?.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
    }
  };

  const handleLevelClick = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    if (level.isLocked) {
      alert(`Mission Locked until ${level.unlockDate}`);
      return;
    }

    if (levelId === 1) {
      // Level 1 is the dashboard itself/password check, so we don't navigate away
      return; 
    }

    router.push(`/level-${levelId}`);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden">
      <ConsoleEasterEgg />
      <JumpscareModal />
      
      {/* Background with animated paw prints */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        {mounted && pawPrints.map((paw) => (
          <motion.div
            key={paw.id}
            initial={{ y: -100, x: paw.x, opacity: 0 }}
            animate={{ y: 1000, opacity: 1 }}
            transition={{ 
              duration: paw.duration, 
              repeat: Infinity,
              delay: paw.delay 
            }}
            className="absolute text-4xl"
          >
            🐾
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-neon-green mb-4 animate-glitch">
            MISSION CONTROL
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            AGENT: CLARA // STATUS: ACTIVE
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level 1: The Gatekeeper */}
          <div className="col-span-1 md:col-span-2 bg-white/5 border-2 border-neon-green p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-hot-pink">01. OPERACIÓN CANELA</h2>
              {unlockedLevels.includes(2) ? <CheckCircle className="text-neon-green" /> : <Unlock className="text-white" />}
            </div>
            
            {!unlockedLevels.includes(2) ? (
              <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-300 font-mono text-sm">AUTHENTICATION REQUIRED</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-black border border-gray-600 p-2 text-white font-mono focus:border-neon-green outline-none"
                    placeholder="PASSWORD"
                  />
                  <button type="submit" className="bg-neon-green text-black px-6 font-bold hover:bg-white transition-colors">
                    ACCESS
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-neon-green font-mono">
                ACCESS GRANTED. SYSTEM UNLOCKED.
              </div>
            )}
          </div>

          {/* Other Levels */}
          {levels.slice(1).map((level) => (
            <motion.div
              key={level.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleLevelClick(level.id)}
              className={`
                relative p-6 border-2 transition-all cursor-pointer
                ${level.isLocked 
                  ? 'border-gray-800 bg-gray-900/50 opacity-75 grayscale' 
                  : 'border-white bg-white/10 hover:border-hot-pink hover:shadow-[4px_4px_0px_0px_#ff0099]'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">0{level.id}. {level.title}</h2>
                {level.isLocked ? <Lock className="text-gray-500" /> : <Unlock className="text-neon-green" />}
              </div>
              
              <div className="font-mono text-sm text-gray-400">
                {level.isLocked ? (
                  <span>LOCKED UNTIL: {level.unlockDate}</span>
                ) : (
                  <span>STATUS: AVAILABLE</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Briefing for Level 1 Success */}
      <StoryBriefing 
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title="OPERACIÓN CANELA"
        briefing="Acceso concedido. Los sistemas de seguridad han sido neutralizados. Sin embargo, la señal está encriptada y fragmentada en diferentes frecuencias."
        realLifeClue="Tu primer regalo está donde guardas lo más preciado: tu ropa favorita."
      />
    </main>
  );
}
