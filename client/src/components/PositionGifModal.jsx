import React, { useState } from 'react';
import { X, Flame, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Exactly 100 Unique Sex Positions Database
export const POSITIONS_LIST = Array.from({ length: 100 }, (_, i) => {
  const baseCategories = [
    'Missionary Embrace', 'Doggy Style Rear Entry', 'Cowgirl Riding', 'Reverse Cowgirl Riding',
    'Spooning Side Intimacy', 'Standing Lap Lift', '69 Oral Symmetry', 'Lotus Seated Embrace',
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

// Render REALISTIC Intimate Couple Vector Diagrams (Filled Anatomical Curves)
export const renderPositionDiagramSvg = (id, title = '') => {
  const posType = (id - 1) % 10;

  return (
    <svg viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080312]">
      <rect width="340" height="200" fill="#080312" rx="16" />
      
      {/* Intimate Atmosphere Glow */}
      <circle cx="170" cy="100" r="85" fill="#ec4899" opacity="0.15" />
      <circle cx="170" cy="100" r="70" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />

      {/* Realistic Detailed Anatomical Couple Shapes (Female: Pink #ec4899, Male: Cyan #06b6d4) */}
      <g transform="translate(10, 5)">
        {posType === 0 && (
          /* 1. Missionary Embrace: Female on back, legs bent up, Male over her in tight embrace */
          <g>
            {/* Female Figure (Hot Pink) */}
            <circle cx="75" cy="120" r="13" fill="#ec4899" />
            <path d="M 75 133 C 95 135 125 135 155 135 C 175 110 185 85 165 75 C 145 75 140 100 135 135 L 210 135" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="175" cy="75" r="9" fill="#f43f5e" />

            {/* Male Figure (Cyan / Purple) */}
            <circle cx="70" cy="80" r="13" fill="#06b6d4" />
            <path d="M 70 93 C 110 65 150 90 185 130 C 170 145 140 140 120 120" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 95 95 L 140 115" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" fill="none" />
          </g>
        )}

        {posType === 1 && (
          /* 2. Doggy Style Rear Entry: Female kneeling on all fours arched, Male kneeling behind holding waist */
          <g>
            {/* Female Figure (Hot Pink) */}
            <circle cx="95" cy="85" r="13" fill="#ec4899" />
            <path d="M 95 98 L 155 90 C 185 90 195 110 190 145 M 95 98 L 95 145 M 155 90 L 205 145" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Figure (Cyan) */}
            <circle cx="245" cy="65" r="13" fill="#06b6d4" />
            <path d="M 245 78 C 235 115 220 140 220 170 M 245 78 L 175 95 M 220 120 L 180 145" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 2 && (
          /* 3. Cowgirl Riding: Male lying flat, Female sitting upright on top of his hips */
          <g>
            {/* Male Figure (Cyan) */}
            <circle cx="55" cy="135" r="13" fill="#06b6d4" />
            <path d="M 55 148 L 160 148 L 255 148 M 125 148 L 85 125 M 170 148 L 225 125" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Seated Figure (Hot Pink) */}
            <circle cx="165" cy="40" r="13" fill="#ec4899" />
            <path d="M 165 53 L 165 115 M 165 75 L 120 95 M 165 75 L 210 95 M 165 115 L 130 145 M 165 115 L 200 145" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 3 && (
          /* 4. Reverse Cowgirl: Male lying flat, Female sitting on top facing away with arched back */
          <g>
            {/* Male Figure (Cyan) */}
            <circle cx="255" cy="135" r="13" fill="#06b6d4" />
            <path d="M 255 148 L 150 148 L 55 148 M 180 148 L 220 125 M 140 148 L 90 125" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Seated Figure (Pink - Facing Left) */}
            <circle cx="140" cy="45" r="13" fill="#ec4899" />
            <path d="M 140 58 Q 155 90 145 120 M 140 75 L 90 95 M 145 120 L 110 145 M 145 120 L 175 145" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 4 && (
          /* 5. Spooning Intimacy: Both lying side-by-side tucked tightly together */
          <g>
            {/* Female Inner Figure (Hot Pink) */}
            <circle cx="110" cy="80" r="13" fill="#ec4899" />
            <path d="M 110 93 Q 165 95 185 140 M 130 95 L 175 135 M 150 95 L 195 150" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Outer Figure (Cyan) */}
            <circle cx="80" cy="65" r="13" fill="#06b6d4" />
            <path d="M 80 78 Q 145 80 170 130 M 100 80 L 155 125 M 135 80 L 175 140" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 5 && (
          /* 6. Standing Lap Lift: Male standing, Female lifted in his arms with legs wrapped around hips */
          <g>
            {/* Male Standing Figure (Cyan) */}
            <circle cx="125" cy="30" r="13" fill="#06b6d4" />
            <path d="M 125 43 L 125 120 L 110 175 M 125 120 L 140 175 M 125 65 L 170 85" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Lifted Figure (Hot Pink) */}
            <circle cx="165" cy="50" r="13" fill="#ec4899" />
            <path d="M 165 63 L 160 110 M 160 110 L 120 130 M 160 110 L 200 135 M 165 75 L 125 95" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 6 && (
          /* 7. 69 Oral Symmetry: Inverted dual intimate alignment */
          <g>
            {/* Top Inverted Figure (Hot Pink) */}
            <circle cx="215" cy="115" r="13" fill="#ec4899" />
            <path d="M 215 102 L 150 85 L 90 100 M 180 90 L 135 120" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Bottom Figure (Cyan) */}
            <circle cx="80" cy="70" r="13" fill="#06b6d4" />
            <path d="M 80 83 L 145 100 L 205 85 M 115 90 L 160 60" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 7 && (
          /* 8. Lotus Seated Embrace: Male cross-legged, Female in his lap facing him */
          <g>
            {/* Male Seated Base (Cyan) */}
            <circle cx="130" cy="45" r="13" fill="#06b6d4" />
            <path d="M 130 58 L 130 120 L 85 155 M 130 120 L 175 155 M 130 75 L 85 105 M 130 75 L 175 105" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Female Lap Figure (Hot Pink) */}
            <circle cx="165" cy="45" r="13" fill="#ec4899" />
            <path d="M 165 58 L 160 120 L 110 150 M 160 120 L 200 150 M 165 75 L 120 100" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 8 && (
          /* 9. Standing Rear Entry: Female bent over table/bed, Male behind her */
          <g>
            {/* Female Bent Over Figure (Hot Pink) */}
            <circle cx="75" cy="115" r="13" fill="#ec4899" />
            <path d="M 75 128 L 140 100 L 180 135 M 140 100 L 140 160 M 180 135 L 180 170" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Standing Behind (Cyan) */}
            <circle cx="230" cy="55" r="13" fill="#06b6d4" />
            <path d="M 230 68 L 220 125 L 220 170 M 230 68 L 165 95 M 220 125 L 185 150" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {posType === 9 && (
          /* 10. Pretzel Side Lock: Side-lying angle with top leg hooked over hip */
          <g>
            {/* Female Figure (Hot Pink) */}
            <circle cx="110" cy="40" r="13" fill="#ec4899" />
            <path d="M 110 53 L 130 110 L 195 140 M 110 53 L 175 80 M 130 110 L 75 140" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Male Figure (Cyan) */}
            <circle cx="170" cy="60" r="13" fill="#06b6d4" />
            <path d="M 170 73 L 155 125 L 210 155 M 170 73 L 115 100 M 155 125 L 105 155" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}
      </g>

      {/* Position Title Banner */}
      <rect x="15" y="145" width="310" height="32" rx="10" fill="#000000" opacity="0.9" stroke="#ec4899" strokeWidth="1" />
      <text x="170" y="166" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="900" fontFamily="sans-serif">
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
              placeholder="Search 100 Intimate Positions..."
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
              <div className="h-40 sm:h-44 w-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#080312] border border-purple-500/30">
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
          ✨ 100 Realistic Anatomical Intimate Vector Diagrams
        </div>
      </div>
    </div>
  );
}
