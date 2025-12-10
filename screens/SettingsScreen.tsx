import React from 'react';
import { GameSettings } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsScreenProps {
  settings: GameSettings;
  lang: 'en' | 'zh';
  onUpdate: (newSettings: GameSettings) => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, lang, onUpdate, onBack }) => {
  const t = TRANSLATIONS[lang];

  const toggle = (key: keyof GameSettings) => {
    // Only toggle boolean values
    if (key === 'soundEnabled' || key === 'musicEnabled' || key === 'feedbackEnabled') {
      onUpdate({ ...settings, [key]: !settings[key] });
    }
  };

  const setLanguage = (newLang: 'en' | 'zh') => {
    onUpdate({ ...settings, language: newLang });
  };

  const ToggleOption = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <button 
        onClick={onClick}
        className={`w-12 h-7 rounded-full transition-colors relative ${active ? 'bg-blue-500' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-2xl font-bold text-slate-400 hover:text-slate-600">✕</button>
        <h2 className="text-2xl font-bold">{t.settings}</h2>
      </div>

      <div className="space-y-4">
        {/* Language Selector */}
        <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <span className="font-bold text-slate-700 mb-2">{t.language}</span>
           <div className="grid grid-cols-2 gap-2">
             <button 
               onClick={() => setLanguage('en')}
               className={`py-2 px-4 rounded-xl font-bold transition-all border-2 ${settings.language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
             >
               English
             </button>
             <button 
               onClick={() => setLanguage('zh')}
               className={`py-2 px-4 rounded-xl font-bold transition-all border-2 ${settings.language === 'zh' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
             >
               中文
             </button>
           </div>
        </div>

        <ToggleOption label={t.sound_effects} active={settings.soundEnabled} onClick={() => toggle('soundEnabled')} />
        <ToggleOption label={t.bg_music} active={settings.musicEnabled} onClick={() => toggle('musicEnabled')} />
        <ToggleOption label={t.visual_feedback} active={settings.feedbackEnabled} onClick={() => toggle('feedbackEnabled')} />
      </div>
      
      <div className="mt-auto text-center text-slate-400 text-xs">
        Memory Blocks v1.1.0
      </div>
    </div>
  );
};

export default SettingsScreen;