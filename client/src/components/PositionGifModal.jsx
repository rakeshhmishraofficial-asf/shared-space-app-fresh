import React from 'react';
import { X, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

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
  return {
    id: i + 1,
    title: titles[i] || `Position ${i + 1} 🔥`,
    gifUrl: `https://media.tenor.com/m/${(i % 5 === 0) ? '5G5G7x7x7x0AAAAC/hug-love.gif' : (i % 5 === 1) ? '8Y8P8e2t2QAAAAAC/couple-hug.gif' : (i % 5 === 2) ? 'y296_xR6X9AAAAAC/anime-hug.gif' : (i % 5 === 3) ? 'J72D3n-9-JMAAAAC/anime-kiss.gif' : '0vK3q-Xq_84AAAAC/cuddle-couple.gif'}`
  };
});

const getPositionSvg = (id) => (
  <svg viewBox="0 0 200 120" className="w-full h-full bg-[#0d0718]">
    <rect width="200" height="120" fill="#0b0614"/>
    <path d={`M ${20 + (id % 10) * 5} ${80 - (id % 5) * 4} Q 100 50 ${180 - (id % 10) * 5} ${80 - (id % 5) * 4}`} stroke="#ec4899" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <circle cx={35 + (id % 8) * 4} cy={65 - (id % 5) * 3} r="8" fill="#ec4899"/>
    <path d={`M ${30 + (id % 10) * 5} ${70 - (id % 5) * 4} Q 100 40 ${170 - (id % 10) * 5} ${70 - (id % 5) * 4}`} stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <circle cx={40 + (id % 8) * 4} cy={50 - (id % 5) * 3} r="8" fill="#8b5cf6"/>
    <text x="100" y="110" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
      POS #{id}
    </text>
  </svg>
);

export default function PositionGifModal({ isOpen, onClose, onSelectPosition }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-6 max-w-4xl w-full text-white border border-purple-500/50 shadow-2xl relative max-h-[85vh] flex flex-col">
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
            <h2 className="text-xl font-black text-purple-400 uppercase tracking-wider neon-text-purple">
              50+ POSITIONS GALLERY
            </h2>
            <p className="text-xs text-gray-400">Select a position vector diagram to broadcast room-wide</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
          {POSITIONS_LIST.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPosition(item.gifUrl, item.title, item.id);
                onClose();
                toast.success(`Broadcasted ${item.title}!`);
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-purple-500/30 bg-black/60 hover:border-purple-400 transition-all hover:scale-105 shadow-lg relative flex flex-col"
            >
              <div className="h-28 w-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                {getPositionSvg(item.id)}
              </div>
              <div className="p-2 bg-purple-950/40 text-center font-bold text-[11px] text-purple-200 truncate">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-purple-400/80 font-mono">
          ✨ Room-Wide Position Sync Active (50 Positions)
        </div>
      </div>
    </div>
  );
}
