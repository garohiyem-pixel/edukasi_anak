import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Maximize2, Minimize2, Sparkles, BookOpen, Hash, HelpCircle, Gamepad2, Mic } from 'lucide-react';
import { AppMode } from '../types';
import starRewardImg from '../assets/images/kids_reward_star_1791050166844.jpg';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  stars,
  isMuted,
  onToggleMute,
  isBgmPlaying,
  onToggleBgm,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-amber-100 flex items-center justify-between shrink-0 shadow-sm z-30">
      {/* Zone 1: App Title & Brand Mark */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-white shadow-inner font-kids font-bold text-xl select-none">
          ABC
        </div>
        <div className="leading-tight">
          <span className="font-kids font-bold text-lg sm:text-xl text-amber-700 tracking-tight block">
            CeriaKids
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-600/80">
            Huruf & Angka
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Modes */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onSelectMode('letters')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            currentMode === 'letters'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
              : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
          }`}
          title="Belajar Huruf A-Z"
        >
          <BookOpen className="w-4 h-4" />
          <span>Huruf</span>
        </button>

        <button
          onClick={() => onSelectMode('numbers')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            currentMode === 'numbers'
              ? 'bg-teal-500 text-white shadow-md shadow-teal-200 scale-105'
              : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
          }`}
          title="Belajar Angka 0-10"
        >
          <Hash className="w-4 h-4" />
          <span>Angka</span>
        </button>

        <button
          onClick={() => onSelectMode('quiz')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            currentMode === 'quiz'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-105'
              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'
          }`}
          title="Tebak Ceria"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tebak</span>
        </button>

        <button
          onClick={() => onSelectMode('balloons')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            currentMode === 'balloons'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 scale-105'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
          title="Pecahkan Balon"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="hidden xs:inline">Balon</span>
        </button>

        <button
          onClick={() => onSelectMode('song')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            currentMode === 'song'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-200 scale-105'
              : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
          }`}
          title="Lagu Ceria"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden md:inline">Lagu</span>
        </button>
      </nav>

      {/* Zone 3: Stars & Utility Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Star Reward Tally */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl shadow-xs">
          <img
            src={starRewardImg}
            alt="Bintang Prestasi"
            className="w-5 h-5 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-kids font-bold text-amber-700 text-sm sm:text-base tabular-nums">
            {stars}
          </span>
        </div>

        {/* Music BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className={`p-2 rounded-xl transition-all ${
            isBgmPlaying
              ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400/50'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title={isBgmPlaying ? 'Matikan Musik Melodi' : 'Putar Musik Melodi'}
          aria-label="Toggle Musik"
        >
          <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
        </button>

        {/* Audio FX & Voice Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl transition-all ${
            isMuted
              ? 'bg-rose-100 text-rose-600'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
          title={isMuted ? 'Suara Hening' : 'Suara Aktif'}
          aria-label="Toggle Suara"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          title="Layar Penuh"
          aria-label="Layar Penuh"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
