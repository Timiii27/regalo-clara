"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Check, Gift, RotateCcw } from "lucide-react";

interface SnowCatcherProps {
  onComplete: (fragment: string) => void;
  phaseNumber: number;
}

interface Block {
  id: number;
  letter: string;
  x: number;
  width: number;
  placed: boolean;
}

const TARGET_WORD = "NEVADA"; // Palabra navideña
const GAME_WIDTH = 300;
const INITIAL_WIDTH = 100;
const MIN_WIDTH = 20;

export default function SnowCatcher({
  onComplete,
  phaseNumber,
}: SnowCatcherProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [direction, setDirection] = useState(1); // 1 = derecha, -1 = izquierda
  const [gameOver, setGameOver] = useState(false);
  const [showLocationReveal, setShowLocationReveal] = useState(false);
  const [foundFragment, setFoundFragment] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [speed, setSpeed] = useState(3);
  const animationRef = useRef<number>();

  const currentLetterIndex = blocks.length;
  const isComplete = blocks.length === TARGET_WORD.length;

  // Crear nuevo bloque
  const createNewBlock = useCallback(() => {
    const prevBlock = blocks[blocks.length - 1];
    const newWidth = prevBlock ? prevBlock.width : INITIAL_WIDTH;

    const newBlock: Block = {
      id: Date.now(),
      letter: TARGET_WORD[currentLetterIndex],
      x: 0,
      width: newWidth,
      placed: false,
    };
    setCurrentBlock(newBlock);
    setDirection(1);
  }, [blocks, currentLetterIndex]);

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setBlocks([]);
    setGameOver(false);
    setSpeed(3);

    // Primer bloque (base)
    const firstBlock: Block = {
      id: Date.now(),
      letter: TARGET_WORD[0],
      x: (GAME_WIDTH - INITIAL_WIDTH) / 2,
      width: INITIAL_WIDTH,
      placed: true,
    };
    setBlocks([firstBlock]);
  };

  // Crear siguiente bloque después de colocar uno
  useEffect(() => {
    if (
      gameStarted &&
      !currentBlock &&
      !gameOver &&
      !isComplete &&
      blocks.length > 0
    ) {
      const timer = setTimeout(() => {
        const prevBlock = blocks[blocks.length - 1];
        const newBlock: Block = {
          id: Date.now(),
          letter: TARGET_WORD[blocks.length],
          x: 0,
          width: prevBlock.width,
          placed: false,
        };
        setCurrentBlock(newBlock);
        setDirection(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, currentBlock, gameOver, isComplete, blocks]);

  // Mover bloque actual
  useEffect(() => {
    if (!currentBlock || gameOver || isComplete) return;

    const animate = () => {
      setCurrentBlock((prev) => {
        if (!prev) return null;

        let newX = prev.x + direction * speed;
        let newDirection = direction;

        // Rebotar en los bordes
        if (newX + prev.width >= GAME_WIDTH) {
          newX = GAME_WIDTH - prev.width;
          newDirection = -1;
        } else if (newX <= 0) {
          newX = 0;
          newDirection = 1;
        }

        setDirection(newDirection);
        return { ...prev, x: newX };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentBlock, direction, speed, gameOver, isComplete]);

  // Colocar bloque
  const placeBlock = () => {
    if (!currentBlock || gameOver || isComplete) return;

    const prevBlock = blocks[blocks.length - 1];

    // Calcular solapamiento
    const overlapStart = Math.max(currentBlock.x, prevBlock.x);
    const overlapEnd = Math.min(
      currentBlock.x + currentBlock.width,
      prevBlock.x + prevBlock.width
    );
    const overlapWidth = overlapEnd - overlapStart;

    if (overlapWidth <= 0) {
      // No hay solapamiento - game over
      setGameOver(true);
      setCurrentBlock(null);
      return;
    }

    if (overlapWidth < MIN_WIDTH) {
      // Muy poco solapamiento - game over
      setGameOver(true);
      setCurrentBlock(null);
      return;
    }

    // Colocar bloque con el nuevo ancho
    const placedBlock: Block = {
      ...currentBlock,
      x: overlapStart,
      width: overlapWidth,
      placed: true,
    };

    setBlocks((prev) => [...prev, placedBlock]);
    setCurrentBlock(null);

    // Aumentar velocidad cada 2 bloques
    if ((blocks.length + 1) % 2 === 0) {
      setSpeed((s) => Math.min(s + 0.5, 8));
    }

    // Verificar si completó la palabra
    if (blocks.length + 1 === TARGET_WORD.length) {
      setTimeout(() => {
        setShowLocationReveal(true);
      }, 500);
    }
  };

  // Reiniciar juego
  const resetGame = () => {
    setBlocks([]);
    setCurrentBlock(null);
    setGameOver(false);
    setSpeed(3);
    startGame();
  };

  const handleFragmentSubmit = () => {
    if (foundFragment === "17") {
      onComplete("17");
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Calcular perfecta alineación
  const isPerfect = (block: Block, prevBlock: Block) => {
    return (
      Math.abs(block.x - prevBlock.x) < 5 && block.width === prevBlock.width
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/90 backdrop-blur border-4 border-christmas-red rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-christmas-gold/30">
          <div className="bg-christmas-red/10 p-2 rounded-xl">
            <Layers className="w-6 h-6 text-christmas-red" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-christmas-red uppercase">
              Fase {phaseNumber}: Torre de Letras
            </h2>
            <p className="text-gray-500 text-xs">
              Apila los bloques para formar la palabra
            </p>
          </div>
        </div>

        {!showLocationReveal ? (
          <>
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="text-6xl mb-4">🏗️🎄</div>
                <h3 className="text-xl font-bold text-christmas-green">
                  ¡TORRE DE NAVIDAD!
                </h3>
                <p className="text-gray-600">
                  Apila los bloques para formar la palabra{" "}
                  <span className="font-bold text-christmas-red">
                    "{TARGET_WORD}"
                  </span>
                </p>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-yellow-700 text-sm font-bold">
                    ⚠️ ¡Cuidado!
                  </p>
                  <p className="text-yellow-600 text-xs mt-1">
                    Si no alineas bien, la torre se estrecha. ¡Si es muy fina,
                    se cae!
                  </p>
                </div>
                <div className="bg-christmas-green/5 rounded-xl p-4 border border-christmas-green/20">
                  <p className="text-gray-500 text-sm">
                    🎯 Toca la pantalla o haz clic para soltar el bloque
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="w-full bg-christmas-green hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all uppercase shadow-lg"
                >
                  🎮 ¡Empezar!
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Progress - letras */}
                <div className="flex justify-center gap-2">
                  {TARGET_WORD.split("").map((letter, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold border-2 transition-all ${
                        i < blocks.length
                          ? "bg-christmas-green text-white border-christmas-green"
                          : i === blocks.length && currentBlock
                          ? "bg-christmas-gold/20 text-christmas-gold border-christmas-gold animate-pulse"
                          : "bg-gray-100 text-gray-300 border-gray-200"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                {/* Speed indicator */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Velocidad: {"🔥".repeat(Math.min(5, Math.ceil(speed / 2)))}
                  </span>
                  <span>
                    Bloques: {blocks.length}/{TARGET_WORD.length}
                  </span>
                </div>

                {/* Game Area */}
                <div
                  className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 rounded-xl overflow-hidden cursor-pointer select-none"
                  style={{ height: "350px" }}
                  onClick={placeBlock}
                  onTouchStart={placeBlock}
                >
                  {/* Líneas guía */}
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-20">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="border-l border-white/30 h-full"
                        style={{ marginLeft: GAME_WIDTH / 6 }}
                      />
                    ))}
                  </div>

                  {/* Contenedor de la torre centrado */}
                  <div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    style={{ width: GAME_WIDTH, height: 280 }}
                  >
                    {/* Bloques colocados */}
                    {blocks.map((block, index) => (
                      <motion.div
                        key={block.id}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute flex items-center justify-center text-white font-bold text-lg rounded shadow-lg"
                        style={{
                          left: block.x,
                          bottom: index * 35,
                          width: block.width,
                          height: 32,
                          background:
                            index === 0
                              ? "linear-gradient(135deg, #166534 0%, #15803d 100%)"
                              : `linear-gradient(135deg, hsl(${
                                  120 + index * 15
                                }, 70%, 40%) 0%, hsl(${
                                  120 + index * 15
                                }, 70%, 50%) 100%)`,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <span className="drop-shadow-md">{block.letter}</span>
                        {index > 0 &&
                          blocks[index - 1] &&
                          isPerfect(block, blocks[index - 1]) && (
                            <span className="absolute -right-6 text-yellow-300">
                              ⭐
                            </span>
                          )}
                      </motion.div>
                    ))}

                    {/* Bloque actual (moviéndose) */}
                    {currentBlock && !gameOver && (
                      <motion.div
                        className="absolute flex items-center justify-center text-white font-bold text-lg rounded shadow-lg"
                        style={{
                          left: currentBlock.x,
                          bottom: blocks.length * 35,
                          width: currentBlock.width,
                          height: 32,
                          background:
                            "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <span className="drop-shadow-md">
                          {currentBlock.letter}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Game Over overlay */}
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">💥</div>
                        <p className="text-white text-xl font-bold mb-4">
                          ¡La torre se cayó!
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetGame();
                          }}
                          className="bg-christmas-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 mx-auto"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Intentar de nuevo
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Instructions */}
                  {blocks.length === 1 && currentBlock && (
                    <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                      <div className="inline-block bg-black/60 px-4 py-2 rounded-lg">
                        <p className="text-white text-sm">
                          👆 ¡Toca para soltar el bloque!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-christmas-green/10 border-2 border-christmas-green rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-christmas-green mb-2">
                ¡TORRE COMPLETADA! 🏗️
              </h3>
              <p className="text-gray-600 mb-2">
                Has formado la palabra:{" "}
                <span className="font-bold text-christmas-red">
                  {TARGET_WORD}
                </span>
              </p>
              <p className="text-gray-600 mb-4">
                Primera ubicación desbloqueada:
              </p>
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-christmas-gold">
                <Gift className="w-8 h-8 mx-auto text-christmas-red mb-2" />
                <p className="text-christmas-red font-bold text-lg mb-2">
                  🛋️ DEBAJO DEL SOFÁ
                </p>
                <p className="text-gray-500 text-sm">
                  Ve a buscar debajo del sofá. Hay un papel con un número de 2
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
