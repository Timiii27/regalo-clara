"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useRouter } from "next/navigation";
import GiftReveal from "@/components/GiftReveal";
import SnowCatcher from "@/components/SnowCatcher";
import SymbolPuzzle from "@/components/SymbolPuzzle";
import CoordinateHunt from "@/components/CoordinateHunt";
import MorseChallenge from "@/components/MorseChallenge";
import FinalCombination from "@/components/FinalCombination";
import { TreePine, Gift, Star, Snowflake, Heart } from "lucide-react";

type Phase =
  | "intro"
  | "snow"
  | "symbols"
  | "coordinates"
  | "morse"
  | "final"
  | "complete";

export default function Level3() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [fragments, setFragments] = useState<string[]>([]);
  const [showGift, setShowGift] = useState(false);

  const { unlockLevel, levels, checkTimeLocks } = useGameStore();
  const router = useRouter();
  const levelConfig = levels.find((l) => l.id === 3);

  useEffect(() => {
    checkTimeLocks();
    if (levelConfig?.isLocked) {
      router.push("/");
    }
  }, [checkTimeLocks, levelConfig, router]);

  const addFragment = (fragment: string) => {
    setFragments((prev) => [...prev, fragment]);
  };

  const handlePhaseComplete = (fragment: string, nextPhase: Phase) => {
    addFragment(fragment);
    setPhase(nextPhase);
  };

  const handleFinalComplete = () => {
    setPhase("complete");
    setShowGift(true);
    unlockLevel(4);
  };

  if (!levelConfig) return null;

  const phaseNames = [
    "intro",
    "snow",
    "symbols",
    "coordinates",
    "morse",
    "final",
    "complete",
  ];
  const phaseIndex = phaseNames.indexOf(phase);
  const progress = (phaseIndex / (phaseNames.length - 1)) * 100;

  return (
    <div className="relative min-h-screen w-full bg-warm-cream text-gray-800 overflow-hidden">
      {/* Christmas Snowflakes Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-christmas-red/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-red"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Fragments Display */}
      {fragments.length > 0 && phase !== "complete" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur border-2 border-christmas-red rounded-xl p-3 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-christmas-gold fill-christmas-gold" />
            <span className="text-xs font-bold text-christmas-red uppercase">
              Fragmentos
            </span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-lg rounded-lg border-2 ${
                  fragments[i]
                    ? "bg-christmas-green/10 border-christmas-green text-christmas-green"
                    : "bg-gray-100 border-gray-200 text-gray-300"
                }`}
              >
                {fragments[i] || "?"}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <GiftReveal
        isOpen={showGift}
        onClose={() => {}}
        giftName="CAFETERA CECOTEC ☕"
        giftImage="/regalo3.png"
        description="¡Para que tengas el mejor café cada mañana! Espresso, capuchino, lo que quieras. ¡Te amo! ☕💕"
        nextLevelUrl="/"
        onNextLevel={() => router.push("/")}
      />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Header */}
        <header className="mb-6 text-center pt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TreePine className="text-christmas-green" size={32} />
            <h1 className="text-2xl md:text-4xl font-black text-christmas-red uppercase tracking-wide font-serif">
              🎄 Escape Room Navideño 🎄
            </h1>
            <TreePine className="text-christmas-green" size={32} />
          </div>
          <p className="text-christmas-green font-mono text-sm">
            NIVEL 3 // 4 FRAGMENTOS PARA ABRIR EL REGALO
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white/90 backdrop-blur border-4 border-christmas-red rounded-2xl p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-christmas-gold/30">
                    <Gift className="w-8 h-8 text-christmas-red" />
                    <div>
                      <h2 className="text-xl font-bold text-christmas-red">
                        🎁 MISIÓN ESPECIAL
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Un regalo te espera...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <p>
                      ¡Hola mi amor! 🎄 Tu regalo está encerrado en una{" "}
                      <span className="text-christmas-red font-bold">
                        caja mágica
                      </span>{" "}
                      protegida por un código de 4 fragmentos.
                    </p>
                    <p>
                      Cada fragmento está{" "}
                      <span className="text-christmas-green font-bold">
                        escondido por la casa
                      </span>
                      . Para encontrarlos, tendrás que resolver puzzles que te
                      dirán dónde buscar.
                    </p>

                    <div className="bg-christmas-red/5 border-2 border-dashed border-christmas-red/30 rounded-xl p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <Snowflake className="w-5 h-5 text-christmas-red shrink-0 mt-0.5" />
                        <div>
                          <p className="text-christmas-red font-bold text-sm mb-1">
                            ❄️ CÓMO FUNCIONA
                          </p>
                          <p className="text-gray-600 text-sm">
                            Hay 4 papelitos escondidos por la casa con números.
                            Resuelve cada puzzle, ve a buscar el papel, e
                            introduce el código aquí.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-christmas-green/5 rounded-xl p-4 mt-4 border border-christmas-green/20">
                      <p className="text-christmas-green text-sm font-mono text-center">
                        ❄️ Copos → 🔢 Matemáticas → 🗺️ Expedición → 📻 Morse →
                        🎁 Regalo
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPhase("snow")}
                    className="w-full mt-8 bg-christmas-red hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all uppercase shadow-lg flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    ¡Empezar Aventura!
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SNOW CATCHER */}
            {phase === "snow" && (
              <SnowCatcher
                key="snow"
                onComplete={(fragment) =>
                  handlePhaseComplete(fragment, "symbols")
                }
                phaseNumber={1}
              />
            )}

            {/* SYMBOL PUZZLE */}
            {phase === "symbols" && (
              <SymbolPuzzle
                key="symbols"
                onComplete={(fragment) =>
                  handlePhaseComplete(fragment, "coordinates")
                }
                phaseNumber={2}
              />
            )}

            {/* COORDINATES */}
            {phase === "coordinates" && (
              <CoordinateHunt
                key="coordinates"
                onComplete={(fragment) =>
                  handlePhaseComplete(fragment, "morse")
                }
                phaseNumber={3}
              />
            )}

            {/* MORSE */}
            {phase === "morse" && (
              <MorseChallenge
                key="morse"
                onComplete={(fragment) =>
                  handlePhaseComplete(fragment, "final")
                }
                phaseNumber={4}
              />
            )}

            {/* FINAL COMBINATION */}
            {phase === "final" && (
              <FinalCombination
                key="final"
                fragments={fragments}
                onComplete={handleFinalComplete}
              />
            )}

            {/* COMPLETE */}
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Gift className="w-24 h-24 mx-auto text-christmas-red animate-bounce mb-6" />
                <h2 className="text-3xl font-bold text-christmas-red mb-2">
                  🎄 ¡ABRIENDO TU REGALO! 🎄
                </h2>
                <p className="text-christmas-green">Preparando sorpresa...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            Hecho con{" "}
            <Heart className="w-4 h-4 text-christmas-red fill-christmas-red" />{" "}
            para ti
          </p>
        </footer>
      </div>
    </div>
  );
}
