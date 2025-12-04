'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, CheckCircle, Lock } from 'lucide-react';

interface SlidingPuzzleProps {
  onSolved: () => void;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export default function SlidingPuzzle({ onSolved, isUnlocked, isCompleted }: SlidingPuzzleProps) {
  const SOLVED_STATE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (isUnlocked && tiles.length === 0) {
      shufflePuzzle();
    }
  }, [isUnlocked]);

  const shufflePuzzle = () => {
    let shuffled = [...SOLVED_STATE];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTiles(shuffled);
    setMoves(0);
  };

  const canMove = (index: number, emptyIndex: number): boolean => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf(8);
    
    if (canMove(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (JSON.stringify(newTiles) === JSON.stringify(SOLVED_STATE)) {
        setTimeout(() => onSolved(), 500);
      }
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg opacity-60">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-gray-400" size={32} />
          <h3 className="text-2xl font-black text-gray-500 font-serif">FASE 2: PUZZLE DESLIZANTE</h3>
        </div>
        <p className="text-gray-500 font-mono text-sm">
          🔒 Completa la Fase 1 para desbloquear...
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
          <h3 className="text-2xl font-black text-christmas-green font-serif">PALABRA 2: ENCONTRADA</h3>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300 text-center">
          <p className="text-sm text-gray-600 mb-2">SEGUNDA PALABRA CLAVE:</p>
          <p className="text-5xl font-black text-blue-500 tracking-widest">FRIO</p>
          <p className="text-2xl mt-2">❄️🥶🧊</p>
        </div>
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
        <Shuffle className="text-christmas-red" size={32} />
        <h3 className="text-2xl font-black text-christmas-red font-serif">FASE 2: PUZZLE DESLIZANTE</h3>
      </div>

      <p className="text-gray-700 font-mono text-sm mb-4">
        🧩 Ordena los números del 1 al 8 para revelar la siguiente palabra.
      </p>

      <div className="aspect-square w-full max-w-sm mx-auto grid grid-cols-3 gap-1 bg-gray-100 p-2 rounded border-2 border-christmas-gold">
        {tiles.map((tile, index) => (
          <motion.button
            key={index}
            onClick={() => handleTileClick(index)}
            className={`aspect-square flex items-center justify-center font-black text-3xl transition-all rounded ${
              tile === 8
                ? 'bg-transparent cursor-default'
                : 'bg-gradient-to-br from-christmas-green to-christmas-gold text-white hover:scale-95 cursor-pointer shadow-md border-2 border-white/50'
            }`}
            whileHover={tile !== 8 ? { scale: 0.95 } : {}}
            whileTap={tile !== 8 ? { scale: 0.9 } : {}}
          >
            {tile !== 8 && tile + 1}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-600 font-mono text-sm font-bold">🎯 Movimientos: {moves}</span>
        <button
          onClick={shufflePuzzle}
          className="bg-christmas-red text-white px-4 py-2 font-bold text-sm hover:bg-christmas-green transition-colors rounded shadow-md"
        >
          🔄 REINICIAR
        </button>
      </div>
    </motion.div>
  );
}
