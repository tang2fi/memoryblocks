import React from 'react';
import { AnimalCard } from '../types';
import Button from '../components/Button';
import { TRANSLATIONS } from '../constants';

interface CollectionScreenProps {
  cards: AnimalCard[];
  lang: 'en' | 'zh';
  onBack: () => void;
}

const CollectionScreen: React.FC<CollectionScreenProps> = ({ cards, lang, onBack }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label={t.back_menu}
        >
          <span className="text-xl font-bold">←</span>
        </button>
        <h2 className="text-xl font-bold text-slate-800">{t.collection}</h2>
      </div>
      
      {/* Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {cards.map(card => (
            <div 
              key={card.id} 
              className={`
                flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all
                ${card.isUnlocked 
                  ? 'border-slate-100 shadow-sm bg-white hover:border-blue-200' 
                  : 'border-slate-50 bg-slate-50 opacity-70'}
              `}
            >
              <div className="w-20 h-20 rounded-full bg-slate-200 mb-3 overflow-hidden shadow-inner">
                 {card.isUnlocked ? (
                   <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-3xl grayscale">🔒</div>
                 )}
              </div>
              <h3 className={`font-bold text-sm ${card.isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                {card.name}
              </h3>
              {!card.isUnlocked && (
                 <p className="text-[10px] text-slate-400 mt-1 px-2 leading-tight">{card.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Home Button for extra navigation safety */}
      <div className="p-4 border-t bg-slate-50">
        <Button variant="outline" className="w-full" onClick={onBack}>
          {t.back_menu}
        </Button>
      </div>
    </div>
  );
};

export default CollectionScreen;