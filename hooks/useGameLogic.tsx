import { useState, useEffect, useCallback, useRef } from 'react';
import { COLORS, getLevelConfig, DIFFICULTY_CONFIG } from '../constants';
import { GameMode, Difficulty, GameResult, LevelConfig } from '../types';

type GamePhase = 'idle' | 'memorize' | 'playing' | 'result';

interface UseGameLogicProps {
  mode: GameMode;
  difficulty?: Difficulty;
  onGameOver: (result: GameResult) => void;
}

export const useGameLogic = ({ mode, difficulty, onGameOver }: UseGameLogicProps) => {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [level, setLevel] = useState(1);
  
  // Game Board State
  const [gridSize, setGridSize] = useState(2);
  const [solution, setSolution] = useState<string[]>([]); // The correct pattern
  const [userGrid, setUserGrid] = useState<(string | null)[]>([]); // User's current placement
  const [palette, setPalette] = useState<string[]>([]); // Available blocks to place
  
  // Timers
  const [timeLeft, setTimeLeft] = useState(0); // For memorize phase
  const [playTime, setPlayTime] = useState(0); // For playing phase
  const timerRef = useRef<number | null>(null);

  const getConfig = useCallback(() => {
    if (mode === 'challenge') {
      return getLevelConfig(level);
    }
    return DIFFICULTY_CONFIG[difficulty || 'easy'];
  }, [mode, level, difficulty]);

  const generateLevel = useCallback(() => {
    const config = getConfig();
    setGridSize(config.gridSize);
    
    const totalCells = config.gridSize * config.gridSize;
    // Pick random colors
    const availableColors = [...COLORS].sort(() => 0.5 - Math.random()).slice(0, config.colorCount);
    
    const newSolution: string[] = [];
    for (let i = 0; i < totalCells; i++) {
      newSolution.push(availableColors[Math.floor(Math.random() * availableColors.length)]);
    }
    
    setSolution(newSolution);
    setUserGrid(new Array(totalCells).fill(null));
    
    // Create palette (shuffled solution + distraction if needed)
    let paletteColors = [...newSolution];
    if (config.distraction) {
       const distractionColor = COLORS.find(c => !availableColors.includes(c)) || COLORS[0];
       paletteColors.push(distractionColor);
    }
    paletteColors = paletteColors.sort(() => 0.5 - Math.random());
    setPalette(paletteColors);

    setPhase('memorize');
    setTimeLeft(config.memorizeTime);
    setPlayTime(0);

  }, [getConfig]);

  // Start/Restart Game
  const startGame = useCallback(() => {
    if (mode === 'practice') {
      setLevel(1);
    }
    generateLevel();
  }, [mode, generateLevel]);

  // Timer Logic
  useEffect(() => {
    if (phase === 'memorize') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase('playing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'playing') {
      timerRef.current = window.setInterval(() => {
        setPlayTime(t => t + 1);
      }, 1000); // Count up for playtime
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Interaction: Drag and Drop Move Logic
  const moveBlock = (
    from: { type: 'palette' | 'grid', index: number },
    to: { type: 'grid', index: number } | null // null means drop back to palette/cancel
  ) => {
    if (phase !== 'playing') return;

    let colorToMove: string | null = null;
    const newUserGrid = [...userGrid];
    const newPalette = [...palette];

    // 1. Pick up
    if (from.type === 'palette') {
      colorToMove = newPalette[from.index];
      // We remove it from the palette.
      // Note: In a real app, we might need to handle stable IDs to prevent index shifting issues during rapid moves,
      // but for this simple game, splicing is acceptable as long as we don't re-render mid-drag in a way that breaks interaction.
      newPalette.splice(from.index, 1);
    } else {
      colorToMove = newUserGrid[from.index];
      newUserGrid[from.index] = null;
    }

    if (!colorToMove) return;

    // 2. Place
    if (to && to.type === 'grid') {
      // Check if target is occupied
      const existingColor = newUserGrid[to.index];
      if (existingColor) {
        // Return existing to palette
        newPalette.push(existingColor);
      }
      newUserGrid[to.index] = colorToMove;
    } else {
      // Dropped nowhere (or explicitly back to palette), return to palette
      newPalette.push(colorToMove);
    }

    setUserGrid(newUserGrid);
    setPalette(newPalette);
  };

  // Check valid submission
  const checkSubmission = useCallback(() => {
    const isFull = userGrid.every(cell => cell !== null);
    if (!isFull) return;

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    userGrid.forEach((color, idx) => {
      if (color === solution[idx]) correctCount++;
    });

    const isWin = correctCount === solution.length;

    if (mode === 'challenge') {
      if (isWin) {
        // Next Level
        setTimeout(() => {
          setLevel(l => l + 1);
          generateLevel();
        }, 1000);
      } else {
        // Game Over
        setPhase('result');
        onGameOver({
          correct: correctCount,
          total: solution.length,
          timeTaken: playTime,
          levelReached: level,
          isWin: false
        });
      }
    } else {
      // Practice Mode End
      setPhase('result');
      onGameOver({
        correct: correctCount,
        total: solution.length,
        timeTaken: playTime,
        isWin: isWin
      });
    }
  }, [userGrid, solution, mode, level, playTime, generateLevel, onGameOver]);

  return {
    phase,
    gridSize,
    solution,
    userGrid,
    palette,
    timeLeft,
    playTime,
    level,
    startGame,
    moveBlock,
    checkSubmission
  };
};