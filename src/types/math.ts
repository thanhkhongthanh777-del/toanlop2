export type GameId = 'apple' | 'frog' | 'scale' | 'clock' | 'geometry' | 'speed';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Sticker {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  starsRequired: number;
  category: 'animals' | 'trophy' | 'space' | 'magic';
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  stars: number;
  unlockedStickers: string[];
  highScores: {
    apple: number;
    frog: number;
    scale: number;
    clock: number;
    geometry: number;
    speed: number;
  };
  totalSolved: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
}

export interface AppleProblem {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-';
  correctAnswer: number;
  options: number[];
  hint: {
    tens1: number;
    ones1: number;
    tens2: number;
    ones2: number;
    explanation: string;
  };
}

export interface FrogProblem {
  id: string;
  a: number;
  b: number;
  operator: '×' | ':';
  correctAnswer: number;
  options: number[];
  visualPrompt: string;
}

export interface ScaleProblem {
  id: string;
  leftValue: number;
  leftText: string;
  rightValue: number;
  rightText: string;
  correctOperator: '>' | '<' | '=';
  leftBreakdown?: { hundreds: number; tens: number; ones: number };
  rightBreakdown?: { hundreds: number; tens: number; ones: number };
}

export interface ClockProblem {
  id: string;
  hours: number;
  minutes: number;
  timeString: string;
  periodName: 'buổi sáng' | 'buổi trưa' | 'buổi chiều' | 'buổi tối';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeometryProblem {
  id: string;
  type: 'measure' | 'shape';
  question: string;
  objectName?: string;
  actualLengthCm?: number;
  shapeName?: string;
  sides?: number;
  vertices?: number;
  options: (string | number)[];
  correctAnswer: string | number;
  unit?: string;
}
