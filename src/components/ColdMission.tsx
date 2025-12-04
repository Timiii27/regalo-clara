'use client';

import { motion } from 'framer-motion';
import { ThermometerSnowflake, Lock, CheckCircle } from 'lucide-react';

interface ColdMissionProps {
  onMissionComplete: () => void;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export default function ColdMission({ onMissionComplete, isUnlocked, isCompleted }: ColdMissionProps) {
  if (!isUnlocked) {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg opacity-60">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-gray-400" size={32} />
          <h3 className="text-2xl font-black text-gray-500 font-serif">FASE 3: MISIÓN DE CAMPO</h3>
        </div>
        <p className="text-gray-500 font-mono text-sm">
          🔒 Consigue las dos palabras clave para desbloquear...
        </p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="christmas-card bg-white p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-christmas-green" size={32} />
          <h3 className="text-2xl font-black text-christmas-green font-serif">MISIÓN CUMPLIDA ✓</h3>
        </div>
        <p className="text-gray-600 font-mono">
          Has recuperado los datos del objetivo. Prepárate para la fase final.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="christmas-card bg-white p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <ThermometerSnowflake className="text-blue-500" size={32} />
        <h3 className="text-2xl font-black text-blue-500 font-serif">FASE 3: MISIÓN DE CAMPO</h3>
      </div>

      <div className="text-center space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-500 font-bold mb-2">PALABRAS CLAVE OBTENIDAS:</p>
          <div className="flex justify-center items-center gap-4 text-3xl md:text-5xl font-black">
            <span className="text-christmas-red">MUCHO</span>
            <span className="text-gray-300">+</span>
            <span className="text-blue-500">FRIO</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl font-bold text-gray-800">
            INSTRUCCIONES DE MISIÓN:
          </p>
          <p className="text-lg text-gray-600 font-mono leading-relaxed">
            Debes ir físicamente al lugar de la casa donde hace <span className="text-blue-500 font-black">MUCHO FRÍO</span>.
            <br/><br/>
            Allí encontrarás dos pistas que te ayudaran a resolver la fase final.
          </p>
        </div>

        <button
          onClick={onMissionComplete}
          className="bg-blue-500 text-white px-8 py-4 font-black text-lg rounded-lg hover:bg-blue-600 transition-colors shadow-md w-full animate-pulse"
        >
          ¡YA TENGO EL DATO!
        </button>
      </div>
    </motion.div>
  );
}
