import React from 'react';
import Button from '../components/Button';
import { GameResult, AnimalCard } from '../types';
import { TRANSLATIONS } from '../constants';

interface ResultScreenProps {
  result: GameResult;
  unlockedCard?: AnimalCard | null;
  lang: 'en' | 'zh';
  onRetry: () => void;
  onMenu: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, unlockedCard, lang, onRetry, onMenu }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-50 animate-fade-in text-center">
      
      <div className="mb-8">
        {result.isWin ? (
           <div className="text-6xl mb-4">🎉</div>
        ) : (
           <div className="text-6xl mb-4">🥺</div>
        )}
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
          {result.isWin ? t.great_job : t.keep_trying}
        </h2>
        <p className="text-slate-500">
          {result.isWin 
            ? t.solved_in.replace('{time}', result.timeTaken.toString())
            : t.correct_count.replace('{correct}', result.correct.toString()).replace('{total}', result.total.toString())}
        </p>
        {result.levelReached && (
          <p className="text-blue-500 font-bold mt-2 text-lg">{t.reached_level.replace('{level}', result.levelReached.toString())}</p>
        )}
      </div>

      {unlockedCard && (
        <div className="bg-white p-4 rounded-2xl shadow-xl mb-8 border-2 border-yellow-200 w-full max-w-xs animate-bounce-in">
          <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{t.new_unlock}</div>
          <img 
            src={unlockedCard.imageUrl} 
            alt={unlockedCard.name} 
            className="w-32 h-32 rounded-full mx-auto mb-3 object-cover border-4 border-yellow-100"
          />
          <h3 className="text-xl font-bold text-slate-800">{unlockedCard.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{unlockedCard.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="primary" size="lg" onClick={onRetry}>{t.play_again}</Button>
        <Button variant="outline" onClick={onMenu}>{t.main_menu}</Button>
      </div>
    </div>
  );
};

export default ResultScreen;