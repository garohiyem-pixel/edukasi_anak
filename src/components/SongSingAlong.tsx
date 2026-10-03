import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Sparkles } from 'lucide-react';
import { ALPHABET_LIST } from '../data/alphabetData';
import { NUMBERS_LIST } from '../data/numberData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SongSingAlongProps {
  onUpdateSpeech: (text: string) => void;
}

export const SongSingAlong: React.FC<SongSingAlongProps> = ({ onUpdateSpeech }) => {
  const [songType, setSongType] = useState<'alphabet' | 'numbers'>('alphabet');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const alphabetTokens = ALPHABET_LIST.map((a) => a.letter);
  const numberTokens = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const currentTokens = songType === 'alphabet' ? alphabetTokens : numberTokens;

  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [songType]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setActiveIndex((prev) => {
          const next = prev + 1;
          if (next >= currentTokens.length) {
            // Song ended!
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            sound.playSuccess();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
            });
            sound.speak('Hore! Kita sudah selesai bernyanyi bersama!');
            return 0;
          }

          // Play pitch & speak current token
          const token = currentTokens[next];
          sound.playDing(500 + next * 35);
          sound.speak(token);

          return next;
        });
      }, 750);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentTokens]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sound.playPop();

    if (nextState) {
      const intro = songType === 'alphabet'
        ? 'Ayo kita bernyanyi lagu huruf Alfabet bersama-sama!'
        : 'Ayo kita berhitung angka satu sampai sepuluh!';
      onUpdateSpeech(intro);
      sound.speak(intro);
      // Start from current or 0
      sound.playDing(500 + activeIndex * 35);
      sound.speak(currentTokens[activeIndex]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveIndex(0);
    sound.playPop();
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full max-w-5xl mx-auto px-3 sm:px-6 py-2 overflow-hidden select-none">
      {/* Song Type Selector */}
      <div className="flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-1.5 p-1 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setSongType('alphabet')}
            className={`px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all ${
              songType === 'alphabet'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            Lagu Alfabet (A-Z)
          </button>
          <button
            onClick={() => setSongType('numbers')}
            className={`px-3.5 py-1.5 rounded-xl font-kids text-xs sm:text-sm font-semibold transition-all ${
              songType === 'numbers'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            Lagu Angka (1-10)
          </button>
        </div>

        {/* Play / Reset controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-xl font-kids font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Nyanyi</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs"
            title="Ulangi dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sing-Along Lyric Board */}
      <div className="flex-1 bg-white/95 rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-lg my-auto flex flex-col items-center justify-center relative overflow-hidden">
        {/* Big bouncing active token preview */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-kids font-black text-5xl sm:text-6xl shadow-xl shadow-purple-300/50 animate-bounce">
            {currentTokens[activeIndex]}
          </div>
          <span className="font-kids font-bold text-slate-700 text-sm sm:text-lg mt-2">
            {songType === 'alphabet'
              ? `${ALPHABET_LIST[activeIndex]?.phonics || ''}`
              : `Angka ${NUMBERS_LIST[activeIndex + 1]?.word || ''}`}
          </span>
        </div>

        {/* Tokens Grid with Highlighted bouncing indicator */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-2xl px-2">
          {currentTokens.map((token, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-kids font-bold text-sm sm:text-lg transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white scale-115 shadow-md ring-3 ring-amber-300'
                    : idx < activeIndex
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {token}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="shrink-0 text-center py-1">
        <span className="text-xs sm:text-sm font-kids font-semibold text-slate-600 bg-white/80 px-4 py-1.5 rounded-full border border-slate-200">
          🎵 Sentuh tombol <strong>Mulai Nyanyi</strong> untuk bernyanyi bersama Boni!
        </span>
      </div>
    </div>
  );
};
