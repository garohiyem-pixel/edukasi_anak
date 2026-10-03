import React, { useState } from 'react';
import { Volume2, Sparkles, Smile } from 'lucide-react';
import mascotImg from '../assets/images/mascot_cute_bear_1791050140576.jpg';
import { sound } from '../utils/audio';

interface MascotBoniProps {
  speechText: string;
  onRepeatSpeech?: () => void;
  emotion?: 'happy' | 'cheering' | 'waving';
}

export const MascotBoni: React.FC<MascotBoniProps> = ({
  speechText,
  onRepeatSpeech,
  emotion = 'happy',
}) => {
  const [isJumping, setIsJumping] = useState(false);

  const handleMascotClick = () => {
    setIsJumping(true);
    sound.playDing(660);
    if (onRepeatSpeech) {
      onRepeatSpeech();
    }
    setTimeout(() => setIsJumping(false), 600);
  };

  return (
    <div className="relative flex items-center gap-3 max-w-xl mx-auto w-full px-2 sm:px-4 shrink-0 py-1.5 z-20">
      {/* Mascot Avatar with Bounce Animation */}
      <button
        onClick={handleMascotClick}
        className={`relative shrink-0 group focus:outline-hidden transition-transform ${
          isJumping ? '-translate-y-3 scale-110' : 'hover:scale-105 active:scale-95'
        }`}
        title="Ketuk Boni untuk bicara!"
        aria-label="Maskot Boni si Beruang Pintar"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-md shadow-amber-300/40 border-2 border-white overflow-hidden relative">
          <img
            src={mascotImg}
            alt="Boni si Beruang Pintar"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <Smile className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <span className="sr-only">Boni si Beruang</span>
      </button>

      {/* Speech Bubble */}
      <div className="relative flex-1 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 sm:py-2.5 border border-amber-200/90 shadow-sm text-slate-800 flex items-center justify-between gap-2 min-h-[48px]">
        {/* Speech triangle pointer */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-white"></div>

        <p className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2 text-slate-700">
          <span className="font-kids font-bold text-amber-700 mr-1.5">Boni:</span>
          {speechText}
        </p>

        {onRepeatSpeech && (
          <button
            onClick={() => {
              sound.playPop();
              onRepeatSpeech();
            }}
            className="shrink-0 p-1.5 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 active:scale-95 transition-all shadow-2xs"
            title="Dengarkan Suara Boni"
            aria-label="Ulangi Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
