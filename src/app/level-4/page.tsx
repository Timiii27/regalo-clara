'use client';

import { useRouter } from 'next/navigation';
import { Gift, Lock, Calendar, Star } from 'lucide-react';

export default function Level4() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-warm-cream text-gray-800 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Snowflakes */}
      <div className="snowflake">❄</div>
      <div className="snowflake">❅</div>
      <div className="snowflake">❆</div>
      <div className="snowflake">❄</div>
      <div className="snowflake">❅</div>
      <div className="snowflake">❆</div>

      <div className="bg-white p-8 rounded-xl card-shadow border-t-4 border-christmas-gold max-w-md w-full text-center relative z-10">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-christmas-gold text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
          <Lock size={14} />
          REGALO CERRADO
        </div>

        <Star className="w-20 h-20 mx-auto text-christmas-gold mb-6 animate-spin-slow" />

        <h1 className="text-3xl font-bold text-gray-700 mb-4 font-serif">
          La Gran Sorpresa
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Lo mejor se guarda para el final. Este regalo iluminará tu Navidad.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-flex items-center gap-3 text-sm text-gray-600 mb-8">
          <Calendar className="text-christmas-red" size={18} />
          <span>Disponible el <strong>25 de Diciembre</strong></span>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-christmas-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
        >
          Volver al Calendario
        </button>
      </div>
    </div>
  );
}
