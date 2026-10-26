import React, { useState } from 'react';
import { X, BookOpen, Clock, Ruler, Shapes, Calculator } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuickCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCheatSheetModal: React.FC<QuickCheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'units' | 'shapes' | 'rules'>('tables');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-xs">
              📖
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">Sổ Tay Bí Kíp Toán Lớp 2</h2>
              <div className="text-xs text-sky-100 font-medium">
                Xem lại bảng nhân, bảng chia và công thức trọng tâm
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="Đóng sổ tay bí kíp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-2 bg-sky-50/80 border-b border-sky-100 overflow-x-auto">
          <button
            onClick={() => { sound.playPop(); setActiveTab('tables'); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Bảng Nhân & Chia (2, 5)</span>
          </button>

          <button
            onClick={() => { sound.playPop(); setActiveTab('units'); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'units'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Đơn Vị Đo Độ Dài</span>
          </button>

          <button
            onClick={() => { sound.playPop(); setActiveTab('shapes'); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'shapes'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Hình Học Lớp 2</span>
          </button>

          <button
            onClick={() => { sound.playPop(); setActiveTab('rules'); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Xem Giờ & Cộng Trừ Có Nhớ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* TAB 1: BẢNG NHÂN & CHIA 2, 5 */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bảng nhân 2 */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                  <div className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center text-xs">2×</span>
                    <span>Bảng Nhân 2</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-number text-emerald-950">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <div key={n} className="flex justify-between py-0.5 border-b border-emerald-100">
                        <span>2 × {n}</span>
                        <span className="font-bold text-emerald-700">= {2 * n}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bảng nhân 5 */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                  <div className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center text-xs">5×</span>
                    <span>Bảng Nhân 5</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-number text-amber-950">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <div key={n} className="flex justify-between py-0.5 border-b border-amber-100">
                        <span>5 × {n}</span>
                        <span className="font-bold text-amber-700">= {5 * n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bảng chia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bảng chia 2 */}
                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4">
                  <div className="font-bold text-sky-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-200 text-sky-900 flex items-center justify-center text-xs">:2</span>
                    <span>Bảng Chia 2</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-number text-sky-950">
                    {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(n => (
                      <div key={n} className="flex justify-between py-0.5 border-b border-sky-100">
                        <span>{n} : 2</span>
                        <span className="font-bold text-sky-700">= {n / 2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bảng chia 5 */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
                  <div className="font-bold text-purple-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-200 text-purple-900 flex items-center justify-center text-xs">:5</span>
                    <span>Bảng Chia 5</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-number text-purple-950">
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(n => (
                      <div key={n} className="flex justify-between py-0.5 border-b border-purple-100">
                        <span>{n} : 5</span>
                        <span className="font-bold text-purple-700">= {n / 5}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐƠN VỊ ĐO ĐỘ DÀI */}
          {activeTab === 'units' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                <h4 className="font-bold text-teal-900 text-sm mb-2">Quy Đổi Đơn Vị Đo Độ Dài Cơ Bản:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <div className="text-xs text-slate-500">1 đề-xi-mét (dm)</div>
                    <div className="text-lg font-bold text-teal-700 font-number">= 10 cm</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <div className="text-xs text-slate-500">1 mét (m)</div>
                    <div className="text-lg font-bold text-teal-700 font-number">= 10 dm</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <div className="text-xs text-slate-500">1 mét (m)</div>
                    <div className="text-lg font-bold text-teal-700 font-number">= 100 cm</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-bold text-amber-900 text-sm mb-2">💡 Mẹo dùng thước kẻ đúng cách:</h4>
                <p className="text-xs text-amber-950 leading-relaxed">
                  Khi đo bất kỳ vật nào (như bút chì, que tính, cục gôm), bé nhớ luôn đặt <span className="font-bold underline">vạch số 0</span> của thước trùng với một đầu của vật. Đầu kia chỉ đến vạch số nào thì vật dài đúng từng đó xăng-ti-mét!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HÌNH HỌC LỚP 2 */}
          {activeTab === 'shapes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <div className="w-12 h-12 bg-rose-200 rounded-xl flex items-center justify-center text-rose-800 font-bold text-xl shrink-0">
                  ▲
                </div>
                <div>
                  <h4 className="font-bold text-rose-900 text-sm">Hình Tam Giác</h4>
                  <p className="text-xs text-rose-800 mt-1">
                    Có <span className="font-bold font-number">3</span> đoạn thẳng khép kín gọi là 3 cạnh và có <span className="font-bold font-number">3</span> đỉnh.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
                <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center text-indigo-800 font-bold text-xl shrink-0">
                  ■
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Hình Tứ Giác</h4>
                  <p className="text-xs text-indigo-800 mt-1">
                    Có <span className="font-bold font-number">4</span> cạnh và <span className="font-bold font-number">4</span> đỉnh. Hình vuông và hình chữ nhật cũng là hình tứ giác!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center text-emerald-800 text-2xl shrink-0">
                  🥫
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Khối Trụ</h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Giống như hộp sữa, lon nước ngọt, có 2 mặt đáy hình tròn phẳng.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center text-orange-800 text-2xl shrink-0">
                  ⚽
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 text-sm">Khối Cầu</h4>
                  <p className="text-xs text-orange-800 mt-1">
                    Giống như quả bóng đá, quả cam, có thể lăn được về mọi phía.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: XEM GIỜ & QUY TẮC CỘNG TRỪ */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Cách Đọc Đồng Hồ Chuẩn:</span>
                </h4>
                <ul className="text-xs text-amber-950 space-y-1.5 list-disc pl-4">
                  <li><span className="font-bold">Kim ngắn:</span> chỉ giờ. <span className="font-bold">Kim dài:</span> chỉ phút.</li>
                  <li>Kim dài chỉ vào số 12: <span className="font-bold">Giờ đúng</span> (ví dụ 8 giờ đúng).</li>
                  <li>Kim dài chỉ vào số 6: <span className="font-bold">Giờ rưỡi</span> (ví dụ 8 giờ 30 phút).</li>
                  <li>Kim dài chỉ vào số 3: <span className="font-bold">15 phút</span> (ví dụ 8 giờ 15 phút).</li>
                  <li>1 ngày = 24 giờ (tính từ 12 giờ đêm hôm trước đến 12 giờ đêm hôm sau).</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>Quy Tắc Đặt Tính Rồi Tính (Cộng / Trừ Có Nhớ):</span>
                </h4>
                <p className="text-xs text-blue-950 leading-relaxed">
                  - Đặt các chữ số cùng hàng thẳng cột với nhau (hàng đơn vị thẳng hàng đơn vị, hàng chục thẳng hàng chục).<br/>
                  - Thực hiện tính <span className="font-bold">từ phải sang trái</span> (bắt đầu từ hàng đơn vị trước rồi mới đến hàng chục).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Đã Nhớ Rồi
          </button>
        </div>

      </div>
    </div>
  );
};
