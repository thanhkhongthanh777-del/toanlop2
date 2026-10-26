import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, HelpCircle, Volume2, ArrowLeft, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppleProblem, Difficulty } from '../../types/math';
import { generateAppleProblem } from '../../utils/mathGenerators';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { VisualHintModal } from '../common/VisualHintModal';

interface AppleGameProps {
  onBack: () => void;
  onEarnStars: (count: number, score: number) => void;
}

export const AppleGame: React.FC<AppleGameProps> = ({ onBack, onEarnStars }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [problem, setProblem] = useState<AppleProblem | null>(null);
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [applesHarvested, setApplesHarvested] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [dropping, setDropping] = useState<boolean>(false);

  const loadNewProblem = useCallback((diff: Difficulty) => {
    const p = generateAppleProblem(diff);
    setProblem(p);
    setSelectedBasket(null);
    setIsCorrect(null);
    setDropping(false);
  }, []);

  useEffect(() => {
    loadNewProblem(difficulty);
  }, [difficulty, loadNewProblem]);

  const handleSpeak = () => {
    if (!problem) return;
    const opWord = problem.operator === '+' ? 'cộng' : 'trừ';
    speech.speak(`${problem.num1} ${opWord} ${problem.num2} bằng bao nhiêu? Bé hãy chọn giỏ đúng nhé!`);
  };

  const handleBasketSelect = (answer: number) => {
    if (!problem || isCorrect !== null) return;
    setSelectedBasket(answer);

    if (answer === problem.correctAnswer) {
      sound.playHop();
      setDropping(true);

      setTimeout(() => {
        sound.playCorrect();
        setIsCorrect(true);
        const earned = difficulty === 'hard' ? 3 : 2;
        const newScore = score + 10;
        setScore(newScore);
        setApplesHarvested(h => h + 1);
        onEarnStars(earned, newScore);

        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 }
        });

        setTimeout(() => {
          loadNewProblem(difficulty);
        }, 1200);
      }, 500);
    } else {
      sound.playWrong();
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedBasket(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Game Header Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 hover:bg-amber-100 text-amber-900 rounded-xl transition-colors"
            title="Quay lại danh sách trò chơi"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🍎 Vườn Táo Phép Tính</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Cộng & Trừ có nhớ
              </span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Đã hái: <strong className="text-rose-600 font-number">{applesHarvested}</strong> trái táo</span>
              <span>·</span>
              <span>Điểm: <strong className="text-amber-600 font-number">{score}</strong></span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 p-1 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold">
          <button
            onClick={() => { sound.playPop(); setDifficulty('easy'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'easy' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            Phạm vi 20
          </button>
          <button
            onClick={() => { sound.playPop(); setDifficulty('medium'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'medium' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            Có Nhớ (100)
          </button>
          <button
            onClick={() => { sound.playPop(); setDifficulty('hard'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'hard' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            Đến 1000
          </button>
        </div>
      </div>

      {/* Main Play Arena */}
      <div className="relative bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 rounded-3xl border-4 border-emerald-300 p-6 md:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between shadow-md">
        
        {/* Background Whimsical Garden Clouds and Trees SVG */}
        <div className="absolute top-2 left-6 text-white/70 text-4xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-4 right-12 text-white/70 text-5xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-2 right-4 text-amber-400 text-3xl select-none pointer-events-none animate-spin" style={{ animationDuration: '30s' }}>☀️</div>

        {/* Top Controls: Speech button & Hint button */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl font-bold text-xs shadow-xs border border-amber-200 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Nghe câu hỏi</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setShowHint(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span>Gợi ý que tính</span>
          </button>
        </div>

        {/* Tree & Hanging Apple */}
        <div className="relative z-10 my-4 flex flex-col items-center justify-center">
          
          {/* Tree Canopy SVG */}
          <div className="relative flex items-center justify-center">
            <svg className="w-72 md:w-96 h-48 drop-shadow-md" viewBox="0 0 300 160" fill="none">
              <path d="M40 120 C 10 90 20 40 70 30 C 90 10 160 5 190 30 C 230 10 280 40 270 90 C 290 120 260 150 210 150 C 180 160 120 160 90 150 C 50 150 30 140 40 120 Z" fill="#22C55E" />
              <path d="M60 110 C 35 85 45 45 85 35 C 105 20 165 15 190 35 C 220 20 260 45 250 85 C 265 110 240 135 200 135 C 170 145 120 145 95 135 C 65 135 50 125 60 110 Z" fill="#16A34A" />
              {/* Tree trunk */}
              <path d="M135 140 L135 160 L165 160 L165 140 Z" fill="#854D0E" />
            </svg>

            {/* The Big Math Apple */}
            {problem && (
              <div 
                className={`absolute top-12 flex flex-col items-center cursor-pointer transition-all duration-500 ${
                  dropping ? 'translate-y-48 scale-90 opacity-90' : 'animate-float'
                }`}
              >
                {/* Apple Stem & Leaf */}
                <div className="w-3 h-4 border-r-2 border-emerald-900 rounded-tr-md -mb-1" />
                
                {/* Apple Body */}
                <div className="relative px-6 py-4 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 border-2 border-red-700 text-white shadow-lg flex items-center justify-center flex-col min-w-[140px] md:min-w-[180px]">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-rose-100">
                    Hái quả táo:
                  </span>
                  <div className="text-3xl md:text-4xl font-extrabold font-number tracking-tight mt-0.5">
                    {problem.num1} {problem.operator} {problem.num2}
                  </div>
                  <span className="text-[11px] text-rose-200 mt-1 font-medium">
                    = ?
                  </span>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs font-bold text-emerald-900 mt-4 bg-emerald-200/80 px-3 py-1 rounded-full">
            👇 Bé hãy chọn chiếc giỏ có kết quả đúng để đón trái táo rơi xuống nhé!
          </p>
        </div>

        {/* 3 Baskets for Choices */}
        <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-6 max-w-lg mx-auto w-full">
          {problem?.options.map((option, idx) => {
            const isThisSelected = selectedBasket === option;
            const isThisCorrect = isThisSelected && isCorrect === true;
            const isThisWrong = isThisSelected && isCorrect === false;

            return (
              <button
                key={idx}
                disabled={isCorrect !== null}
                onClick={() => handleBasketSelect(option)}
                className={`group relative p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border-2 ${
                  isThisCorrect
                    ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-md'
                    : isThisWrong
                    ? 'bg-rose-100 border-rose-500 animate-wiggle'
                    : 'bg-white hover:bg-amber-50 border-amber-300 hover:border-amber-500 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Basket Icon */}
                <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                  🧺
                </div>

                {/* Option Value */}
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 font-number mt-1">
                  {option}
                </span>

                <span className="text-[11px] text-slate-500 font-medium">
                  {isThisCorrect ? 'Chính xác! 🎉' : isThisWrong ? 'Thử lại nhé' : 'Chọn giỏ này'}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Visual Hint Modal */}
      {problem && (
        <VisualHintModal
          isOpen={showHint}
          onClose={() => setShowHint(false)}
          title={`Gợi ý giải phép tính: ${problem.num1} ${problem.operator} ${problem.num2}`}
          explanation={problem.hint.explanation}
          tens1={problem.hint.tens1}
          ones1={problem.hint.ones1}
          tens2={problem.hint.tens2}
          ones2={problem.hint.ones2}
          operator={problem.operator}
        />
      )}
    </div>
  );
};
