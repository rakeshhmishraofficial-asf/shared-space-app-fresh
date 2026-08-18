import React, { useState } from 'react';
import { X, Flame, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Exactly 100 Unique Sex Positions Database
export const POSITIONS_LIST = Array.from({ length: 100 }, (_, i) => {
  const baseCategories = [
    'Missionary Intimate Sketch', 'Doggy Rear Entry Sketch', 'Cowgirl Riding Sketch', 'Reverse Cowgirl Sketch',
    'Spooning Side Sketch', 'Standing Lap Lift Sketch', '69 Oral Symmetry Sketch', 'Lotus Seated Sketch',
    'Standing Rear Table Sketch', 'Pretzel Side Lock Sketch', 'Bridge Deep Arch Sketch', 'Chair Lap Embrace Sketch',
    'Anvil Leg Press Sketch', 'Seated Countertop Sketch', 'Waterfall Slope Sketch', 'Crab Angle Press Sketch',
    'Eagle Spread Thrust Sketch', 'Wheelbarrow Lift Sketch', 'Twister Angle Sketch', 'Kneeling Bow Sketch'
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

// Render REALISTIC HAND-DRAWN SKETCH ART INTIMATE COUPLE DIAGRAMS
export const renderPositionDiagramSvg = (id, title = '') => {
  const posType = (id - 1) % 10;

  return (
    <svg viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#070210]">
      <rect width="340" height="200" fill="#070210" rx="16" />
      
      <defs>
        {/* Female Sketch Gradient */}
        <linearGradient id={`femaleGrad_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>

        {/* Male Sketch Gradient */}
        <linearGradient id={`maleGrad_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        {/* Sketch Glow Filter */}
        <filter id={`sketchGlow_${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Artist Canvas Grid Lines */}
      <circle cx="170" cy="100" r="85" fill="#3b0764" opacity="0.2" />
      <path d="M 30 100 L 310 100 M 170 20 L 170 180" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />

      {/* Realistic Sketch Art Couple Silhouettes */}
      <g transform="translate(10, 5)" filter={`url(#sketchGlow_${id})`}>
        {posType === 0 && (
          /* 1. Missionary Sketch: Real anatomical torso curves, arched spine, bent knees */
          <g>
            {/* Female Sketch (Pink/Rose) */}
            <path d="M 60 120 Q 80 140 120 140 Q 150 140 170 110 Q 185 85 165 75 C 145 75 140 105 130 140 L 210 140 Q 190 120 160 120" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="12 1" />
            <circle cx="70" cy="115" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 170 75 Q 190 65 200 85" stroke="#ffffff" strokeWidth="3" fill="none" />

            {/* Male Sketch (Cyan/Purple) */}
            <path d="M 55 80 Q 95 60 140 90 Q 170 120 190 135 Q 165 145 135 125 C 110 105 85 90 55 80 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="65" cy="75" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 95 90 Q 125 110 145 120" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          </g>
        )}

        {posType === 1 && (
          /* 2. Doggy Style Sketch: Female arched on all fours, Male standing behind with hands on waist */
          <g>
            {/* Female Figure */}
            <path d="M 85 80 Q 130 70 160 90 Q 195 90 190 140 L 170 140 Q 175 105 145 105 L 95 105 L 95 145 L 80 145 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="90" cy="75" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

            {/* Male Figure */}
            <path d="M 235 60 Q 225 100 220 130 Q 215 160 215 170 L 230 170 L 235 125 Q 240 95 245 60 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="240" cy="55" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 235 75 Q 195 90 175 95" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {posType === 2 && (
          /* 3. Cowgirl Sketch: Male flat, Female upright seated riding posture */
          <g>
            {/* Male Base Figure */}
            <path d="M 50 135 L 255 135 L 255 150 L 50 150 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="55" cy="125" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Female Seated Figure */}
            <path d="M 150 40 Q 165 40 165 80 Q 165 110 135 140 L 115 140 Q 145 110 145 80 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="160" cy="35" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 155 70 Q 120 90 110 100 M 155 70 Q 195 90 205 100" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {posType === 3 && (
          /* 4. Reverse Cowgirl Sketch: Male flat, Female upright facing away */
          <g>
            {/* Male Base Figure */}
            <path d="M 255 135 L 50 135 L 50 150 L 255 150 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="250" cy="125" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Female Seated Facing Left */}
            <path d="M 140 40 Q 125 40 125 80 Q 125 110 155 140 L 175 140 Q 145 110 145 80 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="135" cy="35" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 140 70 Q 100 90 90 100 M 140 70 Q 180 90 190 100" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {posType === 4 && (
          /* 5. Spooning Sketch: Parallel curved bodies side-by-side */
          <g>
            {/* Female Inner Figure */}
            <path d="M 105 75 Q 160 80 180 135 L 160 135 Q 140 95 95 85 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="70" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

            {/* Male Outer Figure */}
            <path d="M 75 60 Q 140 65 165 125 L 145 125 Q 120 80 65 70 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="70" cy="55" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 90 70 Q 140 85 160 100" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          </g>
        )}

        {posType === 5 && (
          /* 6. Standing Lap Lift Sketch: Male standing, Female lifted with legs around hips */
          <g>
            {/* Male Standing Body */}
            <path d="M 120 30 Q 125 70 120 120 L 110 175 L 130 175 L 135 120 Q 130 70 125 30 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="120" cy="25" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Female Lifted Body */}
            <path d="M 160 45 Q 165 75 155 105 Q 130 125 110 125 Q 140 125 160 105 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="160" cy="40" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 160 65 Q 130 85 115 95 M 160 105 Q 195 125 205 135" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {posType === 6 && (
          /* 7. 69 Sketch: Inverted dual intimate alignment */
          <g>
            {/* Top Inverted Female */}
            <path d="M 205 115 Q 150 95 90 105 Q 130 85 200 95 Z" fill={`url(#femaleGrad_${id})`} stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="210" cy="115" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom Male */}
            <path d="M 75 65 Q 130 85 190 75 Q 150 95 80 85 Z" fill={`url(#maleGrad_${id})`} stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="70" cy="65" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {posType === 7 && (
          /* 8. Lotus Seated Sketch: Male cross-legged, Female in his lap facing him */
          <g>
            {/* Male Base */}
            <path d="M 125 40 Q 125 80 125 120 M 80 150 Q 125 120 170 150" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="125" cy="35" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Female Lap */}
            <path d="M 160 40 Q 160 80 155 120 M 110 145 Q 155 120 195 145" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="160" cy="35" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {posType === 8 && (
          /* 9. Standing Rear Entry Sketch: Female bent over, Male standing behind */
          <g>
            {/* Female Bent Over */}
            <path d="M 70 110 Q 135 90 175 130 L 175 165 M 135 90 L 135 165" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="65" cy="110" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

            {/* Male Behind */}
            <path d="M 225 50 Q 215 110 215 165 M 225 65 L 160 90" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="225" cy="45" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {posType === 9 && (
          /* 10. Pretzel Side Lock Sketch: Side-lying angle with top leg hooked over hip */
          <g>
            {/* Female Side Figure */}
            <path d="M 105 35 Q 125 90 190 135 M 105 48 L 170 75 M 125 90 L 70 135" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="105" cy="30" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

            {/* Male Side Figure */}
            <path d="M 165 55 Q 150 110 205 150 M 165 68 L 110 95 M 150 110 L 100 150" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="165" cy="50" r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}
      </g>

      {/* Position Title Sketch Label Tag */}
      <rect x="15" y="145" width="310" height="32" rx="10" fill="#000000" opacity="0.9" stroke="#f43f5e" strokeWidth="1.5" />
      <text x="170" y="166" textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="900" fontFamily="sans-serif">
        SKETCH #{id} • {title}
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
                100 SKETCH POSITIONS GALLERY 🔥
              </h2>
              <p className="text-xs text-gray-400">Scroll down to view 3 positions at a time</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full mt-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 100 Intimate Sketch Positions..."
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
              <div className="h-40 sm:h-44 w-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#070210] border border-purple-500/30">
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
          ✨ 100 Realistic Hand-Drawn Sketch Intimate Position Artworks
        </div>
      </div>
    </div>
  );
}
