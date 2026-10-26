import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, HelpCircle, Volume2, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FrogProblem, Difficulty } from '../../types/math';
import { generateFrogProblem } from '../../utils/mathGenerators';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { VisualHintModal } from '../common/VisualHintModal';

interface FrogGameProps {
  onBack: () => void;
  onEarnStars: (count: number, score: number) => void;
}

export const FrogGame: React.FC<FrogGameProps> = ({ onBack, onEarnStars }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [problem, setProblem] = useState<FrogProblem | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 5 steps to cross river
  const [isHopping, setIsHopping] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasCrossed, setHasCrossed] = useState<boolean>(false);

  const TOTAL_STEPS = 5;

  const loadNewProblem = useCallback((diff: Difficulty) => {
    const p = generateFrogProblem(diff);
    setProblem(p);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsHopping(false);
  }, []);

  useEffect(() => {
    loadNewProblem(difficulty);
  }, [difficulty, loadNewProblem]);

  const handleSpeak = () => {
    if (!problem) return;
    const opWord = problem.operator === '×' ? 'nhân' : 'chia';
    speech.speak(`${problem.a} ${opWord} ${problem.b} bằng bao nhiêu? Bé hãy giúp chú ếch nhảy sang lá sen đúng nhé!`);
  };

  const handleSelectLilyPad = (answer: number) => {
    if (!problem || feedback !== null || hasCrossed) return;
    setSelectedAnswer(answer);

    if (answer === problem.correctAnswer) {
      sound.playHop();
      setIsHopping(true);
      setFeedback('correct');

      const nextStep = currentStep + 1;
      const newScore = score + 15;
      setScore(newScore);

      setTimeout(() => {
        sound.playCorrect();
        setCurrentStep(nextStep);

        if (nextStep >= TOTAL_STEPS) {
          // Cross completed!
          setHasCrossed(true);
          sound.playWin();
          onEarnStars(5, newScore);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          onEarnStars(2, newScore);
          loadNewProblem(difficulty);
        }
      }, 500);
    } else {
      sound.playWrong();
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 900);
    }
  };

  const handleResetCross = () => {
    sound.playPop();
    setCurrentStep(0);
    setHasCrossed(false);
    loadNewProblem(difficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 hover:bg-emerald-100 text-emerald-900 rounded-xl transition-colors"
            title="Quay lại danh sách trò chơi"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🐸 Chú Ếch Nhảy Qua Sông</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Bảng nhân & chia 2, 5
              </span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Bước nhảy: <strong className="text-emerald-700 font-number">{currentStep}/{TOTAL_STEPS}</strong></span>
              <span>·</span>
              <span>Điểm: <strong className="text-amber-600 font-number">{score}</strong></span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold">
          <button
            onClick={() => { sound.playPop(); setDifficulty('easy'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'easy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Bảng Nhân 2 & 5
          </button>
          <button
            onClick={() => { sound.playPop(); setDifficulty('medium'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'medium' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Nhân & Chia Kết Hợp
          </button>
        </div>
      </div>

      {/* Main Pond Arena */}
      <div className="relative bg-gradient-to-b from-cyan-400 via-sky-400 to-blue-500 rounded-3xl border-4 border-emerald-300 p-6 md:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between shadow-md">
        
        {/* Animated Water Ripples and Water Lilies */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-4 border-white animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border-4 border-white animate-ping" style={{ animationDuration: '6s' }} />
        </div>

        {/* River banks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-r-2xl border-r-4 border-emerald-700 shadow-md flex flex-col items-center justify-around py-4">
          <span className="text-xl">🌿</span>
          <span className="text-xl">🌾</span>
          <span className="text-xl">🌸</span>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-emerald-600 to-emerald-500 rounded-l-2xl border-l-4 border-emerald-700 shadow-md flex flex-col items-center justify-around py-4">
          <span className="text-xl">🎁</span>
          <span className="text-xl">🌸</span>
          <span className="text-xl">🌺</span>
        </div>

        {/* Top Controls: Speech button & Hint */}
        <div className="relative z-10 flex items-center justify-between pl-8 md:pl-16 pr-8 md:pr-16">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl font-bold text-xs shadow-xs border border-sky-200 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Nghe phép tính</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setShowHint(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span>Xem hình minh họa</span>
          </button>
        </div>

        {/* Stepping Path Indicator */}
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 my-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold font-number border-2 transition-all ${
                idx < currentStep
                  ? 'bg-emerald-400 border-white text-white shadow-xs'
                  : idx === currentStep
                  ? 'bg-amber-300 border-amber-500 text-amber-950 scale-110 ring-4 ring-amber-300/60'
                  : 'bg-white/40 border-white/60 text-white'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
          ))}
          <div className="text-2xl ml-2">🏁</div>
        </div>

        {/* Center: Question Prompt */}
        {!hasCrossed && problem && (
          <div className="relative z-10 flex flex-col items-center justify-center my-4">
            
            {/* The Math Lotus Card */}
            <div className="bg-white/95 backdrop-blur-md px-8 py-5 rounded-3xl border-4 border-emerald-400 shadow-xl text-center flex flex-col items-center animate-float max-w-sm">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-1">
                Giúp ếch nhảy bước {currentStep + 1}:
              </span>
              <div className="text-4xl md:text-5xl font-extrabold text-slate-800 font-number tracking-tight">
                {problem.a} {problem.operator} {problem.b} = ?
              </div>
              <span className="text-xs text-slate-500 mt-1 font-semibold">
                {problem.visualPrompt}
              </span>
            </div>

            {/* The Cute Frog Mascot */}
            <div className={`mt-3 text-5xl transition-all duration-300 ${isHopping ? 'animate-hop' : 'animate-float'}`}>
              🐸
            </div>
          </div>
        )}

        {/* Victory Screen when crossing river */}
        {hasCrossed && (
          <div className="relative z-10 p-6 bg-white/95 rounded-3xl border-4 border-amber-400 text-center max-w-md mx-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-2 animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-amber-950">Hoan Hô Bé Yêu!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Chú ếch đã qua sông an toàn và mở được Rương Kho Báu Toán Học!
            </p>
            <div className="my-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 font-bold text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Thưởng lớn: +5 Ngôi Sao Vàng!</span>
            </div>

            <button
              onClick={handleResetCross}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tiếp tục đưa ếch qua sông mới</span>
            </button>
          </div>
        )}

        {/* Lily pads with answers */}
        {!hasCrossed && (
          <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-6 max-w-lg mx-auto w-full">
            {problem?.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectPad = isSelected && feedback === 'correct';
              const isWrongPad = isSelected && feedback === 'wrong';

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleSelectLilyPad(option)}
                  className={`group relative p-3 md:p-4 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border-4 ${
                    isCorrectPad
                      ? 'bg-emerald-300 border-white scale-110 shadow-lg'
                      : isWrongPad
                      ? 'bg-rose-200 border-rose-400 animate-wiggle'
                      : 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-300 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Lotus Leaf SVG Graphic */}
                  <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                    🪷
                  </div>

                  {/* Leaf Number */}
                  <span className="text-2xl md:text-3xl font-extrabold font-number mt-1 text-white drop-shadow-xs">
                    {option}
                  </span>

                  <span className="text-[11px] text-emerald-100 font-semibold mt-0.5">
                    {isCorrectPad ? 'Tung tưng! 🐸' : isWrongPad ? 'Sai rồi' : 'Lá sen này'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Visual Hint Modal for Multiplication & Division */}
      {problem && (
        <VisualHintModal
          isOpen={showHint}
          onClose={() => setShowHint(false)}
          title={`Minh họa phép tính: ${problem.a} ${problem.operator} ${problem.b}`}
          explanation={problem.visualPrompt}
          customVisual={
            <div className="space-y-3 text-center">
              <div className="text-xs font-bold text-amber-800">Mô hình trực quan:</div>
              {problem.operator === '×' ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: problem.b }).map((_, groupIdx) => (
                    <div key={groupIdx} className="p-2 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-1">
                      {Array.from({ length: problem.a }).map((_, dotIdx) => (
                        <div key={dotIdx} className="w-3.5 h-3.5 rounded-full bg-emerald-600 shadow-xs" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-sky-100 rounded-xl border border-sky-300">
                  <div className="text-xs text-sky-900 font-semibold">
                    Chia {problem.a} viên kẹo thành {problem.b} nhóm đều nhau:
                  </div>
                  <div className="text-sm font-bold text-sky-800 mt-1">
                    Mỗi nhóm có {problem.correctAnswer} viên kẹo 🍬
                  </div>
                </div>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};
