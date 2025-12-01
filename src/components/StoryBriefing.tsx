'use client';

import { motion, AnimatePresence } from 'framer-motion';
import TrapButton from './TrapButton';

interface StoryBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  briefing: string;
  realLifeClue: string;
}

export default function StoryBriefing({
  isOpen,
  onClose,
  title,
  briefing,
  realLifeClue
}: StoryBriefingProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-2xl bg-black border-2 border-neon-green p-8 neo-brutal-shadow"
          >
            <div className="absolute top-0 left-0 bg-neon-green text-black px-4 py-1 font-bold text-sm uppercase tracking-widest">
              TOP SECRET // SOLO OJOS
            </div>

            <h2 className="mt-8 text-4xl font-black text-white uppercase mb-6 border-b border-gray-800 pb-4">
              MISIÓN: <span className="text-neon-green">{title}</span>
            </h2>

            <div className="space-y-6 text-gray-300 font-mono leading-relaxed">
              <p className="text-lg">
                {briefing}
              </p>

              <div className="bg-white/5 p-4 border-l-4 border-hot-pink">
                <h3 className="text-hot-pink font-bold uppercase text-sm mb-2">Inteligencia Real:</h3>
                <p className="italic text-white">
                  "{realLifeClue}"
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <TrapButton
                onClick={onClose}
                className="!bg-white !text-black hover:!bg-neon-green hover:!text-black"
              >
                ACEPTAR MISIÓN
              </TrapButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
