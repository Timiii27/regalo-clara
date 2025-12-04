'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';

interface AnniversaryCodeProps {
  onFinalSolved: () => void;
  isUnlocked: boolean;
}

export default function AnniversaryCode({ onFinalSolved, isUnlocked }: AnniversaryCodeProps) {
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Solución: 02 (Febrero)
  const FINAL_ANSWER = '02';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === FINAL_ANSWER) {
      onFinalSolved();
    } else {
      setAttempts(prev => prev + 1);
      setInput('');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg opacity-60">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-gray-400" size={32} />
          <h3 className="text-2xl font-black text-gray-500 font-serif">FASE FINAL: CÓDIGO DE SEGURIDAD</h3>
        </div>
        <p className="text-gray-500 font-mono text-sm">
          🔒 Completa la misión de campo para desbloquear...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="christmas-card bg-white p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Heart className="text-christmas-red" size={32} />
        <h3 className="text-2xl font-black text-christmas-red font-serif">FASE FINAL: CÓDIGO DE SEGURIDAD</h3>
      </div>

      <div className="space-y-6 text-center">
        <p className="text-gray-700 font-mono text-lg">
          Introduce el número que falta para completar la secuencia especial:
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-xl md:text-3xl font-black font-mono text-gray-400 mb-6">
          <div className="bg-gray-100 px-4 py-2 rounded border-2 border-dashed border-gray-300">
            PISTA 1
          </div>
          <span className="text-gray-300">/</span>
          <div className="text-christmas-red animate-pulse">
            ??
          </div>
          <span className="text-gray-300">/</span>
          <div className="bg-gray-100 px-4 py-2 rounded border-2 border-dashed border-gray-300">
            PISTA 2
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white border-4 border-christmas-gold p-4 text-center text-4xl font-black text-gray-800 outline-none rounded-xl focus:border-christmas-red transition-colors"
            placeholder="??"
            maxLength={2}
            autoFocus
          />
          
          <button
            type="submit"
            className="mt-4 w-full bg-christmas-red text-white py-3 font-black text-lg rounded-lg hover:bg-christmas-green transition-colors shadow-md"
          >
            DESBLOQUEAR REGALO
          </button>
        </form>

        {attempts > 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 font-mono text-sm font-bold"
          >
            ❌ Código incorrecto. Pista: Es un mes muy especial...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
