import { create } from 'zustand';

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
  isJumpscareActive: boolean;
  failedAttempts: number;
  unlockedLevels: number[];
  
  levels: LevelConfig[];
  
  // Actions
  unlockLevel: (level: number) => void;
  incrementFailedAttempts: () => void;
  triggerJumpscare: () => void;
  resetJumpscare: () => void;
  resetGame: () => void;
  checkTimeLocks: () => void;
}

const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "OPERACIÓN CANELA",
    unlockDate: "2023-12-01", // Already unlocked
    briefing: "Agente Clara, tu misión comienza ahora. El objetivo 'Canela' ha escondido el primer paquete. Necesitamos acceder al sistema central.",
    realLifeClue: "La contraseña es el nombre de quien manda realmente en esta casa.",
    isLocked: false
  },
  {
    id: 2,
    title: "PAPARAZZI MODE",
    unlockDate: "2023-12-10",
    briefing: "Hemos interceptado una transmisión visual, pero está borrosa. Necesitamos tus habilidades fotográficas para enfocar la imagen.",
    realLifeClue: "Busca debajo del sofá. Sí, donde se acumulan las pelusas.",
    isLocked: true
  },
  {
    id: 3,
    title: "DREAM WORLD",
    unlockDate: "2023-12-18",
    briefing: "La señal proviene del mundo de los sueños. Todo está oscuro y confuso. Usa tu linterna para encontrar la verdad entre las mentiras.",
    realLifeClue: "Revisa el armario de la entrada. Al fondo, detrás de los abrigos.",
    isLocked: true
  },
  {
    id: 4,
    title: "GATE 12-25",
    unlockDate: "2023-12-25",
    briefing: "Misión Final. El destino ha sido revelado. Prepárate para el despegue inmediato.",
    realLifeClue: "El código de vuelo es la fecha de hoy.",
    isLocked: true
  }
];

export const useGameStore = create<GameState>((set, get) => ({
  currentLevel: 1,
  isJumpscareActive: false,
  failedAttempts: 0,
  unlockedLevels: [1],
  levels: INITIAL_LEVELS,

  unlockLevel: (level) => set((state) => ({
    unlockedLevels: [...new Set([...state.unlockedLevels, level])],
    currentLevel: level
  })),

  incrementFailedAttempts: () => set((state) => {
    const newAttempts = state.failedAttempts + 1;
    if (newAttempts >= 3) {
      return { failedAttempts: 0, isJumpscareActive: true };
    }
    return { failedAttempts: newAttempts };
  }),

  triggerJumpscare: () => set({ isJumpscareActive: true }),
  
  resetJumpscare: () => set({ isJumpscareActive: false, failedAttempts: 0 }),
  
  resetGame: () => set({
    currentLevel: 1,
    isJumpscareActive: false,
    failedAttempts: 0,
    unlockedLevels: [1]
  }),

  checkTimeLocks: () => set((state) => {
    const now = new Date();
    let hasChanges = false;
    
    const updatedLevels = state.levels.map(level => {
      const unlockDate = new Date(level.unlockDate);
      const isTimeUnlocked = now >= unlockDate;
      const shouldBeLocked = !isTimeUnlocked && level.id !== 1;
      
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
  })
}));
