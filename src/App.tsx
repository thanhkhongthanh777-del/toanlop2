import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Play, 
  Award, 
  BookOpen, 
  Timer, 
  CheckCircle2, 
  HelpCircle,
  Flame,
  Star,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AppleGame } from './components/games/AppleGame';
import { FrogGame } from './components/games/FrogGame';
import { ScaleGame } from './components/games/ScaleGame';
import { ClockGame } from './components/games/ClockGame';
import { GeometryGame } from './components/games/GeometryGame';
import { StickerBookModal } from './components/StickerBookModal';
import { QuickCheatSheetModal } from './components/QuickCheatSheetModal';
import { SpeedChallengeModal } from './components/SpeedChallengeModal';
import { GameId, PlayerProfile } from './types/math';
import { getProfile, saveProfile, addStarsAndCheckStickers } from './utils/storage';
import { sound } from './utils/audio';
import { speech } from './utils/speech';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(getProfile());
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [showStickerBook, setShowStickerBook] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showSpeedSprint, setShowSpeedSprint] = useState<boolean>(false);

  useEffect(() => {
    sound.setEnabled(profile.soundEnabled);
    speech.setEnabled(profile.voiceEnabled);
  }, [profile.soundEnabled, profile.voiceEnabled]);

  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: nextVal };
    setProfile(updated);
    saveProfile(updated);
    sound.setEnabled(nextVal);
  };

  const handleEarnStars = (count: number, score: number) => {
    if (!activeGame) return;
    const { profile: updated, newStickers } = addStarsAndCheckStickers(
      count,
      activeGame as 'apple' | 'frog' | 'scale' | 'clock' | 'geometry' | 'speed',
      score
    );
    setProfile(updated);
    if (newStickers.length > 0) {
      sound.playWin();
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    const updated = { ...profile, avatar };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleSpeedSprintFinished = (score: number, starsEarned: number) => {
    const { profile: updated } = addStarsAndCheckStickers(starsEarned, 'speed', score);
    setProfile(updated);
  };

  // Get active game title for navbar
  const getGameTitle = (id: GameId | null) => {
    switch (id) {
      case 'apple': return 'Vườn Táo Phép Tính';
      case 'frog': return 'Chú Ếch Qua Sông';
      case 'scale': return 'Chiếc Cân Kỳ Diệu';
      case 'clock': return 'Thám Tử Thời Gian';
      case 'geometry': return 'Thước Đo & Hình Học';
      default: return undefined;
    }
  };

  const gamesConfig = [
    {
      id: 'apple' as GameId,
      title: 'Vườn Táo Phép Tính',
      subtitle: 'Phép cộng, trừ có nhớ trong phạm vi 100 & 1000',
      badge: 'Cộng & Trừ',
      icon: '🍎',
      bgGradient: 'from-rose-500 to-amber-500',
      cardBorder: 'border-rose-200 hover:border-rose-400',
      tagColor: 'text-rose-700 bg-rose-50',
      solvedBest: profile.highScores.apple
    },
    {
      id: 'frog' as GameId,
      title: 'Chú Ếch Qua Sông',
      subtitle: 'Bảng nhân 2, bảng nhân 5; Bảng chia 2, bảng chia 5',
      badge: 'Nhân & Chia',
      icon: '🐸',
      bgGradient: 'from-emerald-500 to-teal-500',
      cardBorder: 'border-emerald-200 hover:border-emerald-400',
      tagColor: 'text-emerald-700 bg-emerald-50',
      solvedBest: profile.highScores.frog
    },
    {
      id: 'scale' as GameId,
      title: 'Chiếc Cân Kỳ Diệu',
      subtitle: 'So sánh số (> , < , =) & cấu tạo số Trăm - Chục - Đơn vị',
      badge: 'So Sánh Số',
      icon: '⚖️',
      bgGradient: 'from-amber-500 to-yellow-500',
      cardBorder: 'border-amber-200 hover:border-amber-400',
      tagColor: 'text-amber-800 bg-amber-50',
      solvedBest: profile.highScores.scale
    },
    {
      id: 'clock' as GameId,
      title: 'Thám Tử Thời Gian',
      subtitle: 'Xem đồng hồ kim, giờ đúng, giờ rưỡi & thói quen sinh hoạt',
      badge: 'Xem Đồng Hồ',
      icon: '⏰',
      bgGradient: 'from-indigo-500 to-blue-500',
      cardBorder: 'border-indigo-200 hover:border-indigo-400',
      tagColor: 'text-indigo-700 bg-indigo-50',
      solvedBest: profile.highScores.clock
    },
    {
      id: 'geometry' as GameId,
      title: 'Thước Đo & Hình Học',
      subtitle: 'Đo độ dài xăng-ti-mét (cm, dm) & nhận biết hình tam giác, tứ giác',
      badge: 'Đo Lường & Hình Khối',
      icon: '📏',
      bgGradient: 'from-teal-500 to-cyan-600',
      cardBorder: 'border-teal-200 hover:border-teal-400',
      tagColor: 'text-teal-700 bg-teal-50',
      solvedBest: profile.highScores.geometry
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30">
      
      {/* Top Bar Navigation */}
      <Navbar
        stars={profile.stars}
        soundEnabled={profile.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenStickerBook={() => setShowStickerBook(true)}
        onOpenCheatSheet={() => setShowCheatSheet(true)}
        onOpenSpeedChallenge={() => setShowSpeedSprint(true)}
        onGoHome={() => {
          sound.playPop();
          setActiveGame(null);
        }}
        activeGameTitle={getGameTitle(activeGame)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        {/* If a game is active, render that specific game */}
        {activeGame === 'apple' && (
          <AppleGame onBack={() => setActiveGame(null)} onEarnStars={handleEarnStars} />
        )}

        {activeGame === 'frog' && (
          <FrogGame onBack={() => setActiveGame(null)} onEarnStars={handleEarnStars} />
        )}

        {activeGame === 'scale' && (
          <ScaleGame onBack={() => setActiveGame(null)} onEarnStars={handleEarnStars} />
        )}

        {activeGame === 'clock' && (
          <ClockGame onBack={() => setActiveGame(null)} onEarnStars={handleEarnStars} />
        )}

        {activeGame === 'geometry' && (
          <GeometryGame onBack={() => setActiveGame(null)} onEarnStars={handleEarnStars} />
        )}

        {/* Home Hub Dashboard */}
        {!activeGame && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* HERO BANNER SECTION */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-10 shadow-lg text-white">
              
              {/* Playful background decorative shapes */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-yellow-300/20 blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Text and Title */}
                <div className="space-y-3 text-center lg:text-left max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wide backdrop-blur-xs text-white">
                    <Sparkles className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                    <span>Chương trình Toán Lớp 2 chuẩn Bộ Giáo Dục</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Học Toán Thật Vui, Điểm 10 Trong Tầm Tay!
                  </h1>

                  <p className="text-sm md:text-base text-amber-50 font-medium leading-relaxed">
                    Chào mừng bé yêu đến với công viên trò chơi toán học lớp 2! Cùng tham gia hái táo phép tính, giúp ếch qua sông, xoay kim đồng hồ và sưu tập trọn bộ huy hiệu danh dự!
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={() => {
                        sound.playPop();
                        setActiveGame('apple');
                      }}
                      className="px-6 py-3 bg-white hover:bg-amber-50 text-amber-900 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-amber-700 text-amber-700" />
                      <span>Chơi Ngay: Vườn Táo</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playPop();
                        setShowSpeedSprint(true);
                      }}
                      className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Timer className="w-4 h-4" />
                      <span>Thử Thách 60s</span>
                    </button>
                  </div>
                </div>

                {/* Mascot Character Lockup */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white/25 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-6xl md:text-7xl shadow-2xl animate-float">
                      {profile.avatar}
                    </div>
                    {/* Star badge on avatar */}
                    <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-yellow-400 text-amber-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-900" />
                      <span className="font-number">{profile.stars}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white mt-3 bg-black/15 px-3 py-1 rounded-full">
                    {profile.name}
                  </span>
                </div>

              </div>
            </div>

            {/* DAILY QUEST & QUICK STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Daily Goals */}
              <div className="md:col-span-2 p-5 bg-white rounded-3xl border border-amber-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Nhiệm Vụ Học Tập Hôm Nay
                    </h3>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold">
                    Đã giải đúng {profile.totalSolved} bài toán
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${profile.totalSolved >= 1 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className="text-xs font-semibold text-slate-700">Giải đúng bài toán đầu tiên trong ngày</span>
                    </div>
                    <span className="text-xs font-bold text-amber-700">+2 ⭐</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${profile.highScores.frog > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className="text-xs font-semibold text-slate-700">Chinh phục 1 lần đưa chú ếch qua sông (bảng nhân 2, 5)</span>
                    </div>
                    <span className="text-xs font-bold text-amber-700">+5 ⭐</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${profile.highScores.speed >= 30 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className="text-xs font-semibold text-slate-700">Tham gia Thử Thách 60s đạt từ 30 điểm trở lên</span>
                    </div>
                    <span className="text-xs font-bold text-amber-700">+5 ⭐</span>
                  </div>
                </div>
              </div>

              {/* Sticker Collection Card */}
              <div 
                onClick={() => {
                  sound.playPop();
                  setShowStickerBook(true);
                }}
                className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Mở kho ➔
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Kho Sticker Đổi Thưởng</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Bé đã sở hữu <strong className="text-emerald-700 font-number">{profile.unlockedStickers.length}</strong> huy hiệu lấp lánh!
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-100">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-yellow-200 border-2 border-white flex items-center justify-center text-sm shadow-xs">⭐</div>
                    <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-sm shadow-xs">🐝</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-sm shadow-xs">🐸</div>
                    <div className="w-8 h-8 rounded-full bg-sky-200 border-2 border-white flex items-center justify-center text-sm shadow-xs">🍎</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    Xem tất cả sticker
                  </span>
                </div>
              </div>

            </div>

            {/* GAMES SELECTION SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                    Chọn Trò Chơi Toán Học Bé Thích
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Các trò chơi được thiết kế bám sát chương trình Giáo Dục Phổ Thông Toán Lớp 2
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playPop();
                    setShowCheatSheet(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Xem công thức mẫu</span>
                </button>
              </div>

              {/* Game Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gamesConfig.map(game => (
                  <div
                    key={game.id}
                    onClick={() => {
                      sound.playPop();
                      setActiveGame(game.id);
                    }}
                    className={`group relative p-6 bg-white rounded-3xl border-2 ${game.cardBorder} shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1`}
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl shadow-xs transition-colors group-hover:scale-110">
                          {game.icon}
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${game.tagColor}`}>
                          {game.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {game.subtitle}
                      </p>
                    </div>

                    {/* Bottom action row */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {game.solvedBest > 0 ? (
                          <span>Điểm cao nhất: <strong className="text-amber-600 font-number">{game.solvedBest}</strong></span>
                        ) : (
                          <span>Chưa có điểm cao</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                        <span>Chơi ngay</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Speed sprint extra card */}
                <div
                  onClick={() => {
                    sound.playPop();
                    setShowSpeedSprint(true);
                  }}
                  className="group relative p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl border-2 border-rose-200 hover:border-rose-400 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 group-hover:bg-rose-200 border border-rose-300 flex items-center justify-center text-3xl shadow-xs transition-colors group-hover:scale-110">
                        ⚡
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-rose-700 bg-rose-100">
                        Đua 60 Giây
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                      Vua Tính Nhẩm 60 Giây
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Thử tài phản xạ với hàng loạt câu hỏi cộng, trừ, nhân, chia hỗn hợp trong 60 giây!
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between">
                    <div className="text-[11px] text-rose-600 font-medium">
                      Kỷ lục: <strong className="font-number">{profile.highScores.speed}</strong> điểm
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                      <span>Vào đua ngay</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CURRICULUM HIGHLIGHTS & TIPS SECTION */}
            <div className="p-6 bg-white rounded-3xl border border-amber-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📚 Trọng Tâm Kiến Thức Toán Lớp 2 Được Tích Hợp:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <div className="font-bold text-amber-900 mb-1">1. Phép Cộng & Trừ</div>
                  <div className="text-slate-600">Cộng trừ có nhớ trong phạm vi 100 và các số trong phạm vi 1000.</div>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-1">2. Bảng Nhân & Chia</div>
                  <div className="text-slate-600">Thành thạo bảng nhân 2, nhân 5, bảng chia 2 và bảng chia 5.</div>
                </div>
                <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                  <div className="font-bold text-indigo-900 mb-1">3. Xem Đồng Hồ & Thời Gian</div>
                  <div className="text-slate-600">Xem giờ đúng, giờ rưỡi, 15 phút và thời gian các buổi trong ngày.</div>
                </div>
                <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200">
                  <div className="font-bold text-teal-900 mb-1">4. Đo Lường & Hình Học</div>
                  <div className="text-slate-600">Đơn vị cm, dm, m và nhận diện hình tam giác, tứ giác, khối cầu, khối trụ.</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-amber-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">Bé Vui Học Toán 2</span>
            <span>·</span>
            <span>Ứng dụng luyện toán tiểu học thông minh & vui nhộn</span>
          </div>
          <div className="text-slate-400">
            Giúp bé yêu thêm tự tin và yêu thích môn Toán học mỗi ngày
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <StickerBookModal
        isOpen={showStickerBook}
        onClose={() => setShowStickerBook(false)}
        stars={profile.stars}
        unlockedStickers={profile.unlockedStickers}
        currentAvatar={profile.avatar}
        onSelectAvatar={handleSelectAvatar}
      />

      <QuickCheatSheetModal
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
      />

      <SpeedChallengeModal
        isOpen={showSpeedSprint}
        onClose={() => setShowSpeedSprint(false)}
        onFinished={handleSpeedSprintFinished}
        bestScore={profile.highScores.speed}
      />

    </div>
  );
}
