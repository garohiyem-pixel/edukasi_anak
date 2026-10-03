import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { ALPHABET_LIST } from '../data/alphabetData';
import { NUMBERS_LIST } from '../data/numberData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BalloonItem {
  id: number;
  value: string;
  isTarget: boolean;
  color: string;
  popped: boolean;
  xPercent: number; // 10% to 85%
  delaySeconds: number;
}

interface BalloonPopGameProps {
  onEarnStar: () => void;
  onUpdateSpeech: (text: string) => void;
}

const BALLOON_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  onEarnStar,
  onUpdateSpeech,
}) => {
  const [targetValue, setTargetValue] = useState<string>('A');
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [modeType, setModeType] = useState<'letter' | 'number'>('letter');

  const setupRound = () => {
    const isLetter = Math.random() > 0.5;
    setModeType(isLetter ? 'letter' : 'number');

    let target: string;
    let pool: string[];

    if (isLetter) {
      const letters = ALPHABET_LIST.map((l) => l.letter);
      target = letters[Math.floor(Math.random() * letters.length)];
      pool = letters.filter((l) => l !== target);
    } else {
      const numbers = NUMBERS_LIST.map((n) => n.number.toString());
      target = numbers[Math.floor(Math.random() * numbers.length)];
      pool = numbers.filter((n) => n !== target);
    }

    setTargetValue(target);

    // Create 6 balloons: 2 target, 4 random distractors
    const chosenDistractors = pool.sort(() => 0.5 - Math.random()).slice(0, 4);
    const balloonValues = [target, target, ...chosenDistractors].sort(() => 0.5 - Math.random());

    const generatedBalloons: BalloonItem[] = balloonValues.map((val, idx) => ({
      id: Date.now() + idx,
      value: val,
      isTarget: val === target,
      color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
      popped: false,
      xPercent: 12 + idx * 14,
      delaySeconds: (idx % 3) * 0.4,
    }));

    setBalloons(generatedBalloons);

    const promptText = isLetter
      ? `Ayo pecahkan semua balon dengan huruf ${target}!`
      : `Ayo pecahkan semua balon dengan angka ${target}!`;
    onUpdateSpeech(promptText);
    sound.speak(promptText);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handlePop = (balloon: BalloonItem) => {
    if (balloon.popped) return;

    sound.playPop();

    if (balloon.isTarget) {
      sound.playDing(880);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: balloon.xPercent / 100, y: 0.5 },
        colors: [balloon.color, '#FDE047'],
      });

      // Mark popped
      const updated = balloons.map((b) =>
        b.id === balloon.id ? { ...b, popped: true } : b
      );
      setBalloons(updated);
      setRoundScore((s) => s + 1);
      onEarnStar();

      // Check if all targets are popped
      const remainingTargets = updated.filter((b) => b.isTarget && !b.popped);
      if (remainingTargets.length === 0) {
        sound.playSuccess();
        sound.speak(`Hebat sekali! Semua balon ${targetValue} sudah meletus!`);
        setTimeout(() => {
          setupRound();
        }, 1500);
      }
    } else {
      sound.playGentleBoing();
      sound.speak(`Itu ${balloon.value}. Cari balon ${targetValue} ya!`);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full max-w-5xl mx-auto px-3 sm:px-6 py-2 overflow-hidden select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/95 border border-indigo-200 shadow-2xs font-kids flex items-center gap-2">
            <span className="text-slate-600 font-semibold text-xs sm:text-sm">
              Misi Balon:
            </span>
            <span className="text-indigo-600 font-black text-xl sm:text-2xl animate-bounce">
              {targetValue}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playDing(600);
              sound.speak(`Ayo cari dan pecahkan balon dengan tulisan ${targetValue}!`);
            }}
            className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-2xs"
            title="Dengarkan Misi"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setupRound();
          }}
          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-kids text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-2xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Balon Baru</span>
        </button>
      </div>

      {/* Sky Playfield for Floating Balloons */}
      <div className="flex-1 relative rounded-3xl bg-gradient-to-b from-sky-200/50 via-sky-100/40 to-emerald-100/50 border-4 border-white/80 shadow-inner overflow-hidden my-auto flex items-center justify-center">
        {/* Floating Clouds Background */}
        <div className="absolute top-4 left-6 text-4xl sm:text-6xl opacity-70 animate-float">
          ☁️
        </div>
        <div className="absolute top-8 right-10 text-3xl sm:text-5xl opacity-60 animate-float" style={{ animationDelay: '2s' }}>
          ☁️
        </div>

        {/* Balloons container */}
        <div className="w-full h-full relative flex items-center justify-around px-4">
          {balloons.map((balloon) => {
            if (balloon.popped) {
              return (
                <div
                  key={balloon.id}
                  className="w-16 h-24 sm:w-20 sm:h-32 flex items-center justify-center opacity-30 select-none pointer-events-none"
                >
                  <span className="text-xl">✨</span>
                </div>
              );
            }

            return (
              <button
                key={balloon.id}
                onClick={() => handlePop(balloon)}
                className="group relative flex flex-col items-center focus:outline-hidden transition-transform animate-float active:scale-90"
                style={{
                  animationDuration: `${3.5 + balloon.delaySeconds}s`,
                  animationDelay: `${balloon.delaySeconds}s`,
                }}
                title={`Pecahkan balon ${balloon.value}`}
              >
                {/* Balloon Body */}
                <div
                  className="w-16 h-20 sm:w-24 sm:h-28 rounded-full shadow-lg flex items-center justify-center relative cursor-pointer group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: balloon.color,
                    boxShadow: `0 10px 20px -5px ${balloon.color}80`,
                  }}
                >
                  {/* Balloon reflection shine */}
                  <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 -rotate-20 pointer-events-none"></div>

                  {/* Character inside balloon */}
                  <span className="font-kids font-black text-3xl sm:text-4xl text-white select-none filter drop-shadow-md">
                    {balloon.value}
                  </span>
                </div>

                {/* Balloon Knot and String */}
                <div
                  className="w-2.5 h-2 rounded-sm -mt-0.5"
                  style={{ backgroundColor: balloon.color }}
                ></div>
                <div className="w-0.5 h-8 sm:h-12 bg-slate-400/80"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="shrink-0 text-center py-1">
        <span className="text-xs sm:text-sm font-kids font-semibold text-slate-600 bg-white/80 px-4 py-1.5 rounded-full border border-slate-200">
          Sentuh balon bertuliskan <strong className="text-indigo-600 font-bold">{targetValue}</strong> untuk meletuskannya!
        </span>
      </div>
    </div>
  );
};
