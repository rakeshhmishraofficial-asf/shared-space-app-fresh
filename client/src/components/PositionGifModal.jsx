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
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080312]">
      <rect width="320" height="200" fill="#080312" rx="16" />
      
      {/* Background Radial Glow */}
      <circle cx="160" cy="100" r="85" fill="#581c87" opacity="0.25" />
      <circle cx="160" cy="100" r="75" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" />

      {/* Dynamic Anatomical Couple Figures */}
      <g transform="translate(10, 5)">
        {posIndex === 0 && (
          /* Missionary: Lower partner horizontal, upper partner arched over */
          <>
            <circle cx="70" cy="125" r="14" fill="#ec4899" />
            <path d="M 70 139 L 150 140 L 230 140 M 150 140 L 190 168 M 150 140 L 200 125" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="65" cy="85" r="14" fill="#a855f7" />
            <path d="M 65 99 Q 130 65 190 135 M 120 90 L 165 155 M 120 90 L 100 145" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 1 && (
          /* Doggy Style: Kneeling partner on all fours, rear partner standing/kneeling */
          <>
            <circle cx="100" cy="90" r="14" fill="#ec4899" />
            <path d="M 100 104 L 165 105 L 210 145 M 100 104 L 100 150 M 165 105 L 210 105 L 210 150" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="230" cy="70" r="14" fill="#a855f7" />
            <path d="M 230 84 L 220 130 L 220 170 M 230 84 L 180 105 M 220 130 L 185 155" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 2 && (
          /* Cowgirl: Lower partner flat, top partner upright seated */
          <>
            <circle cx="60" cy="135" r="14" fill="#a855f7" />
            <path d="M 60 149 L 160 149 L 245 149 M 130 149 L 85 125 M 160 149 L 220 125" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="160" cy="45" r="14" fill="#ec4899" />
            <path d="M 160 59 L 160 120 M 160 80 L 115 105 M 160 80 L 205 105 M 160 120 L 125 145 M 160 120 L 195 145" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 3 && (
          /* Spooning: Parallel curved side-by-side bodies */
          <>
            <circle cx="105" cy="85" r="14" fill="#ec4899" />
            <path d="M 105 99 Q 160 100 180 145 M 125 100 L 170 140 M 145 100 L 190 155" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="75" cy="70" r="14" fill="#a855f7" />
            <path d="M 75 84 Q 140 85 165 135 M 95 85 L 150 130 M 130 85 L 170 145" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 4 && (
          /* 69 Inverted Position */
          <>
            <circle cx="205" cy="120" r="14" fill="#ec4899" />
            <path d="M 205 106 L 140 90 L 85 105 M 170 95 L 125 125" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="75" cy="75" r="14" fill="#a855f7" />
            <path d="M 75 89 L 140 105 L 195 90 M 110 95 L 155 65" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 5 && (
          /* Standing Position: Vertical postures */
          <>
            <circle cx="125" cy="35" r="14" fill="#a855f7" />
            <path d="M 125 49 L 125 125 L 110 175 M 125 125 L 140 175 M 125 75 L 170 95" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="170" cy="55" r="14" fill="#ec4899" />
            <path d="M 170 69 L 165 115 M 165 115 L 125 135 M 165 115 L 205 140 M 170 80 L 125 100" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 6 && (
          /* Lotus Seated Position */
          <>
            <circle cx="130" cy="50" r="14" fill="#a855f7" />
            <path d="M 130 64 L 130 125 L 85 160 M 130 125 L 175 160 M 130 85 L 85 115 M 130 85 L 175 115" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="165" cy="50" r="14" fill="#ec4899" />
            <path d="M 165 64 L 160 125 L 110 155 M 160 125 L 200 155 M 165 85 L 120 110" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 7 && (
          /* High Arch Bridge Position */
          <>
            <circle cx="65" cy="135" r="14" fill="#ec4899" />
            <path d="M 65 149 Q 140 35 225 149 M 65 149 L 45 170 M 225 149 L 245 170" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="160" cy="70" r="14" fill="#a855f7" />
            <path d="M 160 84 L 155 135 M 155 135 L 115 170 M 155 135 L 190 170" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 8 && (
          /* Suspended Pretzel Position */
          <>
            <circle cx="110" cy="45" r="14" fill="#ec4899" />
            <path d="M 110 59 L 130 115 L 190 145 M 110 59 L 170 85 M 130 115 L 75 145" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="170" cy="65" r="14" fill="#a855f7" />
            <path d="M 170 79 L 155 130 L 210 160 M 170 79 L 115 105 M 155 130 L 105 160" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}

        {posIndex === 9 && (
          /* Scissors Position */
          <>
            <circle cx="70" cy="120" r="14" fill="#ec4899" />
            <path d="M 70 134 L 150 120 L 230 80 M 150 120 L 190 150" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            <circle cx="230" cy="120" r="14" fill="#a855f7" />
            <path d="M 230 134 L 150 120 L 70 80 M 150 120 L 110 150" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}
      </g>

      {/* Title Tag */}
      <rect x="15" y="155" width="290" height="34" rx="12" fill="#000000" opacity="0.85" stroke="#a855f7" strokeWidth="1" />
      <text x="160" y="177" textAnchor="middle" fill="#ec4899" fontSize="13" fontWeight="900" fontFamily="sans-serif">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-4 sm:p-6 max-w-5xl w-full text-white border-2 border-purple-500/60 shadow-2xl relative h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all font-bold z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pr-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/30 rounded-2xl border border-purple-500/40 text-purple-400">
              <Flame className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-400 uppercase tracking-wider neon-text-purple">
                200 POSITIONS GALLERY 🔥
              </h2>
              <p className="text-xs text-gray-400">Tap any large position rectangle to broadcast room-wide</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
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

        {/* 200 Position Grid Area with LARGE Rectangle Cards for Easy Mobile Tapping */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pr-2">
          {filteredPositions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPosition(item.id, item.title);
                onClose();
                toast.success(`Broadcasted ${item.title}! 🔥`);
              }}
              className="group cursor-pointer rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-black/90 hover:border-pink-500 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex flex-col p-3"
            >
              {/* LARGE Diagram Canvas Container */}
              <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#080312] border border-purple-500/20">
                {renderPositionDiagramSvg(item.id, item.title)}
              </div>
              <div className="mt-3 px-1 flex items-center justify-between">
                <span className="font-black text-sm sm:text-base text-purple-200 truncate">
                  {item.title}
                </span>
                <span className="text-xs font-black text-pink-400 bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30 whitespace-nowrap ml-2">
                  Broadcast ⚡
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 text-center text-xs text-purple-300 font-mono">
          ✨ 200 Large Anatomical Vector Position Cards Ready
        </div>
      </div>
    </div>
  );
}
