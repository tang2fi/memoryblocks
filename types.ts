export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'practice' | 'challenge';

export interface Block {
  id: string;
  color: string;
}

export interface AnimalCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockCondition: string;
  isUnlocked: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  feedbackEnabled: boolean;
  language: 'en' | 'zh';
}

export interface GameResult {
  correct: number;
  total: number;
  timeTaken: number;
  levelReached?: number;
  isWin: boolean;
}

export interface LevelConfig {
  gridSize: 2 | 3 | 4;
  colorCount: number;
  memorizeTime: number;
  distraction?: boolean;
}