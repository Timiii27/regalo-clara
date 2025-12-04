'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Tv, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyPanelProps {
  onSolved: () => void;
  isUnlocked: boolean;
}

export default function LuckyPanel({ onSolved, isUnlocked }: LuckyPanelProps) {
  const PHRASE = "SONRIE A LA CAMARA";
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<{ letter: string, text: string } | null>(null);

  // Alfabeto para el teclado
  const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
  const VOWELS = ['A', 'E', 'I', 'O', 'U'];

  const CHALLENGES: Record<string, string> = {
    'A': "💋 Dame un beso apasionado de 10 segundos",
    'E': "💆‍♀️ Hazme un masaje relajante en el cuello (1 min)",
    'I': "🔥 Desnudate y dejame tocar lo que quiera por 1 min",
    'O': "💃 Hazme un baile sexy para mí",
    'U': "🌙 Hazme una promesa atrevida para esta noche..."
  };

  const handleGuess = (letter: string) => {
    if (isSolved || guessedLetters.includes(letter)) return;

    // Si es vocal, lanzar reto
    if (VOWELS.includes(letter)) {
      setCurrentChallenge({ letter, text: CHALLENGES[letter] });
      setShowChallenge(true);
      return;
    }
    
    revealLetter(letter);
  };

  const revealLetter = (letter: string) => {
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    // Verificar si ha completado la frase (ignorando espacios)
    const normalizedPhrase = PHRASE.replace(/\s/g, '');
    const isComplete = normalizedPhrase.split('').every(char => newGuessed.includes(char));

    if (isComplete) {
      setIsSolved(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF0000', '#00FF00']
      });
      setTimeout(() => onSolved(), 2000);
    }
  };

  const completeChallenge = () => {
    if (currentChallenge) {
      revealLetter(currentChallenge.letter);
      setShowChallenge(false);
      setCurrentChallenge(null);
    }
  };

  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto bg-blue-900 p-4 md:p-8 rounded-xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
    >
      {/* Modal de Reto */}
      <AnimatePresence>
        {showChallenge && currentChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="bg-white rounded-xl p-6 max-w-md w-full text-center border-4 border-pink-500 shadow-2xl"
            >
              <div className="text-6xl mb-4">😈</div>
              <h3 className="text-2xl font-black text-pink-600 mb-2 uppercase">¡ALERTA DE RETO!</h3>
              <p className="text-gray-600 font-bold mb-4">Para comprar la vocal <span className="text-3xl text-blue-600 font-black">"{currentChallenge.letter}"</span> debes:</p>
              
              <div className="bg-pink-100 p-4 rounded-lg border-2 border-pink-300 mb-6 transform rotate-1">
                <p className="text-xl font-black text-pink-700 leading-tight">
                  {currentChallenge.text}
                </p>
              </div>

              <button
                onClick={completeChallenge}
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-black text-lg hover:bg-pink-600 transition-colors shadow-lg uppercase animate-pulse"
              >
                ¡Reto Cumplido! 🔥
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decoración estilo concurso */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-pulse" />
      
      <div className="flex items-center justify-center gap-3 mb-8 text-white">
        <Tv size={32} className="text-yellow-400" />
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-shadow-lg text-center">
          LA RULETA FINAL
        </h2>
        <Star size={32} className="text-yellow-400" />
      </div>

      {/* El Panel */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-10 px-2">
        {PHRASE.split(' ').map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-1 md:gap-2">
            {word.split('').map((char, charIndex) => {
              const isGuessed = guessedLetters.includes(char);
              return (
                <div
                  key={`${wordIndex}-${charIndex}`}
                  className="relative w-8 md:w-12 h-12 md:h-16 perspective-1000"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotateY: isGuessed ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-full h-full relative preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Parte trasera (Oculta) */}
                    <div className="absolute inset-0 bg-white border-2 border-blue-300 rounded shadow-lg backface-hidden flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-blue-100 rounded-sm" />
                    </div>

                    {/* Parte delantera (Letra Revelada) */}
                    <div 
                      className="absolute inset-0 bg-white border-2 border-blue-500 rounded shadow-lg flex items-center justify-center backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-2xl md:text-4xl font-black text-black">
                        {char}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Teclado */}
      {!isSolved && (
        <div className="bg-blue-800/50 p-4 rounded-xl border border-blue-700">
          <p className="text-center text-blue-200 mb-4 font-mono text-sm uppercase">
            Selecciona consonantes y <span className="text-pink-400 font-bold">vocales (con reto)</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET.map((letter) => {
              const isDisabled = guessedLetters.includes(letter);
              const isVowel = VOWELS.includes(letter);
              
              return (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isDisabled}
                  className={`w-8 h-10 md:w-10 md:h-12 rounded font-bold text-lg transition-all transform hover:scale-110 active:scale-95 ${
                    isDisabled
                      ? 'bg-blue-900/50 text-blue-500 cursor-not-allowed opacity-50'
                      : 'bg-yellow-400 text-blue-900 hover:bg-white shadow-lg border-b-4 border-yellow-600'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isSolved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-green-500 text-white px-8 py-4 rounded-full font-black text-2xl shadow-xl animate-bounce">
            ¡CORRECTO! 📸
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
