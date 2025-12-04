'use client';

import { motion, AnimatePresence } from 'framer-motion';

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
            className="relative w-full max-w-2xl bg-white border-4 border-christmas-red p-8 rounded-lg shadow-2xl"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-christmas-red text-white px-6 py-2 font-bold text-sm uppercase tracking-widest rounded-full shadow-md">
              🎄 TOP SECRET 🎄
            </div>

            <h2 className="mt-8 text-4xl font-black text-christmas-red uppercase mb-6 border-b-4 border-christmas-gold pb-4 font-serif">
              MISIÓN: <span className="text-christmas-green">{title}</span>
            </h2>

            <div className="space-y-6 text-gray-700 font-mono leading-relaxed">
              <p className="text-lg">
                {briefing}
              </p>

              <div className="bg-christmas-green/10 p-4 border-l-4 border-christmas-green rounded">
                <h3 className="text-christmas-green font-bold uppercase text-sm mb-2">🎁 Inteligencia Real:</h3>
                <p className="italic text-gray-800 font-semibold">
                  "{realLifeClue}"
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="bg-christmas-red text-white px-8 py-3 font-black text-lg rounded-lg hover:bg-christmas-green transition-colors shadow-md uppercase"
              >
                ✓ ACEPTAR MISIÓN
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
