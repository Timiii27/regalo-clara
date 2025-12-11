"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Navigation,
  Check,
  Gift,
  ArrowUp,
  RotateCcw,
} from "lucide-react";

interface CoordinateHuntProps {
  onComplete: (fragment: string) => void;
  phaseNumber: number;
}

export default function CoordinateHunt({
  onComplete,
  phaseNumber,
}: CoordinateHuntProps) {
  const [showLocationReveal, setShowLocationReveal] = useState(false);
  const [foundFragment, setFoundFragment] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [missionStarted, setMissionStarted] = useState(false);

  const steps = [
    {
      instruction: "Sitúate en la ENTRADA de la casa",
      detail: "Ponte de pie mirando hacia dentro",
      emoji: "🚪",
    },
    {
      instruction: "Camina RECTO hasta llegar a la escalera",
      detail: "Sigue el pasillo sin girar",
      emoji: "➡️",
    },
    {
      instruction: "SUBE la escalera",
      detail: "Hasta llegar al siguiente piso",
      emoji: "⬆️",
    },
    {
      instruction: "Gira 90° a la IZQUIERDA",
      detail: "Deberías ver otra escalera",
      emoji: "↩️",
    },
    {
      instruction: "SUBE la segunda escalera",
      detail: "Hacia la buhardilla",
      emoji: "⬆️",
    },
    {
      instruction: "¡Has llegado a la BUHARDILLA!",
      detail: "Ahora busca al REY DE LA SELVA...",
      emoji: "🏠",
    },
  ];

  const handleArrived = () => {
    if (currentStep === steps.length - 1) {
      setShowLocationReveal(true);
    }
  };

  const handleFragmentSubmit = () => {
    if (foundFragment === "89") {
      onComplete("89");
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
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
          <div className="bg-christmas-green/10 p-2 rounded-xl">
            <Navigation className="w-6 h-6 text-christmas-green" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-christmas-red uppercase">
              Fase {phaseNumber}: Expedición
            </h2>
            <p className="text-gray-500 text-xs">
              Sigue las coordenadas por la casa
            </p>
          </div>
        </div>

        {!showLocationReveal ? (
          <>
            {!missionStarted ? (
              /* Mission Briefing */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-christmas-green/5 border-2 border-christmas-green/20 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold text-christmas-green mb-2">
                    ¡MISIÓN DE CAMPO!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Esta misión requiere que te{" "}
                    <span className="text-christmas-red font-bold">
                      levantes y camines
                    </span>{" "}
                    por la casa siguiendo las coordenadas.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Al final encontrarás a un guardián muy feroz que custodia el
                    fragmento... 🦁
                  </p>
                </div>

                <div className="bg-christmas-red/5 rounded-xl p-4 border border-christmas-red/20">
                  <p className="text-gray-500 text-xs uppercase mb-2 text-center">
                    Equipo necesario
                  </p>
                  <div className="flex justify-center gap-6 text-2xl">
                    <span title="Tus piernas">🦵</span>
                    <span title="Escaleras">🪜</span>
                    <span title="Valor">💪</span>
                  </div>
                </div>

                <button
                  onClick={() => setMissionStarted(true)}
                  className="w-full bg-christmas-green hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all uppercase shadow-lg"
                >
                  🎄 Comenzar Expedición
                </button>
              </motion.div>
            ) : (
              /* Navigation Steps */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="flex justify-center gap-2 mb-4">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i < currentStep
                          ? "bg-christmas-green"
                          : i === currentStep
                          ? "bg-christmas-red animate-pulse"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Current Step */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-christmas-red/5 rounded-xl p-6 text-center border-2 border-christmas-red/20"
                >
                  <div className="text-6xl mb-4">
                    {steps[currentStep].emoji}
                  </div>
                  <h3 className="text-xl font-bold text-christmas-red mb-2">
                    {steps[currentStep].instruction}
                  </h3>
                  <p className="text-gray-500">{steps[currentStep].detail}</p>
                  <p className="text-gray-400 text-sm mt-4">
                    Paso {currentStep + 1} de {steps.length}
                  </p>
                </motion.div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-gray-700 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Anterior
                  </button>
                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-christmas-green hover:bg-green-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Siguiente
                      <ArrowUp className="w-4 h-4 rotate-90" />
                    </button>
                  ) : (
                    <button
                      onClick={handleArrived}
                      className="flex-1 bg-christmas-red hover:bg-red-700 text-white py-3 rounded-xl transition-colors font-bold"
                    >
                      🎄 ¡He llegado!
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Find the lion */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-christmas-gold/10 border-2 border-christmas-gold rounded-xl p-6 text-center">
              <div className="text-6xl mb-4">🦁</div>
              <h3 className="text-xl font-bold text-christmas-red mb-2">
                ¡HAS LLEGADO A LA BUHARDILLA!
              </h3>
              <p className="text-gray-600 mb-4">
                Ahora busca al{" "}
                <span className="text-christmas-red font-bold">
                  REY DE LA SELVA
                </span>{" "}
                que habita aquí...
              </p>
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-christmas-gold">
                <p className="text-christmas-red font-bold text-lg mb-2">
                  🔍 BUSCA AL LEÓN DE PELUCHE
                </p>
                <p className="text-gray-500 text-sm">
                  Ese león feroz con el que juega Canela tiene algo para ti.
                  ¡Búscalo!
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-500 text-xs uppercase mb-3 text-center">
                Introduce el fragmento del león
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
