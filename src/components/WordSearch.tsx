'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Lock } from 'lucide-react';

interface WordSearchProps {
  onSolved: () => void;
  isCompleted: boolean;
}

export default function WordSearch({ onSolved, isCompleted }: WordSearchProps) {
  // Grid 5x5
  // M U C H O
  // A B C D E
  // F G H I J
  // K L M N P
  // Q R S T V
  
  const GRID = [
    ['O', 'U', 'S', 'R', 'O'],
    ['A', 'H', 'R', 'L', 'P'],
    ['S', 'B', 'C', 'E', 'N'],
    ['T', 'O', 'D', 'U', 'S'],
    ['L', 'O', 'V', 'E', 'M']
  ];

  const [selectedLetters, setSelectedLetters] = useState<{row: number, col: number, val: string}[]>([]);
  
  const handleLetterClick = (row: number, col: number, val: string) => {
    if (isCompleted) return;

    const newSelection = [...selectedLetters, { row, col, val }];
    setSelectedLetters(newSelection);

    // Check if "MUCHO" is formed
    const currentWord = newSelection.map(s => s.val).join('');
    
    if (currentWord === 'MUCHO') {
      setTimeout(() => onSolved(), 500);
    } else if (!'MUCHO'.startsWith(currentWord)) {
      // Reset if wrong path
      setTimeout(() => setSelectedLetters([]), 500);
    }
  };

  const isSelected = (row: number, col: number) => {
    return selectedLetters.some(s => s.row === row && s.col === col);
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="christmas-card bg-white p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-christmas-green" size={32} />
          <h3 className="text-2xl font-black text-christmas-green font-serif">PALABRA 1: ENCONTRADA</h3>
        </div>
        <div className="bg-christmas-green/10 p-6 rounded-lg border-2 border-christmas-green text-center">
          <p className="text-sm text-gray-600 mb-2">PRIMERA PALABRA CLAVE:</p>
          <p className="text-5xl font-black text-christmas-red tracking-widest">MUCHO</p>
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
        <Search className="text-christmas-red" size={32} />
        <h3 className="text-2xl font-black text-christmas-red font-serif">FASE 1: SOPA DE LETRAS</h3>
      </div>

      <p className="text-gray-700 font-mono text-sm mb-4">
        🔍 Encuentra la palabra oculta. Pista: Es una cantidad grande.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg border-2 border-christmas-gold max-w-xs mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {GRID.map((row, rowIndex) => (
            row.map((letter, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterClick(rowIndex, colIndex, letter)}
                className={`aspect-square flex items-center justify-center text-xl font-bold rounded shadow-sm transition-colors ${
                  isSelected(rowIndex, colIndex)
                    ? 'bg-christmas-red text-white'
                    : 'bg-white text-gray-700 hover:bg-christmas-gold/20'
                }`}
              >
                {letter}
              </motion.button>
            ))
          ))}
        </div>
      </div>
      
     
    </motion.div>
  );
}
