import React, { useState, useEffect } from 'react';
import { AppMode, LetterItem, NumberItem } from './types';
import { ALPHABET_LIST } from './data/alphabetData';
import { NUMBERS_LIST } from './data/numberData';
import { Header } from './components/Header';
import { MascotBoni } from './components/MascotBoni';
import { LetterExplorer } from './components/LetterExplorer';
import { NumberExplorer } from './components/NumberExplorer';
import { QuizGame } from './components/QuizGame';
import { BalloonPopGame } from './components/BalloonPopGame';
import { SongSingAlong } from './components/SongSingAlong';
import { sound } from './utils/audio';
import playgroundBg from './assets/images/kids_playground_bg_1791050155143.jpg';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('letters');
  const [currentLetter, setCurrentLetter] = useState<LetterItem>(ALPHABET_LIST[0]);
  const [currentNumber, setCurrentNumber] = useState<NumberItem>(NUMBERS_LIST[1]); // starts with 1
  const [stars, setStars] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Halo teman-teman! Selamat datang di Petualangan Ceria! Ayo kita belajar huruf dan angka bersama!'
  );

  // Play introductory friendly greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      sound.speak(
        'Halo adik-adik manis! Ayo bermain dan belajar mengenal huruf dan angka bersama Boni!'
      );
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectMode = (mode: AppMode) => {
    sound.playPop();
    setCurrentMode(mode);

    if (mode === 'letters') {
      const speech = `Mari belajar huruf ${currentLetter.letter}! A sampai Z sangat menyenangkan!`;
      setMascotSpeech(speech);
      sound.speak(speech);
    } else if (mode === 'numbers') {
      const speech = `Sekarang kita menjelajah dunia angka! Angka ${currentNumber.number} (${currentNumber.word})!`;
      setMascotSpeech(speech);
      sound.speak(speech);
    } else if (mode === 'quiz') {
      const speech = 'Saatnya Tebak Ceria! Jawab pertanyaannya dan kumpulkan bintang emas!';
      setMascotSpeech(speech);
      sound.speak(speech);
    } else if (mode === 'balloons') {
      const speech = 'Ayo pecahkan balon warna-warni yang melayang di langit!';
      setMascotSpeech(speech);
      sound.speak(speech);
    } else if (mode === 'song') {
      const speech = 'Ayo kita bernyanyi bersama dengan gembira!';
      setMascotSpeech(speech);
      sound.speak(speech);
    }
  };

  const handleEarnStar = () => {
    setStars((prev) => prev + 1);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (nextMuted && isBgmPlaying) {
      setIsBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    if (isMuted) {
      setIsMuted(false);
      sound.setMuted(false);
    }
    const playing = sound.toggleBgm();
    setIsBgmPlaying(playing);
  };

  const handleRepeatSpeech = () => {
    sound.speak(mascotSpeech);
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col justify-between relative bg-sky-100 select-none">
      {/* Cartoon Landscape Background with Soft Scrim */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={playgroundBg}
          alt="Latar Belakang Ceria"
          className="w-full h-full object-cover opacity-25 filter blur-xs"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-amber-50/50 to-emerald-50/70"></div>
      </div>

      {/* Top Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        stars={stars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Interactive Stage (Flex-1 and strictly overflow-hidden) */}
      <main className="flex-1 flex flex-col justify-between w-full h-[calc(100%-8rem)] overflow-hidden relative z-10 py-1">
        {currentMode === 'letters' && (
          <LetterExplorer
            currentLetter={currentLetter}
            onSelectLetter={(letter) => setCurrentLetter(letter)}
            onLetterLearned={handleEarnStar}
            onUpdateSpeech={setMascotSpeech}
          />
        )}

        {currentMode === 'numbers' && (
          <NumberExplorer
            currentNumber={currentNumber}
            onSelectNumber={(num) => setCurrentNumber(num)}
            onNumberLearned={handleEarnStar}
            onUpdateSpeech={setMascotSpeech}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizGame
            onEarnStar={handleEarnStar}
            onUpdateSpeech={setMascotSpeech}
          />
        )}

        {currentMode === 'balloons' && (
          <BalloonPopGame
            onEarnStar={handleEarnStar}
            onUpdateSpeech={setMascotSpeech}
          />
        )}

        {currentMode === 'song' && (
          <SongSingAlong
            onUpdateSpeech={setMascotSpeech}
          />
        )}
      </main>

      {/* Bottom Mascot Bar with Speech Bubble & Voice Replay */}
      <footer className="shrink-0 bg-white/80 backdrop-blur-md border-t border-amber-200/60 shadow-xs z-20">
        <MascotBoni
          speechText={mascotSpeech}
          onRepeatSpeech={handleRepeatSpeech}
        />
      </footer>
    </div>
  );
}
