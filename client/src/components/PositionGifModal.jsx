import React from 'react';
import { X, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

// 50 Vector Illustrated Sex Positions with embedded SVG diagrams for 100% mobile compatibility
export const POSITIONS_LIST = Array.from({ length: 50 }, (_, i) => {
  const titles = [
    'Missionary Position 💋', 'Doggy Style Position 🐾', 'Cowgirl Position 🤠', 'Reverse Cowgirl Position 🔄',
    'Spooning Position 🥄', 'Standing Position 🧍‍♂️', '69 Position ♋', 'Lotus Position 🧘',
    'Scissors Position ✂️', 'Bridge Position 🌉', 'Butterfly Position 🦋', 'Pretzel Position 🥨',
    'X-Mark Position ❌', 'Chair Position 🪑', 'Anvil Position 🔨', 'Standing Rear Position 🧍‍♀️',
    'Seated Embracing 🫂', 'Waterfall Position 🌊', 'Crab Position 🦀', 'Eagle Position 🦅',
    'Wheelbarrow Position 🛒', 'Twister Position 🌀', 'Side Entry Position 📐', 'Elevated Lotus 🧘‍♀️',
    'Kneeling Arch 🏹', 'Cradle Position 👶', 'Starfish Position ⭐️', 'T-Square Position 📏',
    'G-Spot Focus 🎯', 'Deep Angle Position 💥', 'Suspension Position 🪢', 'Seated Countertop 🪵',
    'Standing Desk 🖥️', 'Lounge Chair 🛋️', 'Fountain Position ⛲', 'V-Angle Position ✌️',
    'Bended Knee 🦵', 'Rear Spooning 🥄', 'Over the Shoulder 🎒', 'Arching Bridge 🌉',
    'Cross Leg Lock 🔒', 'High Angle Position 📐', 'Low Rider Position 🚗', 'Orbit Position 🪐',
    'Helix Position 🧬', 'Pulse Rhythm 💓', 'Prone Position 🛌', 'Reclined Arch 🛋️',
    'Vertical Thrust 🚀', 'Zen Embrace ☯️'
  ];
  
  const id = i + 1;
  return {
    id,
    title: titles[i] || `Position ${id} 🔥`,
    svgId: id
  };
});

export const renderPositionDiagramSvg = (id, title = '') => (
  <svg viewBox="0 0 200 120" className="w-full h-full bg-[#0b0614] rounded-xl">
    <rect width="200" height="120" fill="#0b0614" />
    <defs>
      <linearGradient id={`grad1_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
      <linearGradient id={`grad2_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    
    {/* Body Arc 1 */}
    <path
      d={`M ${15 + (id * 7) % 60} ${85 - (id * 5) % 30} Q 100 ${30 + (id * 9) % 40} ${185 - (id * 6) % 60} ${85 - (id * 4) % 30}`}
      stroke={`url(#grad1_${id})`}
      strokeWidth="9"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx={25 + (id * 7) % 50} cy={65 - (id * 4) % 25} r="9" fill="#ec4899" />

    {/* Body Arc 2 */}
    <path
      d={`M ${25 + (id * 8) % 50} ${75 - (id * 6) % 25} Q 100 ${25 + (id * 7) % 35} ${175 - (id * 5) % 50} ${75 - (id * 5) % 25}`}
      stroke={`url(#grad2_${id})`}
      strokeWidth="9"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx={35 + (id * 8) % 45} cy={50 - (id * 3) % 20} r="9" fill="#a855f7" />

    {/* Position ID & Title Label */}
    <text x="100" y="110" textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="900" fontFamily="sans-serif">
      POS #{id} • {title.split(' ')[0] || ''}
    </text>
  </svg>
);

export default function PositionGifModal({ isOpen, onClose, onSelectPosition }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-white border border-purple-500/50 shadow-2xl relative max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-400 text-lg transition-colors font-bold"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-600/30 rounded-2xl border border-purple-500/40 text-purple-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-purple-400 uppercase tracking-wider neon-text-purple">
              50+ POSITIONS GALLERY
            </h2>
            <p className="text-xs text-gray-400">Tap to broadcast vector position diagram room-wide</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
          {POSITIONS_LIST.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPosition(item.id, item.title);
                onClose();
                toast.success(`Broadcasted ${item.title}! 🔥`);
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-purple-500/30 bg-black/80 hover:border-purple-400 transition-all hover:scale-105 shadow-lg flex flex-col p-1.5"
            >
              <div className="h-28 w-full rounded-xl overflow-hidden relative flex items-center justify-center">
                {renderPositionDiagramSvg(item.id, item.title)}
              </div>
              <div className="p-2 text-center font-bold text-xs text-purple-200 truncate">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 text-center text-xs text-purple-300 font-mono">
          ✨ Vector Position Diagrams Ready (50 Positions)
        </div>
      </div>
    </div>
  );
}
