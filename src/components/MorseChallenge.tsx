"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Check, Gift, Volume2 } from "lucide-react";

interface MorseChallengeProps {
  onComplete: (fragment: string) => void;
  phaseNumber: number;
}

const MORSE_ALPHABET: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
};

export default function MorseChallenge({
  onComplete,
  phaseNumber,
}: MorseChallengeProps) {
  const [answer, setAnswer] = useState("");
  const [showLocationReveal, setShowLocationReveal] = useState(false);
  const [foundFragment, setFoundFragment] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showAlphabet, setShowAlphabet] = useState(false);

  const MORSE_MESSAGE = "-.-. .- -- .-";
  const CORRECT_ANSWERS = ["cama", "la cama"];

  const checkAnswer = () => {
    const normalized = answer.toLowerCase().trim();
    if (CORRECT_ANSWERS.some((a) => normalized === a)) {
      setShowLocationReveal(true);
    } else {
      setAttempts((prev) => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleFragmentSubmit = () => {
    if (foundFragment === "56") {
      onComplete("56");
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const playMorse = () => {
    const morse = MORSE_MESSAGE.split(" ");
    let delay = 0;
    morse.forEach((_, i) => {
      setTimeout(() => {
        const el = document.getElementById(`morse-letter-${i}`);
        if (el) {
          el.classList.add("bg-christmas-gold", "scale-110");
          setTimeout(() => {
            el.classList.remove("bg-christmas-gold", "scale-110");
          }, 400);
        }
      }, delay);
      delay += 600;
    });
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
            <Radio className="w-6 h-6 text-christmas-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-christmas-red uppercase">
              Fase {phaseNumber}: Código Morse
            </h2>
            <p className="text-gray-500 text-xs">Traduce el mensaje</p>
          </div>
        </div>

        {!showLocationReveal ? (
          <>
            {/* Explanation */}
            <div className="bg-christmas-green/5 rounded-xl p-4 mb-6 border border-christmas-green/20">
              <p className="text-gray-600 text-sm">
                El{" "}
                <span className="text-christmas-red font-bold">
                  Código Morse
                </span>{" "}
                usa puntos (.) y rayas (-) para letras. Cada letra está separada
                por espacio. ¡Tradúcelo!
              </p>
            </div>

            {/* Morse Message */}
            <div className="bg-christmas-red/5 rounded-xl p-6 mb-4 text-center border-2 border-dashed border-christmas-red/30">
              <p className="text-gray-500 text-xs uppercase mb-3">
                📻 Mensaje en Morse
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                {MORSE_MESSAGE.split(" ").map((code, i) => (
                  <div
                    key={i}
                    id={`morse-letter-${i}`}
                    className="bg-white border-2 border-christmas-red/20 px-4 py-3 rounded-xl transition-all"
                  >
                    <p className="text-2xl md:text-3xl font-mono font-bold text-christmas-red tracking-wider">
                      {code}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={playMorse}
                className="mt-4 flex items-center gap-2 mx-auto text-gray-400 hover:text-christmas-red text-sm transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Reproducir secuencia
              </button>
            </div>

            {/* Toggle Alphabet */}
            <div className="mb-6">
              <button
                onClick={() => setShowAlphabet(!showAlphabet)}
                className="w-full bg-christmas-green/5 hover:bg-christmas-green/10 border border-christmas-green/20 py-2 rounded-xl text-christmas-green text-sm transition-colors"
              >
                {showAlphabet ? "🔼 Ocultar" : "🔽 Mostrar"} Alfabeto Morse
              </button>

              {showAlphabet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 bg-gray-50 rounded-xl p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 text-xs border border-gray-200"
                >
                  {Object.entries(MORSE_ALPHABET).map(([letter, code]) => (
                    <div key={letter} className="text-center p-1">
                      <p className="text-christmas-red font-bold">{letter}</p>
                      <p className="text-gray-500 font-mono text-xs">{code}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <p className="text-gray-500 text-xs uppercase mb-2 text-center">
                ¿Qué palabra dice?
              </p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="Escribe la palabra..."
                className={`w-full bg-white border-2 ${
                  isShaking ? "border-red-500 animate-shake" : "border-gray-200"
                } rounded-xl p-4 text-center text-lg text-christmas-red font-bold uppercase focus:border-christmas-green focus:outline-none transition-colors`}
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
              🎄 Decodificar Mensaje
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
                ¡MENSAJE DECODIFICADO! 🎄
              </h3>
              <p className="text-gray-600 mb-4">
                El mensaje dice:{" "}
                <span className="font-bold text-christmas-red">CAMA</span>
              </p>
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-christmas-gold">
                <p className="text-christmas-red font-bold text-lg mb-2">
                  🛏️ VE A LA CAMA / MESITA DE NOCHE
                </p>
                <p className="text-gray-500 text-sm">
                  Busca debajo de la almohada, bajo el colchón, o en la mesita.
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
