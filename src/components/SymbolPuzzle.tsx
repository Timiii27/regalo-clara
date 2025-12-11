"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Gift } from "lucide-react";

interface SymbolPuzzleProps {
  onComplete: (fragment: string) => void;
  phaseNumber: number;
}

export default function SymbolPuzzle({
  onComplete,
  phaseNumber,
}: SymbolPuzzleProps) {
  const [answer, setAnswer] = useState("");
  const [showLocationReveal, setShowLocationReveal] = useState(false);
  const [foundFragment, setFoundFragment] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const CORRECT_ANSWER = "17";

  const checkAnswer = () => {
    if (answer.trim() === CORRECT_ANSWER) {
      setShowLocationReveal(true);
    } else {
      setAttempts((prev) => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleFragmentSubmit = () => {
    if (foundFragment === "42") {
      onComplete("42");
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/90 backdrop-blur border-4 border-christmas-red rounded-2xl p-6 md:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-christmas-gold/30">
          <div className="bg-christmas-gold/20 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-christmas-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-christmas-red uppercase">
              Fase {phaseNumber}: Matemáticas Navideñas
            </h2>
            <p className="text-gray-500 text-xs">
              Descubre el valor de cada símbolo
            </p>
          </div>
        </div>

        {!showLocationReveal ? (
          <>
            {/* Problem Statement */}
            <div className="bg-christmas-red/5 rounded-xl p-4 mb-6 border border-christmas-red/20">
              <p className="text-gray-700 text-sm text-center">
                Cada símbolo navideño tiene un valor numérico. Usa las
                ecuaciones para descubrir el valor de cada uno.
              </p>
            </div>

            {/* Equations */}
            <div className="bg-gradient-to-br from-christmas-red/5 to-christmas-green/5 rounded-xl p-6 mb-6 space-y-4">
              {/* Equation 1 */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                <span>🎄</span>
                <span className="text-gray-400">+</span>
                <span>🎄</span>
                <span className="text-gray-400">+</span>
                <span>🎄</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-christmas-red bg-white px-3 py-1 rounded-lg shadow">
                  15
                </span>
              </div>

              {/* Equation 2 */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                <span>⭐</span>
                <span className="text-gray-400">+</span>
                <span>⭐</span>
                <span className="text-gray-400">+</span>
                <span>🎄</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-christmas-red bg-white px-3 py-1 rounded-lg shadow">
                  13
                </span>
              </div>

              {/* Equation 3 */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                <span>🎁</span>
                <span className="text-gray-400">+</span>
                <span>⭐</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-christmas-red bg-white px-3 py-1 rounded-lg shadow">
                  9
                </span>
              </div>

              {/* Equation 4 */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                <span>❄️</span>
                <span className="text-gray-400">+</span>
                <span>🎁</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-christmas-red bg-white px-3 py-1 rounded-lg shadow">
                  8
                </span>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-dashed border-christmas-gold/30 my-4"></div>

              {/* Final Question */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                <span>🎄</span>
                <span className="text-gray-400">+</span>
                <span>⭐</span>
                <span className="text-gray-400">+</span>
                <span>🎁</span>
                <span className="text-gray-400">+</span>
                <span>❄️</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-christmas-gold bg-christmas-red text-white px-3 py-1 rounded-lg shadow animate-pulse">
                  ?
                </span>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <input
                type="text"
                inputMode="numeric"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="Tu respuesta..."
                className={`w-full bg-white border-2 ${
                  isShaking
                    ? "border-red-500 animate-shake"
                    : "border-christmas-green/30"
                } rounded-xl p-4 text-center text-2xl font-bold text-christmas-red focus:border-christmas-green focus:outline-none transition-colors`}
              />
              {attempts > 0 && (
                <p className="text-red-500 text-xs text-center mt-2">
                  ❌ Incorrecto. Intentos: {attempts}
                </p>
              )}
            </div>

            <button
              onClick={checkAnswer}
              disabled={!answer.trim()}
              className="w-full bg-christmas-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all uppercase shadow-lg"
            >
              Comprobar Respuesta
            </button>
          </>
        ) : (
          /* Location Revealed */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-christmas-green/10 border-2 border-christmas-green rounded-xl p-6 text-center">
              <Gift className="w-12 h-12 mx-auto text-christmas-green mb-4" />
              <h3 className="text-xl font-bold text-christmas-green mb-2">
                ¡CORRECTO! 🎄
              </h3>
              <p className="text-gray-600 mb-4">
                La respuesta era{" "}
                <span className="font-bold text-christmas-red">17</span>
              </p>
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-christmas-gold">
                <p className="text-christmas-red font-bold text-lg mb-2">
                  📍 VE AL ARMARIO DEL PASILLO
                </p>
                <p className="text-gray-500 text-sm">
                  Busca dentro del armario. Hay un papel con un número de 2
                  dígitos.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-500 text-xs uppercase mb-3 text-center">
                Introduce el fragmento encontrado
              </p>
              <input
                type="text"
                maxLength={2}
                value={foundFragment}
                onChange={(e) =>
                  setFoundFragment(e.target.value.replace(/\D/g, ""))
                }
                placeholder="00"
                className={`w-full bg-white border-2 ${
                  isShaking ? "border-red-500 animate-shake" : "border-gray-200"
                } rounded-xl p-4 text-center text-3xl font-mono font-bold text-christmas-red focus:border-christmas-green focus:outline-none transition-colors`}
              />
            </div>

            <button
              onClick={handleFragmentSubmit}
              disabled={foundFragment.length !== 2}
              className="w-full bg-christmas-green hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="w-5 h-5" />
              Confirmar Fragmento
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
