import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Timer, Zap, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface SpeedChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinished: (score: number, starsEarned: number) => void;
  bestScore: number;
}

interface QuickProblem {
  question: string;
  answer: number;
  options: number[];
}

function generateQuickProblem(): QuickProblem {
  const type = Math.floor(Math.random() * 4);
  let question = '';
  let answer = 0;

  if (type === 0) {
    // Addition with carry or simple
    const a = Math.floor(Math.random() * 40) + 12;
    const b = Math.floor(Math.random() * 25) + 6;
    question = `${a} + ${b} = ?`;
    answer = a + b;
  } else if (type === 1) {
    // Subtraction
    const a = Math.floor(Math.random() * 50) + 25;
    const b = Math.floor(Math.random() * 20) + 5;
    question = `${a} - ${b} = ?`;
    answer = a - b;
  } else if (type === 2) {
    // Table 2 or 5
    const base = Math.random() > 0.5 ? 2 : 5;
    const mult = Math.floor(Math.random() * 9) + 2;
    question = `${base} × ${mult} = ?`;
    answer = base * mult;
  } else {
    // Division 2 or 5
    const base = Math.random() > 0.5 ? 2 : 5;
    const quotient = Math.floor(Math.random() * 9) + 1;
    const dividend = base * quotient;
    question = `${dividend} : ${base} = ?`;
    answer = quotient;
  }

  const wrong1 = answer + (Math.random() > 0.5 ? 2 : -2);
  const wrong2 = answer + (Math.random() > 0.5 ? 10 : -10);
  const options = [answer, wrong1 > 0 ? wrong1 : answer + 3, wrong2 > 0 ? wrong2 : answer + 7].sort(() => Math.random() - 0.5);

  return { question, answer, options };
}

export const SpeedChallengeModal: React.FC<SpeedChallengeModalProps> = ({
  isOpen,
  onClose,
  onFinished,
  bestScore
}) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [problem, setProblem] = useState<QuickProblem | null>(null);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<number | null>(null);

  const nextProblem = useCallback(() => {
    setProblem(generateQuickProblem());
  }, []);

  const handleStart = () => {
    sound.playPop();
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameState('playing');
    setLastResult(null);
    nextProblem();
  };

  const handleEnd = useCallback((finalScore: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('ended');
    const starsEarned = Math.max(3, Math.floor(finalScore / 10));
    sound.playWin();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onFinished(finalScore, starsEarned);
  }, [onFinished]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleEnd(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score, handleEnd]);

  if (!isOpen) return null;

  const handleAnswer = (choice: number) => {
    if (!problem || gameState !== 'playing') return;

    if (choice === problem.answer) {
      sound.playCorrect();
      const points = 10 + streak * 2;
      setScore(s => s + points);
      setStreak(st => st + 1);
      setLastResult('correct');
      nextProblem();
    } else {
      sound.playWrong();
      setStreak(0);
      setLastResult('wrong');
      // small shake feedback
      setTimeout(() => setLastResult(null), 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-rose-300 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Vua Tính Nhẩm 60 Giây</h2>
              <div className="text-xs text-rose-100">
                Kỷ lục của bé: <span className="font-bold font-number">{bestScore} điểm</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              if (timerRef.current) clearInterval(timerRef.current);
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="Thoát thử thách"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ready Screen */}
        {gameState === 'ready' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-5xl shadow-inner animate-float">
              🚀
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Sẵn Sàng Đua Tốc Độ!</h3>
              <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                Bé có 60 giây để trả lời thật nhiều câu hỏi cộng, trừ, nhân và chia lớp 2. Trả lời đúng liên tiếp sẽ được nhân thêm điểm thưởng!
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Bắt Đầu Ngay Nào! 🔥
            </button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === 'playing' && problem && (
          <div className="p-6 space-y-6">
            {/* Status Bars */}
            <div className="flex items-center justify-between bg-rose-50 p-3 rounded-2xl border border-rose-200">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <Timer className="w-5 h-5" />
                <span className="font-number text-lg">{timeLeft}s</span>
              </div>

              <div className="flex items-center gap-1 font-bold text-slate-800">
                <span className="text-xs text-slate-500">Điểm:</span>
                <span className="text-lg font-number text-orange-600">{score}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Chuỗi {streak}</span>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className={`p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50/50 border-2 text-center transition-all ${
              lastResult === 'wrong' ? 'border-rose-400 animate-wiggle' : 'border-amber-200'
            }`}>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2">
                Tính nhẩm nhanh:
              </span>
              <div className="text-4xl md:text-5xl font-extrabold text-slate-800 font-number">
                {problem.question}
              </div>
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-3 gap-3">
              {problem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="py-4 bg-white hover:bg-amber-100 border-2 border-slate-200 hover:border-amber-400 rounded-2xl text-2xl font-extrabold text-slate-800 font-number shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ended Screen */}
        {gameState === 'ended' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-inner">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-800">Tuyệt Vời Lắm Bé Yêu!</h3>
              <p className="text-xs text-slate-500 mt-1">Hết thời gian thử thách 60 giây</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-xs text-slate-500">Điểm số đạt được:</span>
                <div className="text-3xl font-extrabold text-rose-600 font-number">{score}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Thưởng Sao Vàng:</span>
                <div className="text-3xl font-extrabold text-amber-500 font-number flex items-center justify-center gap-1">
                  <span>+{Math.max(3, Math.floor(score / 10))}</span>
                  <Sparkles className="w-5 h-5 fill-amber-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại Lần Nữa</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl font-bold text-sm transition-colors"
              >
                Xong
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
