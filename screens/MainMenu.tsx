import React from 'react';
import Button from '../components/Button';
import { TRANSLATIONS } from '../constants';

interface MainMenuProps {
  lang: 'en' | 'zh';
  onStartPractice: (diff: 'easy' | 'medium' | 'hard') => void;
  onStartChallenge: () => void;
  onOpenCollection: () => void;
  onOpenSettings: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  lang,
  onStartPractice, 
  onStartChallenge, 
  onOpenCollection,
  onOpenSettings
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-2 drop-shadow-md whitespace-pre-line leading-tight">
          {t.title}
        </h1>
        <p className="text-gray-500 font-medium">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
           <Button variant="success" size="sm" onClick={() => onStartPractice('easy')}>{t.easy}</Button>
           <Button variant="secondary" size="sm" onClick={() => onStartPractice('medium')}>{t.medium}</Button>
           <Button variant="danger" size="sm" onClick={() => onStartPractice('hard')}>{t.hard}</Button>
        </div>
        
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full py-6 text-2xl shadow-blue-300"
          onClick={onStartChallenge}
        >
          {t.challenge}
        </Button>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={onOpenCollection}
        >
          {t.collection}
        </Button>
      </div>

      <button 
        onClick={onOpenSettings}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-500 hover:bg-gray-100"
        aria-label={t.settings}
      >
        ⚙️
      </button>
    </div>
  );
};

export default MainMenu;