export type AppMode = 'letters' | 'numbers' | 'quiz' | 'balloons' | 'song';

export interface LetterItem {
  id: string;
  letter: string;
  lowercase: string;
  word: string;
  phonics: string;
  category: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgLight: string;
  narration: string;
  funFact: string;
  iconType: string;
}

export interface NumberItem {
  number: number;
  word: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgLight: string;
  itemName: string;
  itemEmoji: string;
  narration: string;
  funFact: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  narration: string;
  type: 'letter' | 'number' | 'count';
  target: string | number;
  options: (string | number)[];
  itemEmoji?: string;
  countTarget?: number;
}
