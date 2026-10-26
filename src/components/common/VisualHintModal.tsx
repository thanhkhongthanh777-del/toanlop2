import React from 'react';
import { X, Volume2, Lightbulb } from 'lucide-react';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';

interface VisualHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  explanation: string;
  tens1?: number;
  ones1?: number;
  tens2?: number;
  ones2?: number;
  operator?: '+' | '-';
  customVisual?: React.ReactNode;
}

export const VisualHintModal: React.FC<VisualHintModalProps> = ({
  isOpen,
  onClose,
  title,
  explanation,
  tens1,
  ones1,
  tens2,
  ones2,
  operator,
  customVisual
}) => {
  if (!isOpen) return null;

  const handleSpeak = () => {
    sound.playPop();
    speech.speak(explanation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-yellow-100" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-wide">
              {title || 'Gợi Ý Cách Tính Thông Thái'}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="Đóng bảng gợi ý"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          
          {/* Custom Visual or Bundles Visualizer */}
          {customVisual ? (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70">
              {customVisual}
            </div>
          ) : tens1 !== undefined && ones1 !== undefined && tens2 !== undefined && ones2 !== undefined ? (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 space-y-4">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Mô hình que tính (Bó chục và Que lẻ)
              </div>

              {/* Number 1 bundles */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-600">Số thứ nhất ({tens1 * 10 + ones1}):</div>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: tens1 }).map((_, i) => (
                    <div key={`t1-${i}`} className="flex items-center px-2 py-1 bg-amber-200 border border-amber-400 rounded-md text-xs font-bold text-amber-900 shadow-xs">
                      🎋 10
                    </div>
                  ))}
                  {Array.from({ length: ones1 }).map((_, i) => (
                    <div key={`o1-${i}`} className="w-2.5 h-6 bg-rose-400 rounded-xs shadow-xs" title="1 que tính" />
                  ))}
                </div>
              </div>

              {/* Operator */}
              <div className="text-center font-bold text-amber-600 text-lg">
                {operator === '+' ? 'Cộng thêm (+)' : 'Bớt đi (-)'}
              </div>

              {/* Number 2 bundles */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-600">Số thứ hai ({tens2 * 10 + ones2}):</div>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: tens2 }).map((_, i) => (
                    <div key={`t2-${i}`} className="flex items-center px-2 py-1 bg-emerald-200 border border-emerald-400 rounded-md text-xs font-bold text-emerald-900 shadow-xs">
                      🎋 10
                    </div>
                  ))}
                  {Array.from({ length: ones2 }).map((_, i) => (
                    <div key={`o2-${i}`} className="w-2.5 h-6 bg-sky-400 rounded-xs shadow-xs" title="1 que tính" />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Explanation Text */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800">
              {explanation}
            </div>
          </div>

          {/* Read aloud & Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-sm font-semibold transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Đọc gợi ý cho bé nghe</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-xs transition-colors"
            >
              Bé đã hiểu rồi!
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
