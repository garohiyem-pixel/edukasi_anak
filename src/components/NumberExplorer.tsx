import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, RotateCcw, Check } from 'lucide-react';
import { NumberItem } from '../types';
import { NUMBERS_LIST } from '../data/numberData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface NumberExplorerProps {
  currentNumber: NumberItem;
  onSelectNumber: (num: NumberItem) => void;
  onNumberLearned: () => void;
  onUpdateSpeech: (text: string) => void;
}

export const NumberExplorer: React.FC<NumberExplorerProps> = ({
  currentNumber,
  onSelectNumber,
  onNumberLearned,
  onUpdateSpeech,
}) => {
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [isNumberBouncing, setIsNumberBouncing] = useState(false);

  const currentIndex = NUMBERS_LIST.findIndex((item) => item.number === currentNumber.number);

  useEffect(() => {
    setCountedIndices([]);
    onUpdateSpeech(currentNumber.narration);
    sound.speak(currentNumber.narration);
  }, [currentNumber]);

  const handleNext = () => {
    sound.playPop();
    const nextIdx = (currentIndex + 1) % NUMBERS_LIST.length;
    onSelectNumber(NUMBERS_LIST[nextIdx]);
  };

  const handlePrev = () => {
    sound.playPop();
    const prevIdx = (currentIndex - 1 + NUMBERS_LIST.length) % NUMBERS_LIST.length;
    onSelectNumber(NUMBERS_LIST[prevIdx]);
  };

  const handleNumberCardTap = () => {
    setIsNumberBouncing(true);
    sound.playDing(620);
    sound.speak(`Angka ${currentNumber.number}! ${currentNumber.word}!`);
    setTimeout(() => setIsNumberBouncing(false), 500);
  };

  const handleItemTap = (idx: number) => {
    if (countedIndices.includes(idx)) {
      // already counted
      sound.playDing(700);
      return;
    }

    const nextCount = countedIndices.length + 1;
    const newCounted = [...countedIndices, idx];
    setCountedIndices(newCounted);

    // Play tuned xylophone note
    sound.playXylophone(nextCount);
    sound.speak(`${nextCount}`);

    // If all items counted
    if (newCounted.length === currentNumber.number) {
      setTimeout(() => {
        sound.playSuccess();
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.5 },
          colors: [currentNumber.color, '#F59E0B', '#10B981'],
        });
        sound.speak(`Hebat! Ada ${currentNumber.number} ${currentNumber.itemName}! Kamu pintar sekali!`);
        onNumberLearned();
      }, 400);
    }
  };

  const resetCount = () => {
    sound.playPop();
    setCountedIndices([]);
    sound.speak(`Ayo kita hitung lagi dari satu!`);
  };

  const indonesianNumbers = ['Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'];

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full max-w-5xl mx-auto px-3 sm:px-6 py-2 overflow-hidden select-none">
      {/* Top Bar: Progress and Count Hint */}
      <div className="flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs">
            Angka {currentNumber.number} ({currentNumber.word})
          </span>
          <button
            onClick={() => {
              sound.playDing(550);
              sound.speak(`Angka ${currentNumber.number}, dibaca ${currentNumber.word}`);
            }}
            className="px-3 py-1 rounded-xl bg-teal-500 text-white text-xs sm:text-sm font-kids font-semibold hover:bg-teal-600 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Dengarkan</span>
          </button>
        </div>

        {currentNumber.number > 0 && (
          <button
            onClick={resetCount}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-kids text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Hitung Ulang"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hitung Ulang</span>
          </button>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 my-auto relative">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border-2 border-slate-200 shadow-md flex items-center justify-center active:scale-90 transition-all shrink-0 z-10"
          aria-label="Angka Sebelumnya"
        >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>

        {/* Center Stage: Number Display & Interactive Counting Box */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 max-w-full">
          {/* Big Number Card */}
          <div
            onClick={handleNumberCardTap}
            className={`w-36 h-48 sm:w-52 sm:h-64 md:w-60 md:h-72 rounded-3xl bg-white p-3 sm:p-5 flex flex-col items-center justify-between cursor-pointer border-4 transition-all shadow-lg shrink-0 ${
              isNumberBouncing ? 'animate-wiggle' : 'hover:scale-[1.02]'
            }`}
            style={{
              borderColor: currentNumber.color,
              boxShadow: `0 16px 30px -10px ${currentNumber.color}40`,
            }}
            title="Ketuk angka!"
          >
            <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">Angka Ceria</span>
              <Sparkles className="w-4 h-4" style={{ color: currentNumber.color }} />
            </div>

            <div className="flex flex-col items-center justify-center my-auto">
              <span
                className="font-kids font-black text-6xl sm:text-8xl md:text-9xl leading-none"
                style={{ color: currentNumber.color }}
              >
                {currentNumber.number}
              </span>
              <span
                className="font-kids font-bold text-xl sm:text-2xl mt-2 tracking-wide"
                style={{ color: currentNumber.textColor }}
              >
                {currentNumber.word}
              </span>
            </div>

            <div className="w-full text-center">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                Ketuk Angka
              </span>
            </div>
          </div>

          {/* Interactive Counting Box */}
          <div
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-72 rounded-3xl p-3 sm:p-4 flex flex-col justify-between border-4 bg-white/95 shadow-lg relative"
            style={{
              borderColor: `${currentNumber.color}80`,
              backgroundColor: currentNumber.bgLight,
            }}
          >
            {/* Header / Instructions */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
              <span className="font-kids font-bold text-xs sm:text-sm text-slate-700">
                {currentNumber.number === 0
                  ? 'Ruang Nol (Kosong)'
                  : `Ayo ketuk satu-persatu: ${countedIndices.length}/${currentNumber.number}`}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentNumber.itemName}
              </span>
            </div>

            {/* Counting Playground Items */}
            <div className="flex-1 flex items-center justify-center p-2">
              {currentNumber.number === 0 ? (
                <div className="text-center p-4">
                  <div className="text-5xl mb-2 animate-bounce">🎈✨</div>
                  <p className="font-kids font-semibold text-xs sm:text-sm text-slate-600">
                    Nol artinya kosong, belum ada benda apa pun di sini!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 place-items-center w-full">
                  {Array.from({ length: currentNumber.number }).map((_, idx) => {
                    const isCounted = countedIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleItemTap(idx)}
                        className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all cursor-pointer select-none ${
                          isCounted
                            ? 'bg-white shadow-md scale-110 ring-3 ring-emerald-400'
                            : 'bg-white/60 hover:bg-white hover:scale-105 active:scale-95 shadow-xs'
                        }`}
                        title={`Ketuk benda ke-${idx + 1}`}
                      >
                        <span className={isCounted ? 'filter drop-shadow-sm' : 'opacity-85'}>
                          {currentNumber.itemEmoji}
                        </span>
                        {isCounted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom count status feedback */}
            <div className="text-center pt-1 border-t border-slate-200/60">
              <span className="text-xs font-bold text-slate-600">
                {countedIndices.length === currentNumber.number && currentNumber.number > 0 ? (
                  <span className="text-emerald-600 font-kids">
                    🎉 Hebat! Semua {currentNumber.number} benda sudah terhitung!
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {currentNumber.number === 0
                      ? 'Nol adalah permulaan!'
                      : 'Ketuk semua gambar di atas untuk menghitung!'}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border-2 border-slate-200 shadow-md flex items-center justify-center active:scale-90 transition-all shrink-0 z-10"
          aria-label="Angka Selanjutnya"
        >
          <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Horizontal Number Selector (0 to 10) */}
      <div className="shrink-0 w-full bg-white/80 backdrop-blur-md rounded-2xl p-1.5 sm:p-2 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-2 justify-center">
          {NUMBERS_LIST.map((item) => {
            const isSelected = item.number === currentNumber.number;
            return (
              <button
                key={item.number}
                onClick={() => {
                  sound.playPop();
                  onSelectNumber(item);
                }}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-kids font-bold text-base sm:text-lg transition-all flex items-center justify-center ${
                  isSelected
                    ? 'text-white shadow-md scale-110'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: item.color,
                        boxShadow: `0 4px 12px ${item.color}50`,
                      }
                    : {}
                }
              >
                {item.number}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
