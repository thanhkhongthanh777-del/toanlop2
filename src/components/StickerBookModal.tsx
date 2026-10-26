import React from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_STICKERS } from '../utils/storage';
import { sound } from '../utils/audio';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  unlockedStickers: string[];
  currentAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

const AVATAR_OPTIONS = ['🦊', '🐰', '🐻', '🐼', '🦉', '🐱', '🦁', '🐸', '🦄', '🦖'];

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  stars,
  unlockedStickers,
  currentAvatar,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedStickers);

  // Compute Rank Title
  let rankTitle = 'Bé Chăm Chỉ Khám Phá';
  if (stars >= 120) rankTitle = 'Đại Kiện Tướng Toán Lớp 2 🏆';
  else if (stars >= 75) rankTitle = 'Hiệp Sĩ Tính Nhẩm Tài Ba 🌟';
  else if (stars >= 40) rankTitle = 'Thần Đồng Toán Học Nhí 🚀';
  else if (stars >= 15) rankTitle = 'Học Sinh Chăm Ngoan 🐝';

  const triggerConfetti = () => {
    sound.playWin();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-4 flex items-center justify-between text-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center text-2xl shadow-xs">
              📒
            </div>
            <div>
              <h2 className="font-bold text-xl text-amber-950">Kho Sticker & Huy Hiệu</h2>
              <div className="text-xs text-amber-900 font-semibold flex items-center gap-2">
                <span>{rankTitle}</span>
                <span>·</span>
                <span className="font-number">{unlockedSet.size}/{INITIAL_STICKERS.length} Huy hiệu</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors text-amber-950"
            aria-label="Đóng kho sticker"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Avatar selector & Stats bar */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-float">
                  {currentAvatar}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Tài khoản bé yêu:</div>
                <div className="text-lg font-bold text-slate-800">Bé Thông Thái</div>
                <div className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-number">{stars}</span> Ngôi Sao Tích Lũy
                </div>
              </div>
            </div>

            {/* Avatar picker icons */}
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-xs font-semibold text-slate-600 mb-1.5">Chọn bạn đồng hành:</span>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end max-w-xs">
                {AVATAR_OPTIONS.map(char => (
                  <button
                    key={char}
                    onClick={() => {
                      sound.playPop();
                      onSelectAvatar(char);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform ${
                      currentAvatar === char
                        ? 'bg-amber-400 scale-110 shadow-xs ring-2 ring-amber-600'
                        : 'bg-white hover:bg-amber-100 border border-slate-200'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stickers Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Bộ Sưu Tập Sticker Toán Học</span>
              </h3>
              <button
                onClick={triggerConfetti}
                className="text-xs font-semibold text-amber-600 hover:text-amber-800 hover:underline"
              >
                Tung hoa giấy chúc mừng 🎉
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INITIAL_STICKERS.map(sticker => {
                const isUnlocked = unlockedSet.has(sticker.id);
                return (
                  <div
                    key={sticker.id}
                    onClick={() => {
                      if (isUnlocked) {
                        sound.playWin();
                        confetti({
                          particleCount: 20,
                          origin: { y: 0.7 }
                        });
                      }
                    }}
                    className={`relative p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-white border-amber-300 hover:border-amber-400 shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-100 to-yellow-100 border border-amber-300'
                          : 'bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {sticker.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate">
                          {sticker.name}
                        </h4>
                        {isUnlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {sticker.description}
                      </p>
                      <div className="text-[11px] font-semibold text-amber-700 mt-1">
                        {isUnlocked ? 'Đã đạt được!' : `Cần ${sticker.starsRequired} ⭐`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Mẹo: Làm đúng mỗi bài toán sẽ nhận ngay từ 1 đến 3 Ngôi Sao Vàng!
          </span>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tiếp tục học
          </button>
        </div>

      </div>
    </div>
  );
};
