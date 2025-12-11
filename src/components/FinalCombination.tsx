"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Gift, Star } from "lucide-react";

interface FinalCombinationProps {
  fragments: string[];
  onComplete: () => void;
}

export default function FinalCombination({
  fragments,
  onComplete,
}: FinalCombinationProps) {
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const CORRECT_CODE = "17428956";

  useEffect(() => {
    if (fragments.length === 4) {
      const fullCode = fragments.join("").split("");
      setCode(fullCode);
    }
  }, [fragments]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 7) {
      const nextInput = document.getElementById(`final-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`final-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const checkCode = () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 8) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (enteredCode === CORRECT_CODE) {
      setIsUnlocking(true);
      setTimeout(() => {
        onComplete();
      }, 2500);
    } else {
      setAttempts((prev) => prev + 1);
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
      <div className="bg-white/90 backdrop-blur border-4 border-christmas-gold rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Particles when unlocking */}
        {isUnlocking && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                }}
              >
                <Star className="w-6 h-6 text-christmas-gold fill-christmas-gold" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-christmas-gold/30">
          <motion.div
            className="bg-christmas-gold/20 p-2 rounded-xl"
            animate={isUnlocking ? { rotate: 360, scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1.5 }}
          >
            {isUnlocking ? (
              <Unlock className="w-6 h-6 text-christmas-gold" />
            ) : (
              <Lock className="w-6 h-6 text-christmas-gold" />
            )}
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-christmas-red uppercase">
              🎁 La Caja del Regalo
            </h2>
            <p className="text-gray-500 text-xs">Combina los 4 fragmentos</p>
          </div>
        </div>

        {isUnlocking ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Gift className="w-20 h-20 mx-auto text-christmas-red mb-6" />
            </motion.div>
            <h3 className="text-3xl font-bold text-christmas-red mb-2">
              🎄 ¡ABRIENDO! 🎄
            </h3>
            <p className="text-gray-500">Preparando tu regalo...</p>
          </motion.div>
        ) : (
          <>
            {/* Collected Fragments */}
            <div className="bg-christmas-green/5 rounded-xl p-4 mb-6 border border-christmas-green/20">
              <p className="text-gray-500 text-xs uppercase mb-3 text-center">
                🌟 Fragmentos Recolectados
              </p>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 rounded-xl font-mono font-bold text-lg border-2 ${
                      fragments[i]
                        ? "bg-christmas-green/10 border-christmas-green text-christmas-green"
                        : "bg-gray-50 border-gray-200 text-gray-300"
                    }`}
                  >
                    {fragments[i] || "??"}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-christmas-red/5 border-2 border-dashed border-christmas-red/30 rounded-xl p-4 mb-6">
              <p className="text-gray-600 text-sm text-center">
                🔐 Introduce los 4 fragmentos{" "}
                <span className="font-bold text-christmas-red">EN ORDEN</span>{" "}
                para abrir el regalo.
              </p>
            </div>

            {/* Code Input */}
            <div className="mb-6">
              <p className="text-gray-500 text-xs uppercase mb-3 text-center">
                Código de 8 dígitos
              </p>
              <div className="flex justify-center gap-1 md:gap-2">
                {code.map((digit, index) => (
                  <div key={index} className="relative">
                    {index > 0 && index % 2 === 0 && (
                      <div className="absolute -left-1 md:-left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-christmas-gold/30" />
                    )}
                    <motion.input
                      id={`final-digit-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-bold font-mono bg-white border-2 ${
                        isShaking
                          ? "border-red-500 animate-shake"
                          : "border-christmas-gold/30"
                      } rounded-xl text-christmas-red focus:border-christmas-gold focus:outline-none transition-colors`}
                      maxLength={1}
                      animate={isShaking ? { x: [-3, 3, -3, 3, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                ))}
              </div>
              {attempts > 0 && (
                <p className="text-red-500 text-xs text-center mt-3">
                  ❌ Código incorrecto. Intentos: {attempts}
                </p>
              )}
            </div>

            <button
              onClick={checkCode}
              disabled={code.some((d) => !d)}
              className="w-full bg-christmas-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 shadow-lg text-lg"
            >
              <Gift className="w-6 h-6" />
              🎄 Abrir Regalo 🎄
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
