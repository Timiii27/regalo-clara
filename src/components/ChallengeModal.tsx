'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Mic, Video, Send, Lock, Flame } from 'lucide-react';
import { useState } from 'react';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    id: number;
    title: string;
    description: string;
    type: 'photo' | 'text' | 'action';
    hint: string;
  };
  onComplete: (code: string) => void;
}

export default function ChallengeModal({ isOpen, onClose, challenge, onComplete }: ChallengeModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [step, setStep] = useState<'instruction' | 'verification'>('instruction');

  const handleSubmitCode = () => {
    if (inputCode.trim()) {
      onComplete(inputCode);
      setInputCode('');
      setStep('instruction');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-b from-red-900 via-red-800 to-black rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-500 overflow-hidden relative"
          >
            {/* Decoración Festiva */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors hover:rotate-90 duration-300"
            >
              <X size={24} />
            </button>

            <div className="p-8 text-center">
              
              {/* Icono Principal */}
              <div className="mb-6 relative inline-block">
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse" />
                {challenge.type === 'photo' && <Camera className="w-16 h-16 text-white relative z-10" />}
                {challenge.type === 'action' && challenge.id === 2 && <Mic className="w-16 h-16 text-white relative z-10" />}
                {challenge.type === 'action' && challenge.id !== 2 && <Video className="w-16 h-16 text-white relative z-10" />}
                <Flame className="w-6 h-6 text-yellow-400 absolute -top-1 -right-2 z-20 fill-yellow-400 animate-bounce" />
              </div>

              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-2 uppercase tracking-wide">
                {challenge.title}
              </h2>
              
              <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-6" />

              <div className="bg-black/40 rounded-xl p-5 mb-6 border border-white/10 text-left">
                <p className="text-gray-200 text-lg leading-snug">
                  {challenge.description}
                </p>
              </div>

              {step === 'instruction' ? (
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-yellow-200 font-medium flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Envía la prueba a Tihomir por WhatsApp
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('verification')}
                    className="w-full bg-white text-red-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg transform hover:scale-[1.02]"
                  >
                    Ya se la envié, pedir código
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-left space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Código de desbloqueo</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Ingresa el código que te dio..."
                        className="w-full bg-black/50 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('instruction')}
                      className="flex-1 bg-transparent border border-gray-600 text-gray-400 font-bold py-3 rounded-xl hover:text-white hover:border-white transition-all text-sm"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={!inputCode.trim()}
                      className="flex-[2] bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Desbloquear Pista
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}