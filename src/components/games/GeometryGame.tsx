import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, Sparkles, HelpCircle, Ruler, Shapes } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeometryProblem } from '../../types/math';
import { generateGeometryProblem } from '../../utils/mathGenerators';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { VisualHintModal } from '../common/VisualHintModal';

interface GeometryGameProps {
  onBack: () => void;
  onEarnStars: (count: number, score: number) => void;
}

export const GeometryGame: React.FC<GeometryGameProps> = ({ onBack, onEarnStars }) => {
  const [problem, setProblem] = useState<GeometryProblem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const loadNewProblem = useCallback(() => {
    const p = generateGeometryProblem();
    setProblem(p);
    setSelectedOption(null);
    setResult(null);
  }, []);

  useEffect(() => {
    loadNewProblem();
  }, [loadNewProblem]);

  const handleSpeak = () => {
    if (!problem) return;
    speech.speak(problem.question);
  };

  const handleSelectAnswer = (ans: string | number) => {
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
        particleCount: 30,
        spread: 50,
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-teal-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 hover:bg-teal-100 text-teal-900 rounded-xl transition-colors"
            title="Quay lại danh sách trò chơi"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>📏 Thước Đo & Hình Học</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                {problem?.type === 'measure' ? 'Đo độ dài cm' : 'Hình tam giác & tứ giác'}
              </span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Câu đúng: <strong className="text-teal-700 font-number">{correctCount}</strong></span>
              <span>·</span>
              <span>Điểm: <strong className="text-amber-600 font-number">{score}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-2xl border border-teal-200">
          {problem?.type === 'measure' ? <Ruler className="w-4 h-4 text-teal-600" /> : <Shapes className="w-4 h-4 text-teal-600" />}
          <span>{problem?.type === 'measure' ? 'Đo độ dài' : 'Nhận biết hình học'}</span>
        </div>
      </div>

      {/* Main Play Arena */}
      <div className="relative bg-gradient-to-b from-teal-50 via-emerald-50/40 to-cyan-50 rounded-3xl border-4 border-teal-300 p-6 md:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between shadow-md">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-xl font-bold text-xs shadow-xs border border-teal-200 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-teal-600" />
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
            <span>Xem bí kíp</span>
          </button>
        </div>

        {/* Center: Interactive Measurement or Shape Visual */}
        {problem && (
          <div className="my-6 flex flex-col items-center">
            
            {/* Question Text */}
            <div className="bg-white/90 backdrop-blur-xs px-6 py-3 rounded-2xl border border-teal-200 shadow-xs text-center max-w-lg mb-6">
              <p className="text-sm md:text-base font-semibold text-slate-800">
                {problem.question}
              </p>
            </div>

            {/* Type A: Ruler & Object Measurement */}
            {problem.type === 'measure' && problem.actualLengthCm && (
              <div className="w-full max-w-lg p-6 bg-white rounded-3xl border-2 border-teal-200 shadow-lg flex flex-col items-center space-y-4">
                
                {/* Object being measured */}
                <div className="w-full flex items-center justify-start pl-2">
                  <div 
                    className="h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-2xl border-2 border-amber-600 shadow-md flex items-center px-3 relative transition-all"
                    style={{ width: `${Math.min(95, (problem.actualLengthCm / 15) * 100)}%` }}
                  >
                    <span className="text-xs font-bold text-amber-950 truncate">
                      ✏️ {problem.objectName}
                    </span>
                    {/* Pencil tip */}
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-10 border-l-amber-600" />
                  </div>
                </div>

                {/* Simulated Real CM Ruler */}
                <div className="w-full h-16 bg-amber-100 rounded-xl border-2 border-amber-400 shadow-inner relative flex flex-col justify-end px-2 select-none">
                  {/* CM Ticks and labels */}
                  <div className="w-full flex justify-between items-end pb-1 border-t-2 border-amber-600">
                    {Array.from({ length: 16 }).map((_, cm) => (
                      <div key={cm} className="flex flex-col items-center">
                        <div className={`w-0.5 bg-amber-800 ${cm % 5 === 0 ? 'h-5' : 'h-2.5'}`} />
                        <span className="text-[10px] md:text-xs font-bold text-amber-950 font-number mt-0.5">
                          {cm}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="absolute top-1 left-3 text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                    cm (xăng-ti-mét)
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Vạch số 0 đã được căn chuẩn vào đầu cây bút. Hãy nhìn xem đầu nhọn chỉ tới vạch số mấy!
                </div>
              </div>
            )}

            {/* Type B: Shape Graphic */}
            {problem.type === 'shape' && (
              <div className="p-6 bg-white rounded-3xl border-2 border-teal-200 shadow-lg flex flex-col items-center space-y-3">
                <div className="w-32 h-32 flex items-center justify-center text-teal-600">
                  {problem.shapeName === 'Hình Tam Giác' ? (
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      <polygon points="50,15 90,85 10,85" fill="#CCFBF1" stroke="#0D9488" strokeWidth="4" />
                      <circle cx="50" cy="15" r="4" fill="#E11D48" />
                      <circle cx="90" cy="85" r="4" fill="#E11D48" />
                      <circle cx="10" cy="85" r="4" fill="#E11D48" />
                    </svg>
                  ) : problem.shapeName === 'Hình Tứ Giác' ? (
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      <polygon points="15,20 85,15 80,85 20,80" fill="#CCFBF1" stroke="#0D9488" strokeWidth="4" />
                      <circle cx="15" cy="20" r="4" fill="#E11D48" />
                      <circle cx="85" cy="15" r="4" fill="#E11D48" />
                      <circle cx="80" cy="85" r="4" fill="#E11D48" />
                      <circle cx="20" cy="80" r="4" fill="#E11D48" />
                    </svg>
                  ) : (
                    <span className="text-6xl">📐</span>
                  )}
                </div>
                <div className="text-xs font-bold text-teal-900 bg-teal-100 px-3 py-1 rounded-full">
                  {problem.shapeName || 'Kiến thức toán học lớp 2'}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Answer choices */}
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
                    : 'bg-white hover:bg-teal-50 border-teal-200 hover:border-teal-400 text-slate-800 shadow-xs hover:shadow-md'
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
          title="Bí kíp đo độ dài & hình học"
          explanation={
            problem.type === 'measure'
              ? `Để đo độ dài:\n1. Đặt vạch số 0 trùng với một đầu của vật.\n2. Nhìn xem đầu còn lại của vật chỉ tới vạch số nào trên thước kẻ.\n\nĐáp án đúng là: ${problem.correctAnswer}`
              : `Kiến thức hình học:\n- Hình tam giác có 3 cạnh và 3 đỉnh (đỉnh màu đỏ).\n- Hình tứ giác có 4 cạnh và 4 đỉnh.\n- 1 dm = 10 cm, 1 m = 100 cm.`
          }
        />
      )}
    </div>
  );
};
