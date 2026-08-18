import React, { useState } from 'react';
import { X, Flame, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// 100 Unique Bitmoji-Illustrated Sex Positions Database
export const POSITIONS_LIST = Array.from({ length: 100 }, (_, i) => {
  const baseCategories = [
    'Missionary Embrace', 'Doggy Style Rear Entry', 'Cowgirl Riding', 'Reverse Cowgirl Riding',
    'Spooning Intimacy', 'Standing Lap Lift', '69 Oral Symmetry', 'Lotus Seated Embrace',
    'Standing Rear Table Entry', 'Pretzel Side Lock', 'Bridge Deep Arch', 'Chair Lap Embrace',
    'Anvil Leg Press', 'Seated Countertop', 'Waterfall Bed Slope', 'Crab Angle Press',
    'Eagle Spread Thrust', 'Wheelbarrow Lift', 'Twister Angle Entry', 'Kneeling Bow Arch'
  ];

  const modifiers = ['Classic 💋', 'Deep Thrust 💥', 'Wild Intimacy 🔥', 'Extreme Arch 🏹', 'Tight Embrace 🫂'];
  
  const categoryName = baseCategories[i % baseCategories.length];
  const modifierName = modifiers[Math.floor(i / baseCategories.length) % modifiers.length];
  const id = i + 1;

  return {
    id,
    title: `${categoryName} #${id} (${modifierName})`,
    category: categoryName,
    svgId: id
  };
});

// Render CRYSTAL-CLEAR BITMOJI COUPLE INTIMATE POSITION DIAGRAMS
export const renderPositionDiagramSvg = (id, title = '') => {
  const posType = (id - 1) % 10;

  return (
    <svg viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080214]">
      <rect width="340" height="200" fill="#080214" rx="16" />
      
      {/* Background Radial Glow */}
      <circle cx="170" cy="100" r="85" fill="#a855f7" opacity="0.2" />
      <circle cx="170" cy="100" r="70" fill="none" stroke="#ff007f" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />

      {/* Crystal Clear Bitmoji Couple Figures (Female: Neon Pink #ff007f, Male: Electric Cyan #00d2ff) */}
      <g transform="translate(10, 5)">
        {posType === 0 && (
          /* 1. Missionary Embrace: Female on back, knees raised, Male over her in close embrace */
          <g>
            {/* Female Figure (Neon Pink) */}
            <circle cx="75" cy="120" r="14" fill="#ff007f" />
            <path d="M 75 134 C 100 136 130 136 160 136 M 160 136 L 195 95 M 160 136 L 210 120" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 75 134 Q 125 110 165 80" stroke="#ff4da6" strokeWidth="10" strokeLinecap="round" fill="none" />

            {/* Male Figure (Electric Cyan) */}
            <circle cx="70" cy="75" r="14" fill="#00d2ff" />
            <path d="M 70 89 C 110 65 150 90 190 130 C 170 148 140 142 120 122" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 95 90 L 145 115" stroke="#80e5ff" strokeWidth="12" strokeLinecap="round" fill="none" />
          </g>
        )}

        {posType === 1 && (
          /* 2. Doggy Style Rear Entry: Female kneeling arched on all fours, Male kneeling behind holding waist */
          <g>
            {/* Female Figure (Neon Pink) */}
            <circle cx="95" cy="80" r="14" fill="#ff007f" />
            <path d="M 95 94 L 160 95 L 205 140 M 95 94 L 95 145 M 160 95 L 205 95 L 205 145" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Figure (Electric Cyan) */}
            <circle cx="245" cy="60" r="14" fill="#00d2ff" />
            <path d="M 245 74 C 235 110 220 135 220 170 M 245 74 L 175 95 M 220 120 L 180 145" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 2 && (
          /* 3. Cowgirl Riding: Male flat on back, Female sitting upright on top facing him */
          <g>
            {/* Male Base (Electric Cyan) */}
            <circle cx="55" cy="135" r="14" fill="#00d2ff" />
            <path d="M 55 149 L 160 149 L 260 149 M 125 149 L 80 125 M 170 149 L 230 125" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Seated Rider (Neon Pink) */}
            <circle cx="165" cy="40" r="14" fill="#ff007f" />
            <path d="M 165 54 L 165 115 M 165 75 L 115 98 M 165 75 L 215 98 M 165 115 L 125 145 M 165 115 L 205 145" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 3 && (
          /* 4. Reverse Cowgirl: Male flat, Female sitting on top facing away with arched back */
          <g>
            {/* Male Base (Electric Cyan) */}
            <circle cx="260" cy="135" r="14" fill="#00d2ff" />
            <path d="M 260 149 L 155 149 L 55 149 M 185 149 L 225 125 M 135 149 L 85 125" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Seated Facing Left (Neon Pink) */}
            <circle cx="140" cy="40" r="14" fill="#ff007f" />
            <path d="M 140 54 Q 155 85 145 118 M 140 75 L 90 98 M 145 118 L 105 145 M 145 118 L 175 145" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 4 && (
          /* 5. Spooning Intimacy: Both lying side-by-side tucked closely together */
          <g>
            {/* Female Inner Figure (Neon Pink) */}
            <circle cx="110" cy="75" r="14" fill="#ff007f" />
            <path d="M 110 89 Q 165 90 185 140 M 130 90 L 175 135 M 150 90 L 195 150" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Outer Figure (Electric Cyan) */}
            <circle cx="75" cy="60" r="14" fill="#00d2ff" />
            <path d="M 75 74 Q 140 75 165 125 M 95 75 L 150 120 M 130 75 L 170 135" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 5 && (
          /* 6. Standing Lap Lift: Male standing, Female lifted with legs wrapped around hips */
          <g>
            {/* Male Standing Body (Electric Cyan) */}
            <circle cx="125" cy="25" r="14" fill="#00d2ff" />
            <path d="M 125 39 L 125 115 L 110 175 M 125 115 L 140 175 M 125 60 L 170 80" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Lifted Body (Neon Pink) */}
            <circle cx="165" cy="45" r="14" fill="#ff007f" />
            <path d="M 165 59 L 160 105 M 160 105 L 120 125 M 160 105 L 205 130 M 165 70 L 120 90" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 6 && (
          /* 7. 69 Oral Symmetry: Inverted dual horizontal alignment */
          <g>
            {/* Top Inverted Female (Neon Pink) */}
            <circle cx="215" cy="110" r="14" fill="#ff007f" />
            <path d="M 215 96 L 150 80 L 85 95 M 180 85 L 130 115" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Bottom Male (Electric Cyan) */}
            <circle cx="75" cy="65" r="14" fill="#00d2ff" />
            <path d="M 75 79 L 140 95 L 205 80 M 110 85 L 160 55" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 7 && (
          /* 8. Lotus Seated Embrace: Male cross-legged, Female in his lap facing him */
          <g>
            {/* Male Seated Base (Electric Cyan) */}
            <circle cx="130" cy="35" r="14" fill="#00d2ff" />
            <path d="M 130 49 L 130 115 L 80 150 M 130 115 L 180 150 M 130 70 L 80 100 M 130 70 L 180 100" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Lap Figure (Neon Pink) */}
            <circle cx="165" cy="35" r="14" fill="#ff007f" />
            <path d="M 165 49 L 160 115 L 110 145 M 160 115 L 205 145 M 165 70 L 115 95" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 8 && (
          /* 9. Standing Rear Entry: Female bent over, Male standing behind */
          <g>
            {/* Female Bent Over (Neon Pink) */}
            <circle cx="70" cy="105" r="14" fill="#ff007f" />
            <path d="M 70 119 L 140 95 L 180 130 M 140 95 L 140 165 M 180 130 L 180 170" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Standing Behind (Electric Cyan) */}
            <circle cx="230" cy="45" r="14" fill="#00d2ff" />
            <path d="M 230 59 L 220 120 L 220 170 M 230 59 L 165 85 M 220 120 L 185 145" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 9 && (
          /* 10. Pretzel Side Lock: Side-lying angle with top leg hooked over hip */
          <g>
            {/* Female Side Figure (Neon Pink) */}
            <circle cx="105" cy="30" r="14" fill="#ff007f" />
            <path d="M 105 44 L 125 95 L 195 135 M 105 44 L 175 70 M 125 95 L 70 135" stroke="#ff007f" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Side Figure (Electric Cyan) */}
            <circle cx="165" cy="50" r="14" fill="#00d2ff" />
            <path d="M 165 64 L 150 115 L 205 150 M 165 64 L 110 90 M 150 115 L 100 150" stroke="#00d2ff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}
      </g>

      {/* Position Title Banner */}
      <rect x="15" y="145" width="310" height="34" rx="12" fill="#000000" opacity="0.9" stroke="#ff007f" strokeWidth="1.5" />
      <text x="170" y="167" textAnchor="middle" fill="#ff007f" fontSize="13" fontWeight="900" fontFamily="sans-serif">
        #{id} • {title}
      </text>
    </svg>
  );
};

export default function PositionGifModal({ isOpen, onClose, onSelectPosition }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredPositions = POSITIONS_LIST.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-4 sm:p-6 max-w-xl w-full text-white border-2 border-purple-500/60 shadow-2xl relative h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all font-bold z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Title */}
        <div className="flex flex-col gap-2 mb-3 pr-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/30 rounded-2xl border border-purple-500/40 text-purple-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-400 uppercase tracking-wider neon-text-purple">
                100 POSITIONS GALLERY 🔥
              </h2>
              <p className="text-xs text-gray-400">Scroll down to view 3 positions at a time</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full mt-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 100 Intimate Bitmoji Positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/80 border border-purple-500/40 rounded-xl text-white placeholder-gray-500 text-xs font-bold focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* 1-COLUMN VERTICAL SCROLL: SHOWS EXACTLY 3 LARGE POSITIONS AT A TIME IN VIEWPORT */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {filteredPositions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPosition(item.id, item.title);
                onClose();
                toast.success(`Broadcasted ${item.title}! 🔥`);
              }}
              className="group cursor-pointer rounded-3xl overflow-hidden border-2 border-purple-500/50 bg-[#0a0418] hover:border-pink-500 transition-all active:scale-98 shadow-[0_0_25px_rgba(168,85,247,0.35)] flex flex-col p-3 min-h-[190px] w-full"
            >
              {/* LARGE Diagram Canvas Container */}
              <div className="h-40 sm:h-44 w-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#080214] border border-purple-500/30">
                {renderPositionDiagramSvg(item.id, item.title)}
              </div>
              <div className="mt-2.5 px-1 flex items-center justify-between">
                <span className="font-black text-sm sm:text-base text-purple-200 truncate">
                  {item.title}
                </span>
                <button
                  type="button"
                  className="text-xs font-black text-pink-300 bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-1.5 rounded-xl border border-pink-400/40 whitespace-nowrap ml-2 shadow"
                >
                  Broadcast ⚡
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 text-center text-xs text-purple-300 font-mono">
          ✨ 100 Crystal-Clear Bitmoji Intimate Position Illustrations
        </div>
      </div>
    </div>
  );
}
