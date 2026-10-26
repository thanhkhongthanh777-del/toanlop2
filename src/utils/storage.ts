import { PlayerProfile, Sticker } from '../types/math';

export const INITIAL_STICKERS: Sticker[] = [
  {
    id: 'lucky_star',
    name: 'Ngôi Sao Khởi Đầu',
    description: 'Bắt đầu hành trình học toán lớp 2',
    icon: '⭐',
    starsRequired: 0,
    category: 'magic'
  },
  {
    id: 'busy_bee',
    name: 'Bé Ong Chăm Chỉ',
    description: 'Tích lũy 15 Ngôi Sao Vàng',
    icon: '🐝',
    starsRequired: 15,
    category: 'animals'
  },
  {
    id: 'smart_frog',
    name: 'Chú Ếch Nhảy Xa',
    description: 'Vượt qua bảng nhân chia 2 và 5',
    icon: '🐸',
    starsRequired: 30,
    category: 'animals'
  },
  {
    id: 'apple_master',
    name: 'Bé Hái Táo Giỏi',
    description: 'Thành thạo cộng trừ có nhớ trong phạm vi 100',
    icon: '🍎',
    starsRequired: 45,
    category: 'animals'
  },
  {
    id: 'time_knight',
    name: 'Hiệp Sĩ Thời Gian',
    description: 'Xem đúng 10 bài toán đồng hồ',
    icon: '⏰',
    starsRequired: 60,
    category: 'magic'
  },
  {
    id: 'geometry_builder',
    name: 'Kiến Trúc Sư Nhí',
    description: 'Đo độ dài và nhận diện hình học chuẩn xác',
    icon: '📐',
    starsRequired: 75,
    category: 'magic'
  },
  {
    id: 'rocket_speed',
    name: 'Tên Lửa Siêu Tốc',
    description: 'Đạt trên 100 điểm ở Thử Thách 60 Giây',
    icon: '🚀',
    starsRequired: 90,
    category: 'space'
  },
  {
    id: 'gold_cup',
    name: 'Cúp Vàng Toán Học',
    description: 'Đạt mốc 120 Ngôi Sao Vàng danh dự',
    icon: '🏆',
    starsRequired: 120,
    category: 'trophy'
  },
  {
    id: 'wise_dino',
    name: 'Khủng Long Thông Thái',
    description: 'Chinh phục 150 Ngôi Sao Vàng',
    icon: '🦕',
    starsRequired: 150,
    category: 'animals'
  }
];

const STORAGE_KEY = 'be_vui_hoc_toan_2_profile';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Bé Thông Thái',
  avatar: '🦊',
  stars: 10,
  unlockedStickers: ['lucky_star'],
  highScores: {
    apple: 0,
    frog: 0,
    scale: 0,
    clock: 0,
    geometry: 0,
    speed: 0
  },
  totalSolved: 0,
  soundEnabled: true,
  voiceEnabled: true
};

export const getProfile = (): PlayerProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: PlayerProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // LocalStorage quota or blocked
  }
};

export const addStarsAndCheckStickers = (
  earnedStars: number,
  gameId?: 'apple' | 'frog' | 'scale' | 'clock' | 'geometry' | 'speed',
  score?: number
): { profile: PlayerProfile; newStickers: Sticker[] } => {
  const current = getProfile();
  const nextStars = current.stars + earnedStars;
  const nextTotalSolved = current.totalSolved + (earnedStars > 0 ? 1 : 0);

  const updatedHighScores = { ...current.highScores };
  if (gameId && score !== undefined && score > (updatedHighScores[gameId] || 0)) {
    updatedHighScores[gameId] = score;
  }

  // Check new unlockable stickers
  const newlyUnlocked: Sticker[] = [];
  const currentUnlockedSet = new Set(current.unlockedStickers);

  INITIAL_STICKERS.forEach(sticker => {
    if (!currentUnlockedSet.has(sticker.id) && nextStars >= sticker.starsRequired) {
      newlyUnlocked.push(sticker);
      currentUnlockedSet.add(sticker.id);
    }
  });

  const updatedProfile: PlayerProfile = {
    ...current,
    stars: nextStars,
    totalSolved: nextTotalSolved,
    highScores: updatedHighScores,
    unlockedStickers: Array.from(currentUnlockedSet)
  };

  saveProfile(updatedProfile);
  return { profile: updatedProfile, newStickers: newlyUnlocked };
};
