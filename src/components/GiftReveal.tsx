'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GiftRevealProps {
  isOpen: boolean;
  onClose: () => void;
  giftName: string;
  giftImage: string;
  description: string;
  nextLevelUrl?: string;
  onNextLevel?: () => void;
}

export default function GiftReveal({ 
  isOpen, 
  onClose, 
  giftName, 
  giftImage, 
  description,
  nextLevelUrl,
  onNextLevel
}: GiftRevealProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            className="relative w-full max-w-lg bg-white p-2 neo-brutal-shadow border-4 border-neon-green"
          >
            <div className="bg-hot-pink p-4 text-center border-b-4 border-black">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter animate-pulse">
                GIFT UNLOCKED!
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 h-[600px] p-2">
                <Image
                  src={giftImage}
                  alt={giftName}
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-black uppercase">{giftName}</h3>
                <p className="text-gray-600 font-mono text-sm">{description}</p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={onNextLevel || onClose}
                  className="w-full bg-christmas-green text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {nextLevelUrl ? 'SIGUIENTE NIVEL →' : 'CONTINUAR'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
