'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import { Snowflake, Heart, Star, Gift, Moon, Clock, Lightbulb, Flame, PartyPopper, Key } from 'lucide-react';
import GiftReveal from '@/components/GiftReveal';
import ChallengeModal from '@/components/ChallengeModal';

type Phase = 
  | 'intro' 
  | 'riddle1' 
  | 'riddle2' 
  | 'riddle3' 
  | 'riddle4' 
  | 'masterKey' // Nueva fase final online
  | 'final';

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: 'photo' | 'text' | 'action';
  hint: string;
}

// Efecto de nieve
const Snowfall = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -10, x: Math.random() * window.innerWidth }}
          animate={{ 
            y: window.innerHeight + 10, 
            x: Math.random() * window.innerWidth 
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute text-white/20 text-xs"
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

export default function Level1() {
  const [phase, setPhase] = useState<Phase>('intro');
  
  // Respuestas
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState(''); // Nueva respuesta (Luna)
  const [answer4, setAnswer4] = useState('');
  const [finalKey, setFinalKey] = useState(''); // Para la llave maestra final
  
  const [showGift, setShowGift] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintsUnlocked, setHintsUnlocked] = useState<number[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [attempts, setAttempts] = useState(0);

  const { unlockLevel, checkTimeLocks } = useGameStore();
  const router = useRouter();

  // --- RETOS PICANTES Y PISTAS CORREGIDAS ---
  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Reto 1: Labios Tentadores 💋',
      description: 'Para la primera pista, mándame una foto de tus labios mordiéndolos o lanzando un beso. Haz que quiera estar ahí.',
      type: 'photo',
      // Pista para Adivinanza 1 (Almohada)
      hint: 'Pista 1: "Es algo sobre lo que pones tu cabeza cada noche para descansar..."'
    },
    {
      id: 2,
      title: 'Reto 2: Susurro Prohibido 🔥',
      description: 'Graba un audio susurrando qué te gustaría hacerme si estuviera ahí contigo. Si me convence, te doy el código.',
      type: 'action',
      // Pista para Adivinanza 2 (Sueños)
      hint: 'Pista 2: "Es lo que pasa en tu mente cuando duermes profundamente..."'
    },
    {
      id: 3,
      title: 'Reto 3: Foto Atrevida 📸',
      description: 'Quiero ver un poco de piel. Un hombro descubierto, tu cuello, o un poco de escote. Algo elegante pero sexy.',
      type: 'photo',
      // Pista para Adivinanza 3 (Luna) - NUEVA
      hint: 'Pista 3: "Sale todas las noches, es blanca y brilla en el cielo..."'
    },
    {
      id: 4,
      title: 'Reto 4: Pasarela Privada 💃',
      description: 'Graba un video de 5 segundos bailando lento o moviendo las caderas. Solo para mis ojos.',
      type: 'action',
      // Pista para Adivinanza 4 (Siempre)
      hint: 'Pista 4: "Es una palabra que significa que no tiene fin. Como lo nuestro."'
    }
  ];

  useEffect(() => {
    checkTimeLocks();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [checkTimeLocks, startTime]);

  const phases: Phase[] = ['intro', 'riddle1', 'riddle2', 'riddle3', 'riddle4', 'masterKey', 'final'];
  
  useEffect(() => {
    const currentIndex = phases.indexOf(phase);
    setProgress((currentIndex / (phases.length - 1)) * 100);
  }, [phase]);

  const requestHint = (riddleNumber: number) => {
    const challenge = challenges[riddleNumber - 1];
    if (challenge && !hintsUnlocked.includes(riddleNumber)) {
      setCurrentChallenge(challenge);
      setShowChallenge(true);
    }
  };

  const handleChallengeComplete = (code: string) => {
    // Códigos genéricos o específicos
    const validCodes = ['BESO_RICO', 'VOZ_SEXY', 'CUERPO_10', 'BAILE_HOT', 'AMOR', 'TIHOMIR'];
    
    if (validCodes.some(c => code.toUpperCase().includes(c)) || code.length > 3) {
      if (currentChallenge) {
        setHintsUnlocked([...hintsUnlocked, currentChallenge.id]);
        setShowChallenge(false);
        setCurrentChallenge(null);
      }
    } else {
      alert('Código incorrecto.');
    }
  };

  // Validación de Adivinanzas
  const validateRiddle = (answer: string, correctWords: string[], nextPhase: Phase, inputId: string) => {
    const normalized = answer.toLowerCase().trim();
    if (correctWords.some(word => normalized.includes(word))) {
      setPhase(nextPhase);
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      const input = document.getElementById(inputId);
      input?.classList.add('animate-shake', 'border-red-500');
      setTimeout(() => input?.classList.remove('animate-shake', 'border-red-500'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900 via-red-950 to-black text-white relative overflow-hidden font-sans">
      <Snowfall />
      
      {/* Barra de Progreso */}
      <div className="fixed top-0 left-0 right-0 h-3 bg-black/40 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-6 md:p-8 pt-24">
        <AnimatePresence mode="wait">
          
          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <Gift className="w-24 h-24 mx-auto text-yellow-500 animate-bounce" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-600">
                Regalo Digital
              </h1>
              
              <div className="bg-red-950/60 backdrop-blur-xl border border-red-500/30 p-8 rounded-2xl shadow-2xl space-y-6">
                <p className="text-xl text-yellow-100 italic">
                  "Aunque estemos lejos, mi regalo te llegará..."
                </p>
                <p className="text-gray-200">
                  He preparado 4 adivinanzas para ti. 
                  <br/><br/>
                  Si resuelves todo, desbloquearás tu regalo en esta pantalla.
                </p>
                <div className="flex items-start gap-3 bg-black/20 p-4 rounded-lg text-left">
                  <Flame className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                  <p className="text-sm text-gray-300">
                    <strong className="text-orange-400 block mb-1">Nota Picante:</strong>
                    Si te atascas, te daré pistas... pero tendrás que pagarme con fotos o audios 😉.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPhase('riddle1')}
                className="px-8 py-4 text-lg font-bold text-red-950 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                Comenzar <Star className="inline ml-2 w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ACERTIJOS */}
          {['riddle1', 'riddle2', 'riddle3', 'riddle4'].includes(phase) && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="bg-red-950/80 backdrop-blur-xl border-2 border-yellow-600/30 p-8 rounded-3xl shadow-xl">
                
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-yellow-100 uppercase tracking-wider">
                    Nivel {phase.replace('riddle', '')}
                  </h2>
                  <button
                    onClick={() => requestHint(parseInt(phase.replace('riddle', '')))}
                    className="flex items-center gap-2 bg-black/40 hover:bg-orange-600/20 border border-orange-500/50 text-orange-300 px-4 py-2 rounded-full transition-all"
                  >
                    <Flame className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Pedir Pista</span>
                  </button>
                </div>

                <div className="bg-black/20 p-6 rounded-xl mb-8 relative overflow-hidden">
                   <p className="text-xl text-gray-100 leading-relaxed font-serif italic text-center">
                    {phase === 'riddle1' && '"Tengo piel pero no soy humana. Soporto el peso de tus pensamientos cada noche. Si me golpeas, no me quejo; si me abrazas, me hundo."'}
                    
                    {phase === 'riddle2' && '"Viajas allí cuando cierras los ojos. Es un reino sin fronteras donde el tiempo no existe. ¿Cómo se llama ese lugar?"'}
                    
                    {phase === 'riddle3' && '"No tengo luz propia, pero brillo en la oscuridad. Te vigilo desde el cielo cuando él no puede. ¿Qué soy?"'}
                    
                    {phase === 'riddle4' && '"No es por una noche, ni por una semana. Es una promesa de que estaré contigo... ¿Por cuánto tiempo?"'}
                  </p>
                </div>

                {/* Zona de Pista */}
                <AnimatePresence>
                  {hintsUnlocked.includes(parseInt(phase.replace('riddle', ''))) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex gap-3"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />
                      <p className="text-yellow-100 text-sm italic">
                        {challenges[parseInt(phase.replace('riddle', '')) - 1].hint.split(': "')[1].replace('"', '')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <input
                    id={`answer${phase.replace('riddle', '')}`}
                    type="text"
                    value={
                      phase === 'riddle1' ? answer1 : 
                      phase === 'riddle2' ? answer2 : 
                      phase === 'riddle3' ? answer3 : answer4
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if(phase==='riddle1') setAnswer1(val);
                      if(phase==='riddle2') setAnswer2(val);
                      if(phase==='riddle3') setAnswer3(val);
                      if(phase==='riddle4') setAnswer4(val);
                    }}
                    placeholder="Tu respuesta..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-yellow-500 focus:outline-none text-center"
                  />
                  <button
                    onClick={() => {
                      if(phase==='riddle1') validateRiddle(answer1, ['almohada', 'cojín', 'pillow'], 'riddle2', 'answer1');
                      if(phase==='riddle2') validateRiddle(answer2, ['sueño', 'sueños', 'dream'], 'riddle3', 'answer2');
                      // NUEVA RESPUESTA PARA LA LUNA
                      if(phase==='riddle3') validateRiddle(answer3, ['luna', 'moon', 'estrella'], 'riddle4', 'answer3');
                      // DEL 4 PASAMOS A LA LLAVE MAESTRA
                      if(phase==='riddle4') validateRiddle(answer4, ['siempre', 'eternidad', 'todas', 'vida', 'forever'], 'masterKey', 'answer4');
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg"
                  >
                    Verificar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* MASTER KEY (Reemplaza la búsqueda física) */}
          {phase === 'masterKey' && (
            <motion.div
              key="masterKey"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-b from-purple-900 to-black border-4 border-yellow-500 p-8 rounded-3xl shadow-2xl relative text-center">
                <Key className="w-20 h-20 mx-auto text-yellow-400 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black text-white uppercase mb-2">La Llave Maestra</h2>
                <p className="text-purple-200 mb-6">
                  Has resuelto todos los acertijos. El regalo está listo para ser revelado en tu pantalla.
                </p>
                
                <div className="bg-white/10 p-6 rounded-xl mb-6">
                  <p className="text-lg text-white font-bold mb-2">Instrucción Final:</p>
                  <p className="text-gray-300">
                    Escribe a Tihomir ahora mismo: <br/>
                    <span className="text-yellow-400 italic">"Amor, estoy lista para mi regalo. Dame la llave."</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-4">
                    Cuando él te responda con la Clave Secreta, escríbela abajo.
                  </p>
                </div>

                <input
                  id="final-input"
                  type="text"
                  value={finalKey}
                  onChange={(e) => setFinalKey(e.target.value)}
                  placeholder="CLAVE SECRETA..."
                  className="w-full bg-white text-purple-900 font-bold text-2xl text-center py-4 rounded-xl border-4 border-dashed border-purple-500 mb-4 uppercase"
                />
                
                <button
                  onClick={() => {
                     // Puedes cambiar 'AMOR' por la palabra que quieras que sea la clave
                     if(finalKey.toUpperCase().includes('AMOR') || finalKey.toUpperCase().includes('TE QUIERO') || finalKey.toUpperCase().includes('REGALO')) {
                        setPhase('final');
                        setTimeout(() => {
                          setShowGift(true);
                          unlockLevel(2);
                        }, 1000);
                     } else {
                        const input = document.getElementById('final-input');
                        input?.classList.add('animate-shake', 'border-red-500');
                        setTimeout(() => input?.classList.remove('animate-shake', 'border-red-500'), 500);
                     }
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-purple-950 font-black py-4 rounded-xl shadow-lg"
                >
                  ABRIR REGALO 🎁
                </button>
              </div>
            </motion.div>
          )}

          {/* FINAL ANIMATION */}
          {phase === 'final' && (
            <motion.div className="text-center pt-20">
               <PartyPopper className="w-32 h-32 mx-auto text-yellow-400 mb-6 animate-bounce" />
               <h2 className="text-4xl font-bold text-white mb-4">¡Abriendo...!</h2>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* MODAL RETO */}
      {currentChallenge && (
        <ChallengeModal
          isOpen={showChallenge}
          onClose={() => {
            setShowChallenge(false);
            setCurrentChallenge(null);
          }}
          challenge={currentChallenge}
          onComplete={handleChallengeComplete}
        />
      )}

      {/* GIFT REVEAL */}
      <GiftReveal
        isOpen={showGift}
        onClose={() => {}} 
        giftName="VALE POR: UNA ALMOHADA DE SUEÑOS JUNTOS"
        giftImage="/regalo1.jpg" 
        description="Este es un vale digital. La próxima vez que nos veamos, o te llegará por correo, tendrás esta almohada para que me abraces todas las noches, el lado lo eliges tú. Te amo. ❤️"
        nextLevelUrl="/"
        onNextLevel={() => router.push('/')}
      />
    </div>
  );
}