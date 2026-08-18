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
  
  const id = i + 1;
  return {
    id,
    title: titles[i] || `Position ${id} 🔥`,
    svgId: id
  };
});

// Render complete, high-contrast, multi-figure anatomical vector diagrams for 100% mobile visibility
export const renderPositionDiagramSvg = (id, title = '') => {
  // Determine posture type for dynamic anatomical variations
  const posIndex = (id - 1) % 8;

  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080312]">
      <rect width="300" height="200" fill="#080312" rx="16" />
      
      {/* Background Glow Ring */}
      <circle cx="150" cy="100" r="75" fill="none" stroke="#3b0764" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

      {/* Dynamic Anatomical Couple Figures */}
      <g transform="translate(10, 10)">
        {posIndex === 0 && (
          /* Missionary Layout: Lower figure horizontal, upper figure arched over */
          <>
            {/* Bottom Partner (Pink) */}
            <circle cx="70" cy="120" r="12" fill="#ec4899" />
            <path d="M 70 132 L 140 135 L 210 135 M 140 135 L 175 160 M 140 135 L 180 120" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Top Partner (Purple) */}
            <circle cx="65" cy="85" r="12" fill="#a855f7" />
            <path d="M 65 97 Q 120 70 170 130 M 110 90 L 150 145 M 110 90 L 95 140" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 1 && (
          /* Doggy Style Layout: Bottom figure kneeling on all fours, rear partner standing/kneeling */
          <>
            {/* Kneeling Partner (Pink) */}
            <circle cx="100" cy="90" r="12" fill="#ec4899" />
            <path d="M 100 102 L 150 105 L 190 140 M 100 102 L 100 145 M 150 105 L 190 105 L 190 145" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Rear Partner (Purple) */}
            <circle cx="215" cy="70" r="12" fill="#a855f7" />
            <path d="M 215 82 L 205 125 L 205 160 M 215 82 L 170 105 M 205 125 L 175 145" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 2 && (
          /* Cowgirl Layout: Bottom partner flat, top partner sitting upright */
          <>
            {/* Bottom Partner (Purple) */}
            <circle cx="60" cy="130" r="12" fill="#a855f7" />
            <path d="M 60 142 L 150 142 L 230 142 M 120 142 L 80 120 M 150 142 L 210 120" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Top Seated Partner (Pink) */}
            <circle cx="150" cy="45" r="12" fill="#ec4899" />
            <path d="M 150 57 L 150 115 M 150 75 L 110 100 M 150 75 L 190 100 M 150 115 L 120 140 M 150 115 L 180 140" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 3 && (
          /* Spooning Layout: Parallel curved bodies side-by-side */
          <>
            {/* Inner Partner (Pink) */}
            <circle cx="100" cy="85" r="12" fill="#ec4899" />
            <path d="M 100 97 Q 150 100 170 140 M 120 100 L 160 135 M 140 100 L 180 150" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Outer Partner (Purple) */}
            <circle cx="75" cy="70" r="12" fill="#a855f7" />
            <path d="M 75 82 Q 135 85 160 130 M 95 85 L 145 125 M 125 85 L 165 140" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 4 && (
          /* 69 Position Layout: Inverted dual figures */
          <>
            {/* Top Inverted Partner (Pink) */}
            <circle cx="190" cy="115" r="12" fill="#ec4899" />
            <path d="M 190 103 L 130 90 L 80 100 M 160 95 L 120 120" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Bottom Partner (Purple) */}
            <circle cx="70" cy="75" r="12" fill="#a855f7" />
            <path d="M 70 87 L 130 100 L 180 90 M 100 92 L 140 65" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 5 && (
          /* Standing Position Layout: Vertical standing postures */
          <>
            {/* Standing Partner A (Purple) */}
            <circle cx="120" cy="40" r="12" fill="#a855f7" />
            <path d="M 120 52 L 120 120 L 110 170 M 120 120 L 130 170 M 120 75 L 160 95" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Lifted/Standing Partner B (Pink) */}
            <circle cx="160" cy="55" r="12" fill="#ec4899" />
            <path d="M 160 67 L 155 110 M 155 110 L 120 130 M 155 110 L 190 135 M 160 80 L 120 100" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 6 && (
          /* Lotus Position Layout: Interlocked seated lotus posture */
          <>
            {/* Base Seated Partner (Purple) */}
            <circle cx="125" cy="55" r="12" fill="#a855f7" />
            <path d="M 125 67 L 125 125 L 85 155 M 125 125 L 165 155 M 125 85 L 85 110 M 125 85 L 165 110" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Lap Seated Partner (Pink) */}
            <circle cx="155" cy="55" r="12" fill="#ec4899" />
            <path d="M 155 67 L 150 125 L 105 150 M 150 125 L 185 150 M 155 85 L 115 105" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 7 && (
          /* Bridge Position Layout: High arched bridge posture */
          <>
            {/* Arching Partner (Pink) */}
            <circle cx="65" cy="130" r="12" fill="#ec4899" />
            <path d="M 65 142 Q 130 40 210 142 M 65 142 L 50 160 M 210 142 L 225 160" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Kneeling Partner (Purple) */}
            <circle cx="150" cy="70" r="12" fill="#a855f7" />
            <path d="M 150 82 L 145 130 M 145 130 L 110 160 M 145 130 L 175 160" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}
      </g>

      {/* Position Number & Title Label Overlay */}
      <rect x="15" y="155" width="270" height="32" rx="10" fill="#000000" opacity="0.8" />
      <text x="150" y="176" textAnchor="middle" fill="#ec4899" fontSize="13" fontWeight="900" fontFamily="sans-serif">
        #{id} • {title}
      </text>
    </svg>
  );
};

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
            <p className="text-xs text-gray-400">Tap any position diagram to broadcast room-wide</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-1">
          {POSITIONS_LIST.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPosition(item.id, item.title);
                onClose();
                toast.success(`Broadcasted ${item.title}! 🔥`);
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-black/80 hover:border-purple-400 transition-all hover:scale-[1.02] shadow-lg flex flex-col p-2"
            >
              <div className="h-40 w-full rounded-xl overflow-hidden relative flex items-center justify-center bg-[#080312]">
                {renderPositionDiagramSvg(item.id, item.title)}
              </div>
              <div className="mt-2 text-center font-extrabold text-xs text-purple-200 truncate">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 text-center text-xs text-purple-300 font-mono">
          ✨ 50 Full-Figure Anatomical Vector Position Diagrams
        </div>
      </div>
    </div>
  );
}
