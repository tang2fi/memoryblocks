import { AnimalCard, LevelConfig } from './types';

export const COLORS = [
  '#EF4444', // Red-500
  '#3B82F6', // Blue-500
  '#10B981', // Emerald-500
  '#F59E0B', // Amber-500
  '#8B5CF6', // Violet-500
  '#EC4899', // Pink-500
  '#06B6D4', // Cyan-500
  '#84CC16', // Lime-500
];

export const INITIAL_ANIMALS: AnimalCard[] = [
  { id: '1', name: 'Smart Puppy', description: 'Complete an Easy game.', imageUrl: 'https://picsum.photos/id/237/200/200', unlockCondition: 'easy_win', isUnlocked: false },
  { id: '2', name: 'Fast Kitty', description: 'Complete Medium in under 15s.', imageUrl: 'https://picsum.photos/id/40/200/200', unlockCondition: 'medium_fast', isUnlocked: false },
  { id: '3', name: 'Wise Owl', description: 'Complete a Hard game.', imageUrl: 'https://picsum.photos/id/1/200/200', unlockCondition: 'hard_win', isUnlocked: false },
  { id: '4', name: 'Brave Lion', description: 'Reach Level 5 in Challenge.', imageUrl: 'https://picsum.photos/id/1074/200/200', unlockCondition: 'challenge_5', isUnlocked: false },
  { id: '5', name: 'Master Elephant', description: 'Reach Level 10 in Challenge.', imageUrl: 'https://picsum.photos/id/1081/200/200', unlockCondition: 'challenge_10', isUnlocked: false },
  { id: '6', name: 'Legendary Bear', description: 'Reach Level 15 in Challenge.', imageUrl: 'https://picsum.photos/id/433/200/200', unlockCondition: 'challenge_15', isUnlocked: false },
];

export const getLevelConfig = (level: number): LevelConfig => {
  if (level <= 3) return { gridSize: 2, colorCount: 3, memorizeTime: 5 };
  if (level <= 7) return { gridSize: 3, colorCount: 4, memorizeTime: 5 };
  if (level <= 12) return { gridSize: 3, colorCount: 5, memorizeTime: 4 };
  return { gridSize: 4, colorCount: 6, memorizeTime: 4, distraction: true };
};

export const DIFFICULTY_CONFIG: Record<string, LevelConfig> = {
  easy: { gridSize: 2, colorCount: 3, memorizeTime: 5 },
  medium: { gridSize: 3, colorCount: 4, memorizeTime: 5 },
  hard: { gridSize: 4, colorCount: 6, memorizeTime: 8 },
};

export const TRANSLATIONS = {
  en: {
    title: "Memory\nBlocks",
    subtitle: "Train your brain with colors!",
    easy: "Easy",
    medium: "Med",
    hard: "Hard",
    challenge: "🏆 Challenge Mode",
    collection: "🐾 My Collection",
    settings: "Settings",
    memorize: "Memorize!",
    solve: "Solve!",
    memorize_hint: "Memorize the pattern!",
    play_hint: "Drag colors to the grid blocks.",
    exit: "Exit",
    fill_all: "Fill all blocks...",
    done: "Done!",
    great_job: "Great Job!",
    keep_trying: "Keep Trying!",
    solved_in: "You solved it in {time} seconds.",
    correct_count: "Correct: {correct} / {total}",
    reached_level: "Reached Level {level}",
    new_unlock: "New Unlock!",
    play_again: "Play Again",
    main_menu: "Main Menu",
    back_menu: "Back to Menu",
    sound_effects: "Sound Effects",
    bg_music: "Background Music",
    visual_feedback: "Visual Feedback",
    language: "Language",
    level: "Level"
  },
  zh: {
    title: "记忆\n色块",
    subtitle: "用颜色训练你的大脑！",
    easy: "初级",
    medium: "中级",
    hard: "高级",
    challenge: "🏆 挑战模式",
    collection: "🐾 我的图卡",
    settings: "设置",
    memorize: "记忆！",
    solve: "还原！",
    memorize_hint: "记住颜色位置！",
    play_hint: "将颜色拖入网格。",
    exit: "退出",
    fill_all: "填满所有方块...",
    done: "完成！",
    great_job: "太棒了！",
    keep_trying: "继续加油！",
    solved_in: "耗时 {time} 秒。",
    correct_count: "正确: {correct} / {total}",
    reached_level: "达到第 {level} 关",
    new_unlock: "新解锁！",
    play_again: "再玩一次",
    main_menu: "主菜单",
    back_menu: "返回主菜单",
    sound_effects: "游戏音效",
    bg_music: "背景音乐",
    visual_feedback: "视觉反馈",
    language: "语言 (Language)",
    level: "关卡"
  }
};