import React, { useState } from 'react';
import { X, Flame, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// 200 Unique Sex Positions Database
export const POSITIONS_LIST = Array.from({ length: 200 }, (_, i) => {
  const baseCategories = [
    'Missionary', 'Doggy Style', 'Cowgirl', 'Reverse Cowgirl', 'Spooning',
    'Standing', '69 Position', 'Lotus', 'Scissors', 'Bridge',
    'Butterfly', 'Pretzel', 'Chair Embrace', 'Anvil', 'Standing Rear',
    'Seated Countertop', 'Waterfall', 'Crab Arch', 'Eagle Spread', 'Wheelbarrow',
    'Twister', 'Side Entry', 'Elevated Lotus', 'Kneeling Arch', 'Cradle Hold',
    'Starfish', 'T-Square', 'G-Spot Angle', 'Deep Thrust', 'Suspension Wire',
    'Lounge Chair', 'Fountain', 'V-Angle', 'Bended Knee', 'Rear Spooning',
    'Over Shoulder', 'Arching Bridge', 'Cross Leg Lock', 'High Angle', 'Low Rider'
  ];
  
  const modifiers = ['Classic 💋', 'Deep Thrust 💥', 'Wild Heat 🔥', 'Extreme Arch 🏹', 'Tight Hug 🫂'];
  
  const categoryName = baseCategories[i % baseCategories.length];
  const modifierName = modifiers[Math.floor(i / baseCategories.length) % modifiers.length];
  const id = i + 1;

  return {
    id,
    title: `${categoryName} Vol. ${Math.floor(i / 40) + 1} ${modifierName}`,
    category: categoryName,
    svgId: id
  };
});

// Render complete, high-contrast, multi-figure anatomical vector diagrams for 100% mobile visibility
export const renderPositionDiagramSvg = (id, title = '') => {
  const posIndex = (id - 1) % 10;

  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080312]">
      <rect width="320" height="180" fill="#080312" rx="16" />
      
      {/* Background Radial Glow */}
      <circle cx="160" cy="90" r="75" fill="#581c87" opacity="0.3" />
      <circle cx="160" cy="90" r="65" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />

      {/* Dynamic Anatomical Couple Figures */}
      <g transform="translate(10, 0)">
        {posIndex === 0 && (
          /* Missionary: Lower partner horizontal, upper partner arched over */
          <>
            <circle cx="70" cy="115" r="14" fill="#ec4899" />
            <path d="M 70 129 L 150 130 L 230 130 M 150 130 L 190 158 M 150 130 L 200 115" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="65" cy="75" r="14" fill="#a855f7" />
            <path d="M 65 89 Q 130 55 190 125 M 120 80 L 165 145 M 120 80 L 100 135" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 1 && (
          /* Doggy Style: Kneeling partner on all fours, rear partner standing/kneeling */
          <>
            <circle cx="100" cy="80" r="14" fill="#ec4899" />
            <path d="M 100 94 L 165 95 L 210 135 M 100 94 L 100 140 M 165 95 L 210 95 L 210 140" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="230" cy="60" r="14" fill="#a855f7" />
            <path d="M 230 74 L 220 120 L 220 160 M 230 74 L 180 95 M 220 120 L 185 145" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 2 && (
          /* Cowgirl: Lower partner flat, top partner upright seated */
          <>
            <circle cx="60" cy="125" r="14" fill="#a855f7" />
            <path d="M 60 139 L 160 139 L 245 139 M 130 139 L 85 115 M 160 139 L 220 115" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="160" cy="35" r="14" fill="#ec4899" />
            <path d="M 160 49 L 160 110 M 160 70 L 115 95 M 160 70 L 205 95 M 160 110 L 125 135 M 160 110 L 195 135" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 3 && (
          /* Spooning: Parallel curved side-by-side bodies */
          <>
            <circle cx="105" cy="75" r="14" fill="#ec4899" />
            <path d="M 105 89 Q 160 90 180 135 M 125 90 L 170 130 M 145 90 L 190 145" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="75" cy="60" r="14" fill="#a855f7" />
            <path d="M 75 74 Q 140 75 165 125 M 95 75 L 150 120 M 130 75 L 170 135" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 4 && (
          /* 69 Inverted Position */
          <>
            <circle cx="205" cy="110" r="14" fill="#ec4899" />
            <path d="M 205 96 L 140 80 L 85 95 M 170 85 L 125 115" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="75" cy="65" r="14" fill="#a855f7" />
            <path d="M 75 79 L 140 95 L 195 80 M 110 85 L 155 55" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 5 && (
          /* Standing Position: Vertical postures */
          <>
            <circle cx="125" cy="30" r="14" fill="#a855f7" />
            <path d="M 125 44 L 125 115 L 110 165 M 125 115 L 140 165 M 125 65 L 170 85" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="170" cy="45" r="14" fill="#ec4899" />
            <path d="M 170 59 L 165 105 M 165 105 L 125 125 M 165 105 L 205 130 M 170 70 L 125 90" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 6 && (
          /* Lotus Seated Position */
          <>
            <circle cx="130" cy="40" r="14" fill="#a855f7" />
            <path d="M 130 54 L 130 115 L 85 150 M 130 115 L 175 150 M 130 75 L 85 105 M 130 75 L 175 105" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="165" cy="40" r="14" fill="#ec4899" />
            <path d="M 165 54 L 160 115 L 110 145 M 160 115 L 200 145 M 165 75 L 120 100" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 7 && (
          /* High Arch Bridge Position */
          <>
            <circle cx="65" cy="125" r="14" fill="#ec4899" />
            <path d="M 65 139 Q 140 25 225 139 M 65 139 L 45 160 M 225 139 L 245 160" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="160" cy="60" r="14" fill="#a855f7" />
            <path d="M 160 74 L 155 125 M 155 125 L 115 160 M 155 125 L 190 160" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 8 && (
          /* Suspended Pretzel Position */
          <>
            <circle cx="110" cy="35" r="14" fill="#ec4899" />
            <path d="M 110 49 L 130 105 L 190 135 M 110 49 L 170 75 M 130 105 L 75 135" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="170" cy="55" r="14" fill="#a855f7" />
            <path d="M 170 69 L 155 120 L 210 150 M 170 69 L 115 95 M 155 120 L 105 150" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 9 && (
          /* Scissors Position */
          <>
            <circle cx="70" cy="110" r="14" fill="#ec4899" />
            <path d="M 70 124 L 150 110 L 230 70 M 150 110 L 190 140" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="230" cy="110" r="14" fill="#a855f7" />
            <path d="M 230 124 L 150 110 L 70 70 M 150 110 L 110 140" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}
      </g>

      {/* Title Tag */}
      <rect x="15" y="142" width="290" height="30" rx="10" fill="#000000" opacity="0.85" stroke="#a855f7" strokeWidth="1" />
      <text x="160" y="162" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="900" fontFamily="sans-serif">
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
                200 POSITIONS GALLERY 🔥
              </h2>
              <p className="text-xs text-gray-400">Scroll down to view 3 positions at a time</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full mt-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 200 Positions..."
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
          ✨ 200 Large Vector Position Cards (3 Visible Per View)
        </div>
      </div>
    </div>
  );
}
