import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { QuizQuestion } from '../types';
import { ALPHABET_LIST } from '../data/alphabetData';
import { NUMBERS_LIST } from '../data/numberData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import starRewardImg from '../assets/images/kids_reward_star_1791050166844.jpg';

interface QuizGameProps {
  onEarnStar: () => void;
  onUpdateSpeech: (text: string) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onEarnStar, onUpdateSpeech }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Generate random educational question
  const generateQuestion = (qNumber: number): QuizQuestion => {
    const questionType = Math.random();

    if (questionType < 0.35) {
      // Letter Quiz
      const randomItem = ALPHABET_LIST[Math.floor(Math.random() * ALPHABET_LIST.length)];
      const distractors = ALPHABET_LIST
        .filter((l) => l.id !== randomItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((l) => l.letter);
      const options = [randomItem.letter, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: qNumber,
        type: 'letter',
        question: `Manakah huruf "${randomItem.letter}" untuk ${randomItem.word}?`,
        narration: `Manakah huruf ${randomItem.letter}? ${randomItem.letter} untuk ${randomItem.word}!`,
        target: randomItem.letter,
        options,
      };
    } else if (questionType < 0.7) {
      // Number Quiz
      const randomNum = NUMBERS_LIST[Math.floor(Math.random() * NUMBERS_LIST.length)];
      const distractors = NUMBERS_LIST
        .filter((n) => n.number !== randomNum.number)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((n) => n.number);
      const options = [randomNum.number, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: qNumber,
        type: 'number',
        question: `Manakah yang merupakan angka ${randomNum.number} (${randomNum.word})?`,
        narration: `Ayo cari, manakah angka ${randomNum.number}? ${randomNum.word}!`,
        target: randomNum.number,
        options,
      };
    } else {
      // Count Objects Quiz
      const count = Math.floor(Math.random() * 6) + 1; // 1 to 6
      const fruits = ['🍎', '⭐', '🎈', '🐠', '🍓', '🧁'];
      const chosenEmoji = fruits[Math.floor(Math.random() * fruits.length)];
      const distractors = [count - 1, count + 1, count + 2].filter((n) => n > 0 && n !== count);
      const options = [count, ...distractors.slice(0, 2)].sort(() => 0.5 - Math.random());

      return {
        id: qNumber,
        type: 'count',
        question: `Ada berapa ${chosenEmoji} di dalam kotak? Ayo hitung!`,
        narration: `Ada berapa banyak di kotak? Ayo kita hitung bersama!`,
        target: count,
        options,
        itemEmoji: chosenEmoji,
        countTarget: count,
      };
    }
  };

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    const newQ = generateQuestion(questionCount + 1);
    setCurrentQuestion(newQ);
    setQuestionCount((prev) => prev + 1);
    onUpdateSpeech(newQ.narration);
    sound.speak(newQ.narration);
  };

  useEffect(() => {
    const firstQ = generateQuestion(1);
    setCurrentQuestion(firstQ);
    onUpdateSpeech(firstQ.narration);
    sound.speak(firstQ.narration);
  }, []);

  const handleSelectOption = (option: string | number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestion.target;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      sound.playSuccess();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
      });
      setCorrectAnswers((prev) => prev + 1);
      onEarnStar();

      const cheerWords = [
        'Hebat sekali! Jawabanmu benar!',
        'Luar biasa! Kamu pintar!',
        'Hore! Tepat sekali!',
      ];
      const randomCheer = cheerWords[Math.floor(Math.random() * cheerWords.length)];
      sound.speak(randomCheer);

      setTimeout(() => {
        loadNextQuestion();
      }, 1600);
    } else {
      sound.playGentleBoing();
      sound.speak('Hampir benar! Ayo coba sentuh pilihan yang lain ya!');
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      }, 1200);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full max-w-4xl mx-auto px-3 sm:px-6 py-2 overflow-hidden select-none">
      {/* Top Status */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/90 border border-amber-200 text-xs sm:text-sm font-bold text-amber-800 shadow-2xs">
            Pertanyaan #{questionCount}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <span>Benar:</span>
            <span className="text-emerald-600 font-kids text-sm">{correctAnswers}</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playDing(550);
            sound.speak(currentQuestion.narration);
          }}
          className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-kids font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-2xs"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Ulangi Pertanyaan</span>
        </button>
      </div>

      {/* Question Card Box */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-lg flex flex-col items-center justify-center my-auto relative">
        <h2 className="font-kids font-bold text-lg sm:text-2xl text-slate-800 text-center mb-3">
          {currentQuestion.question}
        </h2>

        {/* Visual for Counting Questions */}
        {currentQuestion.type === 'count' && currentQuestion.itemEmoji && currentQuestion.countTarget && (
          <div className="my-2 p-3 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 flex items-center justify-center gap-3 flex-wrap max-w-sm">
            {Array.from({ length: currentQuestion.countTarget }).map((_, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl animate-bounce">
                {currentQuestion.itemEmoji}
              </span>
            ))}
          </div>
        )}

        {/* Options Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full mt-4 max-w-lg">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            let btnStyle = 'bg-slate-50 hover:bg-white text-slate-800 border-2 border-slate-200';

            if (isSelected) {
              if (isAnswerCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105 shadow-lg';
              } else {
                btnStyle = 'bg-rose-500 text-white border-2 border-rose-600 scale-95';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={selectedAnswer !== null}
                className={`h-20 sm:h-24 rounded-2xl font-kids font-black text-3xl sm:text-4xl transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95 ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        <div className="h-6 mt-3 text-center">
          {isAnswerCorrect === true && (
            <span className="font-kids font-bold text-sm sm:text-base text-emerald-600 animate-pop">
              🎉 Hebat sekali! Jawabanmu benar!
            </span>
          )}
          {isAnswerCorrect === false && (
            <span className="font-kids font-bold text-sm sm:text-base text-rose-500 animate-wiggle">
              Ayo coba lagi, kamu pasti bisa!
            </span>
          )}
        </div>
      </div>

      {/* Skip / Next Button */}
      <div className="shrink-0 flex justify-center mt-2">
        <button
          onClick={loadNextQuestion}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-kids text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ganti Pertanyaan Lain</span>
        </button>
      </div>
    </div>
  );
};
