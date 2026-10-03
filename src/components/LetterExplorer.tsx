import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, Edit3, RotateCcw, CheckCircle } from 'lucide-react';
import { LetterItem } from '../types';
import { ALPHABET_LIST } from '../data/alphabetData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LetterExplorerProps {
  currentLetter: LetterItem;
  onSelectLetter: (letter: LetterItem) => void;
  onLetterLearned: () => void;
  onUpdateSpeech: (text: string) => void;
}

export const LetterExplorer: React.FC<LetterExplorerProps> = ({
  currentLetter,
  onSelectLetter,
  onLetterLearned,
  onUpdateSpeech,
}) => {
  const [isTracingOpen, setIsTracingOpen] = useState(false);
  const [isItemBouncing, setIsItemBouncing] = useState(false);
  const [isCardWiggling, setIsCardWiggling] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasTraced, setHasTraced] = useState(false);

  const currentIndex = ALPHABET_LIST.findIndex((item) => item.id === currentLetter.id);

  // Play narration whenever letter changes
  useEffect(() => {
    onUpdateSpeech(currentLetter.narration);
    sound.speak(currentLetter.narration);
    setHasTraced(false);
  }, [currentLetter]);

  const handleNext = () => {
    sound.playPop();
    const nextIdx = (currentIndex + 1) % ALPHABET_LIST.length;
    onSelectLetter(ALPHABET_LIST[nextIdx]);
  };

  const handlePrev = () => {
    sound.playPop();
    const prevIdx = (currentIndex - 1 + ALPHABET_LIST.length) % ALPHABET_LIST.length;
    onSelectLetter(ALPHABET_LIST[prevIdx]);
  };

  const handleCardTap = () => {
    setIsCardWiggling(true);
    sound.playDing(600);
    sound.speak(`Huruf ${currentLetter.letter}!`);
    setTimeout(() => setIsCardWiggling(false), 500);
  };

  const handleItemTap = () => {
    setIsItemBouncing(true);
    sound.playPop();
    sound.speak(`${currentLetter.word}! ${currentLetter.funFact}`);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: [currentLetter.color, '#FBBF24', '#38BDF8'],
    });
    onLetterLearned();
    setTimeout(() => setIsItemBouncing(false), 600);
  };

  // Canvas Tracing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentLetter.color;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    sound.playDing(700);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasTraced(true);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
    sound.playPop();
  };

  const finishTracing = () => {
    sound.playSuccess();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
    });
    sound.speak(`Hebat sekali! Kamu berhasil menebalkan huruf ${currentLetter.letter}!`);
    setIsTracingOpen(false);
    onLetterLearned();
  };

  // Render cartoon illustration based on letter iconType
  const renderIllustration = () => {
    return (
      <div
        onClick={handleItemTap}
        className={`w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer transition-transform select-none ${
          isItemBouncing ? 'scale-110 -rotate-3' : 'hover:scale-105 active:scale-95'
        }`}
        style={{
          backgroundColor: currentLetter.bgLight,
          border: `3px dashed ${currentLetter.color}`,
          boxShadow: `0 10px 25px -5px ${currentLetter.color}25`,
        }}
        title={`Ketuk ${currentLetter.word}!`}
      >
        <div className="relative text-6xl sm:text-7xl md:text-8xl select-none filter drop-shadow-md">
          {renderEmoji(currentLetter.id)}
        </div>
        <div className="mt-2 text-center">
          <span
            className="font-kids font-bold text-lg sm:text-2xl block tracking-wide"
            style={{ color: currentLetter.textColor }}
          >
            {currentLetter.word}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">
            {currentLetter.category}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full max-w-5xl mx-auto px-3 sm:px-6 py-2 overflow-hidden select-none">
      {/* Top Section: Progress & Phonics Hint */}
      <div className="flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs">
            Huruf {currentIndex + 1} dari {ALPHABET_LIST.length}
          </span>
          <button
            onClick={() => {
              sound.playDing(580);
              sound.speak(currentLetter.phonics);
            }}
            className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-kids font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{currentLetter.phonics}</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setIsTracingOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-kids font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Tebalkan Huruf</span>
        </button>
      </div>

      {/* Main Interactive Stage (Letter Card + Animated Word Illustration) */}
      <div className="flex-1 flex items-center justify-center gap-3 sm:gap-8 my-auto relative">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border-2 border-slate-200 shadow-md flex items-center justify-center active:scale-90 transition-all shrink-0 z-10"
          aria-label="Huruf Sebelumnya"
        >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>

        {/* Center Stage Cards */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 max-w-full">
          {/* Big Tactile Letter Card */}
          <div
            onClick={handleCardTap}
            className={`w-36 h-48 sm:w-52 sm:h-64 md:w-60 md:h-72 rounded-3xl bg-white p-3 sm:p-5 flex flex-col items-center justify-between cursor-pointer border-4 transition-all shadow-lg relative ${
              isCardWiggling ? 'animate-wiggle' : 'hover:scale-[1.02]'
            }`}
            style={{
              borderColor: currentLetter.color,
              boxShadow: `0 16px 30px -10px ${currentLetter.color}40`,
            }}
            title="Ketuk untuk mendengar suara huruf!"
          >
            {/* Upper badge */}
            <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">Besar & Kecil</span>
              <Sparkles className="w-4 h-4" style={{ color: currentLetter.color }} />
            </div>

            {/* Letter Glyphs */}
            <div className="flex items-baseline justify-center gap-2 select-none my-auto">
              <span
                className="font-kids font-black text-6xl sm:text-8xl md:text-9xl leading-none"
                style={{ color: currentLetter.color }}
              >
                {currentLetter.letter}
              </span>
              <span
                className="font-kids font-bold text-4xl sm:text-5xl md:text-6xl text-slate-600"
              >
                {currentLetter.lowercase}
              </span>
            </div>

            {/* Tap instruction */}
            <div className="w-full text-center">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                Ketuk Huruf
              </span>
            </div>
          </div>

          {/* Word & Illustration Card */}
          {renderIllustration()}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border-2 border-slate-200 shadow-md flex items-center justify-center active:scale-90 transition-all shrink-0 z-10"
          aria-label="Huruf Selanjutnya"
        >
          <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Horizontal Letter Ribbon (A to Z) */}
      <div className="shrink-0 w-full bg-white/80 backdrop-blur-md rounded-2xl p-1.5 sm:p-2 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 justify-start md:justify-center">
          {ALPHABET_LIST.map((item) => {
            const isSelected = item.id === currentLetter.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playPop();
                  onSelectLetter(item);
                }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-kids font-bold text-sm sm:text-base shrink-0 transition-all flex items-center justify-center ${
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
                {item.letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tracing Canvas Overlay Modal */}
      {isTracingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full border-4 border-emerald-400 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <div>
                <h3 className="font-kids font-bold text-xl text-slate-800">
                  Tebalkan Huruf {currentLetter.letter}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Tarik garis dengan jari mengikuti bentuk huruf!
                </p>
              </div>
              <button
                onClick={clearCanvas}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                title="Hapus dan Ulangi"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Tracing Area */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 flex items-center justify-center overflow-hidden touch-none">
              {/* Background Guide Letter */}
              <span className="font-kids font-black text-9xl text-amber-200/70 select-none pointer-events-none">
                {currentLetter.letter}
              </span>

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                width={288}
                height={288}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />
            </div>

            {/* Modal Actions */}
            <div className="w-full flex items-center justify-between mt-4 gap-3">
              <button
                onClick={() => setIsTracingOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-kids font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={finishTracing}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-kids font-bold hover:bg-emerald-600 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 transition-all active:scale-95"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Selesai!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Friendly visual representation helper
function renderEmoji(letterId: string): string {
  const map: Record<string, string> = {
    a: '🍎',
    b: '🦆',
    c: '🍒',
    d: '🦖',
    e: '🦅',
    f: '🦩',
    g: '🐘',
    h: '🐯',
    i: '🐟',
    j: '🦒',
    k: '🐱',
    l: '🐬',
    m: '☀️',
    n: '🍍',
    o: '🦧',
    p: '🌈',
    q: '📖',
    r: '🦌',
    s: '🐄',
    t: '🐿️',
    u: '🦐',
    v: '🏺',
    w: '🥕',
    x: '🎶',
    y: '🪀',
    z: '🦓',
  };
  return map[letterId] || '⭐';
}
