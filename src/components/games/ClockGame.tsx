import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, Sparkles, HelpCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClockProblem } from '../../types/math';
import { generateClockProblem } from '../../utils/mathGenerators';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { VisualHintModal } from '../common/VisualHintModal';

interface ClockGameProps {
  onBack: () => void;
  onEarnStars: (count: number, score: number) => void;
}

export const ClockGame: React.FC<ClockGameProps> = ({ onBack, onEarnStars }) => {
  const [problem, setProblem] = useState<ClockProblem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const loadNewProblem = useCallback(() => {
    const p = generateClockProblem();
    setProblem(p);
    setSelectedOption(null);
    setResult(null);
  }, []);

  useEffect(() => {
    loadNewProblem();
  }, [loadNewProblem]);

  const handleSpeak = () => {
    if (!problem) return;
    speech.speak(`${problem.question}. Đồng hồ đang chỉ mấy giờ?`);
  };

  const handleSelectAnswer = (ans: string) => {
    if (!problem || result !== null) return;
    setSelectedOption(ans);

    if (ans === problem.correctAnswer) {
      sound.playCorrect();
      setResult('correct');
      const newScore = score + 10;
      setScore(newScore);
      setCorrectCount(c => c + 1);
      onEarnStars(2, newScore);

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 }
      });

      setTimeout(() => {
        loadNewProblem();
      }, 1300);
    } else {
      sound.playWrong();
      setResult('wrong');
      setTimeout(() => {
        setResult(null);
        setSelectedOption(null);
      }, 1000);
    }
  };

  // Calculate hand angles:
  // Minute hand: 360 deg / 60 mins = 6 deg/min
  // Hour hand: 360 deg / 12 hrs = 30 deg/hr + (minutes / 60) * 30
  const minuteAngle = problem ? problem.minutes * 6 : 0;
  const hourAngle = problem ? (problem.hours % 12) * 30 + (problem.minutes / 60) * 30 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-indigo-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 hover:bg-indigo-100 text-indigo-900 rounded-xl transition-colors"
            title="Quay lại danh sách trò chơi"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>⏰ Thám Tử Thời Gian</span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                Xem giờ đúng & giờ rưỡi
              </span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Câu đúng: <strong className="text-indigo-700 font-number">{correctCount}</strong></span>
              <span>·</span>
              <span>Điểm: <strong className="text-amber-600 font-number">{score}</strong></span>
            </div>
          </div>
        </div>

        {/* Period Badge */}
        {problem && (
          <div className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs font-bold text-indigo-800 flex items-center gap-1.5">
            <span>{problem.periodName === 'buổi sáng' ? '☀️' : problem.periodName === 'buổi trưa' ? '🌤️' : problem.periodName === 'buổi chiều' ? '🌅' : '🌙'}</span>
            <span className="capitalize">{problem.periodName}</span>
          </div>
        )}
      </div>

      {/* Main Play Arena */}
      <div className="relative bg-gradient-to-b from-indigo-50 via-sky-50 to-purple-50 rounded-3xl border-4 border-indigo-300 p-6 md:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between shadow-md">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-xl font-bold text-xs shadow-xs border border-indigo-200 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
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
            <span>Gợi ý xem đồng hồ</span>
          </button>
        </div>

        {/* Scenario & Clock visual */}
        {problem && (
          <div className="my-4 flex flex-col items-center">
            
            {/* Story prompt */}
            <div className="bg-white/90 backdrop-blur-xs px-6 py-3 rounded-2xl border border-indigo-200 shadow-xs text-center max-w-md mb-6">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Thử tài thám tử nhí:
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {problem.question}
              </p>
            </div>

            {/* Analog Clock Face SVG */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-white border-8 border-indigo-500 shadow-2xl flex items-center justify-center">
              
              {/* Clock Center Pin */}
              <div className="absolute w-4 h-4 rounded-full bg-indigo-900 border-2 border-white z-30 shadow-xs" />

              {/* Hour Numbers 1 to 12 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                const angle = (num * 30 - 90) * (Math.PI / 180);
                const radius = 90; // distance from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={num}
                    className="absolute text-sm md:text-base font-extrabold text-indigo-950 font-number select-none"
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                  >
                    {num}
                  </div>
                );
              })}

              {/* Hour Hand (Short & Thick) */}
              <div
                className="absolute w-2 h-16 bg-slate-900 rounded-full origin-bottom shadow-md z-10 transition-transform duration-500"
                style={{
                  bottom: '50%',
                  transform: `rotate(${hourAngle}deg)`
                }}
              />

              {/* Minute Hand (Long & Blue) */}
              <div
                className="absolute w-1.5 h-24 bg-rose-500 rounded-full origin-bottom shadow-md z-20 transition-transform duration-500"
                style={{
                  bottom: '50%',
                  transform: `rotate(${minuteAngle}deg)`
                }}
              />
            </div>

            <p className="text-xs font-bold text-indigo-900 mt-6 bg-indigo-100 px-4 py-1.5 rounded-full">
              Đồng hồ đang chỉ mấy giờ? Bé hãy chọn đáp án đúng bên dưới nhé:
            </p>
          </div>
        )}

        {/* 3 Answer choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto w-full">
          {problem?.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = isSelected && result === 'correct';
            const isWrong = isSelected && result === 'wrong';

            return (
              <button
                key={idx}
                disabled={result !== null}
                onClick={() => {
                  sound.playPop();
                  handleSelectAnswer(opt);
                }}
                className={`py-3.5 px-4 rounded-2xl font-bold text-sm transition-all duration-200 border-2 active:scale-95 text-center ${
                  isCorrect
                    ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md'
                    : isWrong
                    ? 'bg-rose-500 border-rose-600 text-white animate-wiggle'
                    : 'bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                <span>{opt}</span>
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
          title="Bí kíp xem đồng hồ lớp 2"
          explanation={`1. Kim ngắn chỉ giờ: Kim ngắn đang chỉ gần hoặc đúng số ${problem.hours}.\n2. Kim dài chỉ phút: Mỗi số cách nhau 5 phút. Khi kim dài chỉ vào số 12 là đúng giờ, chỉ số 6 là 30 phút (giờ rưỡi), chỉ số 3 là 15 phút.\n\nKết quả đúng: ${problem.correctAnswer}`}
        />
      )}
    </div>
  );
};
