import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Timer, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStickerBook: () => void;
  onOpenCheatSheet: () => void;
  onOpenSpeedChallenge: () => void;
  onGoHome: () => void;
  activeGameTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  stars,
  soundEnabled,
  onToggleSound,
  onOpenStickerBook,
  onOpenCheatSheet,
  onOpenSpeedChallenge,
  onGoHome,
  activeGameTitle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          aria-label="Về trang chủ Bé Vui Học Toán 2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white text-xl shadow-xs shadow-amber-300">
            🧮
          </div>
          <div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-amber-950 group-hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 block">
              Bé Vui Học Toán 2
            </span>
            <span className="text-xs text-amber-600/90 font-medium hidden sm:block whitespace-nowrap">
              {activeGameTitle ? `Đang chơi: ${activeGameTitle}` : 'Trò chơi toán học lớp 2'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={onGoHome}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Trang Chủ</span>
          </button>

          <button
            onClick={onOpenCheatSheet}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Sổ Tay Công Thức</span>
          </button>

          <button
            onClick={onOpenStickerBook}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Kho Sticker</span>
          </button>

          <button
            onClick={onOpenSpeedChallenge}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-rose-600"
          >
            <Timer className="w-4 h-4 text-rose-500" />
            <span>Thử Thách 60s</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Star Bank */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleSound();
            }}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-100/60 rounded-xl transition-colors"
            aria-label="Cài đặt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Sticker Album quick button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenStickerBook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300 text-amber-900 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
            <span className="font-number">{stars}</span>
            <span className="text-xs font-medium text-amber-800">Sao</span>
          </button>
        </div>

      </div>
    </header>
  );
};
