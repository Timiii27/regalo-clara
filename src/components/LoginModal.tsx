'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Heart } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    onHint: () => void;
    isTyping: boolean;
}

export default function LoginModal({ isOpen, onClose, onSubmit, onHint, isTyping }: LoginModalProps) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-white rounded-xl card-shadow border-t-4 border-christmas-red relative overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-christmas-red text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                PARA: CLARA
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">¿Tienes la llave mágica?</h2>
                                <p className="text-gray-500 text-sm">Introduce la palabra secreta para abrir tu primer regalo.</p>
                            </div>

                            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center text-lg focus:border-christmas-green focus:ring-2 focus:ring-christmas-green/20 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Escribe aquí..."
                                        autoComplete="off"
                                        autoFocus
                                    />
                                    <Heart className="absolute right-4 top-1/2 -translate-y-1/2 text-christmas-red/20 w-5 h-5" />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-christmas-green text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        {isTyping ? 'ABRIENDO...' : 'ABRIR REGALO'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onHint}
                                        className="px-4 bg-christmas-gold/20 text-christmas-gold rounded-lg hover:bg-christmas-gold/30 transition-colors"
                                        title="Pedir una pista"
                                    >
                                        <Gift size={24} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
