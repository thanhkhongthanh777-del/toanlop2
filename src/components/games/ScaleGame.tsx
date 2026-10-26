import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScaleProblem, Difficulty } from '../../types/math';
import { generateScaleProblem } from '../../utils/mathGenerators';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { VisualHintModal } from '../common/VisualHintModal';

interface ScaleGameProps {
  onBack: () => void;
  onEarnStars: (count: number, score: number) => void;
}

export const ScaleGame: React.FC<ScaleGameProps> = ({ onBack, onEarnStars }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [problem, setProblem] = useState<ScaleProblem | null>(null);
  const [selectedOp, setSelectedOp] = useState<'>' | '<' | '=' | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const loadNewProblem = useCallback((diff: Difficulty) => {
    const p = generateScaleProblem(diff);
    setProblem(p);
    setSelectedOp(null);
    setResult(null);
  }, []);

  useEffect(() => {
    loadNewProblem(difficulty);
  }, [difficulty, loadNewProblem]);

  const handleSpeak = () => {
    if (!problem) return;
    speech.speak(`So sánh: ${problem.leftText} và ${problem.rightText}. Bên nào lớn hơn hay bằng nhau? Bé hãy chọn dấu nhé!`);
  };

  const handleSelectOp = (op: '>' | '<' | '=') => {
    if (!problem || result !== null) return;
    setSelectedOp(op);

    if (op === problem.correctOperator) {
      sound.playCorrect();
      setResult('correct');
      const newScore = score + 10;
      setScore(newScore);
      setCorrectCount(c => c + 1);
      onEarnStars(2, newScore);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });

      setTimeout(() => {
        loadNewProblem(difficulty);
      }, 1300);
    } else {
      sound.playWrong();
      setResult('wrong');
      setTimeout(() => {
        setResult(null);
        setSelectedOp(null);
      }, 1000);
    }
  };

  // Determine physical scale tilt rotation
  let tiltAngle = 0;
  if (problem) {
    if (problem.leftValue > problem.rightValue) tiltAngle = -6;
    else if (problem.leftValue < problem.rightValue) tiltAngle = 6;
  }

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
              <span>⚖️ Chiếc Cân Kỳ Diệu</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                So sánh số đến 1000
              </span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Số câu đúng: <strong className="text-amber-700 font-number">{correctCount}</strong></span>
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
            Phạm vi 100
          </button>
          <button
            onClick={() => { sound.playPop(); setDifficulty('medium'); }}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              difficulty === 'medium' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            Phạm vi 1000
          </button>
        </div>
      </div>

      {/* Main Scale Arena */}
      <div className="relative bg-gradient-to-b from-amber-50 via-orange-50/50 to-yellow-100 rounded-3xl border-4 border-amber-300 p-6 md:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between shadow-md">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-xl font-bold text-xs shadow-xs border border-amber-200 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Nghe đề bài</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setShowHint(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span>Xem cấu tạo số</span>
          </button>
        </div>

        {/* Balance Scale Centerpiece */}
        {problem && (
          <div className="my-6 flex flex-col items-center">
            
            {/* Scale Arm & Pans */}
            <div 
              className="relative w-full max-w-lg transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${tiltAngle}deg)` }}
            >
              {/* Central Pivot Fulcrum */}
              <div className="w-full h-3 bg-amber-700 rounded-full shadow-sm" />

              {/* Left Pan */}
              <div className="absolute -top-12 left-4 md:left-8 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-amber-600" />
                <div className="px-5 py-4 bg-white rounded-2xl border-2 border-amber-400 shadow-lg text-center min-w-[130px] md:min-w-[160px]">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Vế Trái</span>
                  <div className="text-xl md:text-2xl font-extrabold text-slate-800 font-number">
                    {problem.leftText}
                  </div>
                  <div className="text-xs text-amber-700 font-semibold mt-1">
                    Giá trị: <strong className="font-number">{problem.leftValue}</strong>
                  </div>
                </div>
              </div>

              {/* Center Box for operator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black border-4 shadow-xl transition-all ${
                  result === 'correct'
                    ? 'bg-emerald-500 border-white text-white scale-110'
                    : result === 'wrong'
                    ? 'bg-rose-500 border-white text-white animate-wiggle'
                    : 'bg-white border-amber-400 text-amber-950'
                }`}>
                  {selectedOp || '?'}
                </div>
              </div>

              {/* Right Pan */}
              <div className="absolute -top-12 right-4 md:right-8 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-amber-600" />
                <div className="px-5 py-4 bg-white rounded-2xl border-2 border-amber-400 shadow-lg text-center min-w-[130px] md:min-w-[160px]">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Vế Phải</span>
                  <div className="text-xl md:text-2xl font-extrabold text-slate-800 font-number">
                    {problem.rightText}
                  </div>
                  <div className="text-xs text-amber-700 font-semibold mt-1">
                    Giá trị: <strong className="font-number">{problem.rightValue}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Stand of the balance scale */}
            <div className="w-6 h-20 bg-amber-800 -mt-1 shadow-inner" />
            <div className="w-32 h-6 bg-amber-900 rounded-t-xl shadow-md flex items-center justify-center text-[10px] text-amber-200 font-bold">
              CÂN THĂNG BẰNG
            </div>

            <p className="text-xs font-bold text-amber-900 mt-4 bg-amber-200/80 px-4 py-1.5 rounded-full">
              Bé hãy chọn dấu <span className="font-extrabold text-sm">&gt;</span> , <span className="font-extrabold text-sm">&lt;</span> hoặc <span className="font-extrabold text-sm">=</span> thích hợp:
            </p>
          </div>
        )}

        {/* 3 Operator Buttons: > < = */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto w-full">
          {(['>', '=', '<'] as const).map(op => {
            const isSelected = selectedOp === op;
            return (
              <button
                key={op}
                disabled={result !== null}
                onClick={() => {
                  sound.playPop();
                  handleSelectOp(op);
                }}
                className={`py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border-2 ${
                  isSelected && result === 'correct'
                    ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-lg'
                    : isSelected && result === 'wrong'
                    ? 'bg-rose-500 border-rose-600 text-white animate-wiggle'
                    : 'bg-white hover:bg-amber-100 border-amber-300 hover:border-amber-500 text-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                <span className="text-4xl font-black font-number">
                  {op}
                </span>
                <span className="text-[11px] font-semibold mt-1 text-slate-500">
                  {op === '>' ? 'Lớn hơn' : op === '<' ? 'Bé hơn' : 'Bằng nhau'}
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
          title="Gợi ý cấu tạo số Trăm - Chục - Đơn vị"
          explanation={`Vế trái có giá trị là ${problem.leftValue}.\nVế phải có giá trị là ${problem.rightValue}.\n\nQuy tắc so sánh số có 3 chữ số:\n1. So sánh chữ số hàng trăm trước (số nào có chữ số hàng trăm lớn hơn thì lớn hơn).\n2. Nếu hàng trăm bằng nhau, so sánh hàng chục.\n3. Nếu hàng chục bằng nhau, so sánh hàng đơn vị.`}
          customVisual={
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <div className="text-xs text-slate-500 font-bold">Số {problem.leftValue}:</div>
                  <div className="text-xs text-amber-800 mt-1">
                    {Math.floor(problem.leftValue / 100)} trăm + {Math.floor((problem.leftValue % 100) / 10)} chục + {problem.leftValue % 10} đơn vị
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <div className="text-xs text-slate-500 font-bold">Số {problem.rightValue}:</div>
                  <div className="text-xs text-amber-800 mt-1">
                    {Math.floor(problem.rightValue / 100)} trăm + {Math.floor((problem.rightValue % 100) / 10)} chục + {problem.rightValue % 10} đơn vị
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
