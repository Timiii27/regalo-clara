import { create } from "zustand";

export interface LevelConfig {
  id: number;
  title: string;
  unlockDate: string; // ISO format: YYYY-MM-DD
  briefing: string;
  realLifeClue: string;
  isLocked: boolean;
}

interface GameState {
  currentLevel: number;
  failedAttempts: number;
  unlockedLevels: number[];
  hintRequested: boolean;

  levels: LevelConfig[];

  // Actions
  unlockLevel: (level: number) => void;
  incrementFailedAttempts: () => void;
  resetGame: () => void;
  checkTimeLocks: () => void;
  setHintRequested: (requested: boolean) => void;
}

const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "EL PRIMER REGALO",
    unlockDate: "2025-12-01", // Already unlocked
    briefing:
      "¡Hola mi amor! La Navidad ha llegado antes de tiempo. Tu primer regalo te está esperando, pero primero debes encontrarlo.",
    realLifeClue:
      "Busca en el lugar donde guardamos nuestros sueños (y las sábanas).",
    isLocked: true,
  },
  {
    id: 2,
    title: "OPERACIÓN BAJO CERO",
    unlockDate: "2025-12-05",
    briefing:
      "Agente Sherlocka, la siguiente pista está fragmentada. Necesitamos que recuperes dos palabras clave y realices una misión de campo. Prepárate para pasar un poco de... temperatura.",
    realLifeClue: "Todo empieza con una sopa... de letras.",
    isLocked: true,
  },
  {
    id: 3,
    title: "BAJO EL MUÉRDAGO",
    unlockDate: "2025-12-11",
    briefing:
      "Agente Clara, esta es tu misión más dinámica. Vas a tener que moverte por la casa, resolver acertijos físicos y completar retos. ¡Prepárate para un escape room de verdad!",
    realLifeClue:
      "Necesitarás: un espejo, objetos de casa, y ganas de explorar. ¡Empieza yendo al baño!",
    isLocked: true,
  },
  {
    id: 4,
    title: "LA GRAN SORPRESA",
    unlockDate: "2025-12-25",
    briefing:
      "El regalo final. La joya de la corona. Prepárate para algo inolvidable.",
    realLifeClue: "Solo disponible en Nochebuena.",
    isLocked: true,
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  currentLevel: 1,
  failedAttempts: 0,
  unlockedLevels: [],
  hintRequested: false,
  levels: INITIAL_LEVELS,

  setHintRequested: (requested) => set({ hintRequested: requested }),

  unlockLevel: (levelId) =>
    set((state) => {
      const updatedLevels = state.levels.map((level) =>
        level.id === levelId ? { ...level, isLocked: false } : level
      );

      return {
        unlockedLevels: [...new Set([...state.unlockedLevels, levelId])],
        currentLevel: levelId,
        levels: updatedLevels,
      };
    }),

  incrementFailedAttempts: () =>
    set((state) => ({
      failedAttempts: state.failedAttempts + 1,
    })),

  resetGame: () =>
    set({
      currentLevel: 1,
      failedAttempts: 0,
      unlockedLevels: [],
    }),

  checkTimeLocks: () =>
    set((state) => {
      const now = new Date();
      let hasChanges = false;

      const updatedLevels = state.levels.map((level) => {
        // Skip Level 1 as it is password protected
        if (level.id === 1) return level;

        const unlockDate = new Date(level.unlockDate);
        const isTimeUnlocked = now >= unlockDate;
        const shouldBeLocked = !isTimeUnlocked;

        if (level.isLocked !== shouldBeLocked) {
          hasChanges = true;
          return { ...level, isLocked: shouldBeLocked };
        }
        return level;
      });

      if (hasChanges) {
        return { levels: updatedLevels };
      }
      return {};
    }),
}));
