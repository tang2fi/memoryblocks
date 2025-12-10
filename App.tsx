import React, { useState, useEffect } from 'react';
import MainMenu from './screens/MainMenu';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import CollectionScreen from './screens/CollectionScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Difficulty, GameMode, GameResult, AnimalCard, GameSettings } from './types';
import { INITIAL_ANIMALS } from './constants';

type Screen = 'menu' | 'game' | 'result' | 'collection' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  
  // Game Configuration State
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  // Persistence Data
  const [animals, setAnimals] = useState<AnimalCard[]>(() => {
    const saved = localStorage.getItem('memory_animals');
    return saved ? JSON.parse(saved) : INITIAL_ANIMALS;
  });
  
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('memory_settings');
    return saved ? JSON.parse(saved) : { 
      soundEnabled: true, 
      musicEnabled: false, 
      feedbackEnabled: true,
      language: 'en' 
    };
  });

  // Ensure default language is set if loading from old localstorage
  useEffect(() => {
    if (!settings.language) {
      setSettings(s => ({...s, language: 'en'}));
    }
  }, [settings.language]);

  // Last Game Result
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [newUnlockedCard, setNewUnlockedCard] = useState<AnimalCard | null>(null);

  useEffect(() => {
    localStorage.setItem('memory_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('memory_settings', JSON.stringify(settings));
  }, [settings]);

  // Navigation Handlers
  const handleStartPractice = (diff: Difficulty) => {
    setGameMode('practice');
    setDifficulty(diff);
    setCurrentScreen('game');
  };

  const handleStartChallenge = () => {
    setGameMode('challenge');
    setDifficulty('easy'); // Start easy
    setCurrentScreen('game');
  };

  const handleGameOver = (result: GameResult) => {
    setLastResult(result);
    setNewUnlockedCard(null);

    // Check Unlocks
    const newlyUnlocked: string[] = [];
    const updatedAnimals = animals.map(animal => {
      if (animal.isUnlocked) return animal;
      
      let unlocked = false;
      // Simple logic mapping based on constants
      if (animal.unlockCondition === 'easy_win' && difficulty === 'easy' && result.isWin) unlocked = true;
      if (animal.unlockCondition === 'medium_fast' && difficulty === 'medium' && result.isWin && result.timeTaken < 15) unlocked = true;
      if (animal.unlockCondition === 'hard_win' && difficulty === 'hard' && result.isWin) unlocked = true;
      if (animal.unlockCondition === 'challenge_5' && gameMode === 'challenge' && (result.levelReached || 0) >= 5) unlocked = true;
      if (animal.unlockCondition === 'challenge_10' && gameMode === 'challenge' && (result.levelReached || 0) >= 10) unlocked = true;
      if (animal.unlockCondition === 'challenge_15' && gameMode === 'challenge' && (result.levelReached || 0) >= 15) unlocked = true;

      if (unlocked) {
        newlyUnlocked.push(animal.id);
        return { ...animal, isUnlocked: true };
      }
      return animal;
    });

    if (newlyUnlocked.length > 0) {
      setAnimals(updatedAnimals);
      // Just show the first one unlocked for simplicity in ResultScreen
      const card = updatedAnimals.find(a => a.id === newlyUnlocked[0]);
      if (card) setNewUnlockedCard(card);
    }

    setCurrentScreen('result');
  };

  const handleRetry = () => {
    // Retry with same settings
    setCurrentScreen('game');
  };

  return (
    <div className="w-full h-screen bg-slate-100 overflow-hidden font-sans select-none touch-none">
      <div className="mx-auto h-full max-w-md bg-white shadow-2xl relative overflow-hidden">
        {currentScreen === 'menu' && (
          <MainMenu 
            lang={settings.language}
            onStartPractice={handleStartPractice}
            onStartChallenge={handleStartChallenge}
            onOpenCollection={() => setCurrentScreen('collection')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        )}
        
        {currentScreen === 'game' && (
          <GameScreen 
            mode={gameMode} 
            difficulty={difficulty} 
            lang={settings.language}
            onGameOver={handleGameOver}
            onExit={() => setCurrentScreen('menu')}
          />
        )}
        
        {currentScreen === 'result' && lastResult && (
          <ResultScreen 
            result={lastResult}
            unlockedCard={newUnlockedCard}
            lang={settings.language}
            onRetry={handleRetry}
            onMenu={() => setCurrentScreen('menu')}
          />
        )}

        {currentScreen === 'collection' && (
          <CollectionScreen 
            cards={animals}
            lang={settings.language}
            onBack={() => setCurrentScreen('menu')}
          />
        )}

        {currentScreen === 'settings' && (
           <SettingsScreen 
             settings={settings}
             lang={settings.language}
             onUpdate={setSettings}
             onBack={() => setCurrentScreen('menu')}
           />
        )}
      </div>
    </div>
  );
}