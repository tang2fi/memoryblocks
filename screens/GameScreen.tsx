import React, { useEffect, useState, useRef } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import Button from '../components/Button';
import { GameMode, Difficulty, GameResult } from '../types';
import { TRANSLATIONS } from '../constants';

interface GameScreenProps {
  mode: GameMode;
  difficulty?: Difficulty;
  lang: 'en' | 'zh';
  onGameOver: (result: GameResult) => void;
  onExit: () => void;
}

interface DragItem {
  color: string;
  source: { type: 'palette' | 'grid', index: number };
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ mode, difficulty, lang, onGameOver, onExit }) => {
  const {
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
  } = useGameLogic({ mode, difficulty, onGameOver });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Drag and Drop State
  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const dragItemRef = useRef<DragItem | null>(null); 

  useEffect(() => {
    dragItemRef.current = dragItem;
  }, [dragItem]);

  const handlePointerDown = (e: React.PointerEvent, source: { type: 'palette' | 'grid', index: number }, color: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const newItem: DragItem = {
      color,
      source,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    };
    
    setDragItem(newItem);
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragItemRef.current) return;
    e.preventDefault();
    setDragItem(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
  };

  const handlePointerUp = (e: PointerEvent) => {
    const item = dragItemRef.current;
    if (!item) return;

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const gridCell = elements.find(el => el.hasAttribute('data-grid-index'));
    
    if (gridCell) {
      const index = parseInt(gridCell.getAttribute('data-grid-index') || '-1', 10);
      if (index !== -1) {
        moveBlock(item.source, { type: 'grid', index });
      }
    } else {
      moveBlock(item.source, null);
    }

    setDragItem(null);
  };

  const gridCols = gridSize === 2 ? 'grid-cols-2' : gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
  const containerWidth = gridSize === 2 ? 'max-w-[250px]' : gridSize === 3 ? 'max-w-[320px]' : 'max-w-[360px]';

  return (
    <div className="flex flex-col h-full bg-slate-50 relative touch-none select-none">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white shadow-sm z-10">
        <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600">✕ {t.exit}</button>
        <div className="font-bold text-xl text-slate-700">
           {mode === 'challenge' ? `${t.level} ${level}` : timeLeft > 0 ? t.memorize : t.solve}
        </div>
        <div className="text-blue-500 font-mono font-bold text-lg w-16 text-right">
          {phase === 'memorize' ? `${timeLeft}s` : `${playTime}s`}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Helper Text */}
        <div className="mb-6 text-center h-8">
           {phase === 'memorize' && <p className="text-amber-500 font-bold text-lg animate-pulse">{t.memorize_hint}</p>}
           {phase === 'playing' && <p className="text-slate-400 text-sm">{t.play_hint}</p>}
        </div>

        {/* The Grid */}
        <div className={`grid ${gridCols} gap-3 w-full ${containerWidth} aspect-square`}>
          {phase === 'memorize' ? (
            solution.map((color, idx) => (
              <div 
                key={`sol-${idx}`} 
                className="rounded-xl shadow-inner border-4 border-white"
                style={{ backgroundColor: color }} 
              />
            ))
          ) : (
            userGrid.map((color, idx) => {
              const isBeingDragged = dragItem?.source.type === 'grid' && dragItem.source.index === idx;
              
              return (
                <div 
                  key={`grid-${idx}`}
                  data-grid-index={idx}
                  onPointerDown={(e) => {
                    if (phase === 'playing' && color) {
                      handlePointerDown(e, { type: 'grid', index: idx }, color);
                    }
                  }}
                  className={`
                    rounded-xl shadow-sm border-4 transition-all relative overflow-hidden
                    ${color && !isBeingDragged ? 'border-white cursor-grab active:cursor-grabbing' : 'border-slate-200 bg-slate-200'}
                  `}
                  style={{ 
                    backgroundColor: (color && !isBeingDragged) ? color : 'transparent',
                    opacity: isBeingDragged ? 0.3 : 1 
                  }}
                >
                  {!color && !isBeingDragged && (
                    <span className="absolute inset-0 flex items-center justify-center text-slate-300 opacity-50 text-2xl pointer-events-none">+</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Control Area (Palette) */}
      {phase === 'playing' && (
        <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-6 animate-slide-up z-20">
           <div className="flex flex-wrap justify-center gap-3 mb-6 min-h-[4rem]">
             {palette.map((color, idx) => {
               const isBeingDragged = dragItem?.source.type === 'palette' && dragItem.source.index === idx;

               return (
                 <div
                   key={`pal-${idx}-${color}`} 
                   onPointerDown={(e) => handlePointerDown(e, { type: 'palette', index: idx }, color)}
                   className={`
                      w-14 h-14 rounded-full shadow-md border-4 border-white
                      cursor-grab active:cursor-grabbing touch-manipulation
                   `}
                   style={{ 
                     backgroundColor: color,
                     opacity: isBeingDragged ? 0 : 1,
                     transform: isBeingDragged ? 'scale(0.9)' : 'scale(1)'
                   }}
                 />
               );
             })}
           </div>
           
           <Button 
             variant="primary" 
             className="w-full shadow-blue-200" 
             size="lg"
             disabled={userGrid.includes(null)}
             onClick={checkSubmission}
           >
             {userGrid.includes(null) ? t.fill_all : t.done}
           </Button>
        </div>
      )}

      {/* Dragging Overlay */}
      {dragItem && (
        <div 
          className="fixed w-14 h-14 rounded-full shadow-xl border-4 border-white pointer-events-none z-50 opacity-90"
          style={{
            backgroundColor: dragItem.color,
            left: 0,
            top: 0,
            transform: `translate(${dragItem.currentX - 28}px, ${dragItem.currentY - 28}px) scale(1.1)`,
            touchAction: 'none'
          }}
        />
      )}
    </div>
  );
};

export default GameScreen;