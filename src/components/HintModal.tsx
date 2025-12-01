'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HintModalProps {
    isOpen: boolean;
    onClose: () => void;
    levelId: number;
}

export default function HintModal({ isOpen, onClose, levelId }: HintModalProps) {
    const [code, setCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Generate a random "security code"
            const randomCode = `SEC-${levelId}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            setCode(randomCode);
        }
    }, [isOpen, levelId]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-white rounded-xl shadow-2xl border-t-4 border-christmas-red relative overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-christmas-red text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                PISTA MÁGICA
                            </div>

                            <div className="flex items-center justify-center gap-3 mb-6 mt-4">
                                <Gift size={32} className="text-christmas-gold" />
                                <h2 className="text-2xl font-bold text-gray-800 tracking-wider font-serif">¿NECESITAS UNA PISTA?</h2>
                            </div>

                            <div className="space-y-6 font-sans">
                                <div className="bg-warm-cream rounded-lg p-4 text-gray-800 border-2 border-christmas-green/20">
                                    <p className="text-sm mb-2 font-bold text-christmas-red">¡HO HO HO!</p>
                                    <p className="text-sm leading-relaxed">
                                        Parece que necesitas un poco de ayuda mágica. Para desbloquear esta pista, debes pedirle el código secreto a tu Elfo Jefe (Tihomir).
                                    </p>
                                </div>

                                <div className="text-center py-6 bg-christmas-red/5 border-2 border-dashed border-christmas-red rounded-xl relative">
                                    <p className="text-xs text-christmas-red font-bold absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3">CÓDIGO MÁGICO</p>
                                    <p className="text-3xl md:text-4xl font-black text-christmas-red tracking-wider mt-2">
                                        {code || '...'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <Heart size={14} className="text-christmas-red fill-current" />
                                    <span>Hecho con amor</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
