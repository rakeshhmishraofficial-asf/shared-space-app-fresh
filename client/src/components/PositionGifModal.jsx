import React, { useState } from 'react';
import { X, Flame, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// 100 Classic Stick Man & Woman Sex Positions Database
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

// Render CLASSIC STRAIGHT-LIMB STICK MAN & STICK WOMAN POSITION DIAGRAMS
export const renderPositionDiagramSvg = (id, title = '') => {
  const posType = (id - 1) % 10;

  return (
    <svg viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full bg-[#080214]">
      <rect width="340" height="200" fill="#080214" rx="16" />
      
      {/* Background Radial Glow */}
      <circle cx="170" cy="100" r="85" fill="#a855f7" opacity="0.2" />
      <circle cx="170" cy="100" r="70" fill="none" stroke="#ff007f" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />

      {/* Classic Straight-Limb Stick Couple Figures (Female: Pink #ff007f, Male: Cyan #00d2ff) */}
      <g transform="translate(10, 5)">
        {posType === 0 && (
          /* 1. Missionary: Female flat on back with 2 straight legs raised up. Male lying on top with 2 straight arms */
          <g>
            {/* Female Stick Figure (Neon Pink) */}
            <circle cx="65" cy="135" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="77" y1="135" x2="160" y2="135" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="160" y1="135" x2="200" y2="75" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="160" y1="135" x2="215" y2="90" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="100" y1="135" x2="135" y2="95" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="135" x2="155" y2="105" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Male Stick Figure (Electric Cyan) */}
            <circle cx="60" cy="85" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="72" y1="85" x2="155" y2="115" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="155" y1="115" x2="230" y2="135" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="155" y1="115" x2="220" y2="155" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="100" y1="95" x2="140" y2="130" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="95" x2="160" y2="130" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 1 && (
          /* 2. Doggy Style: Female 4 straight legs/arms, horizontal torso. Male standing behind with 2 straight arms */
          <g>
            {/* Female Stick Figure (Neon Pink) */}
            <circle cx="95" cy="85" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="107" y1="85" x2="175" y2="85" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arm Supports */}
            <line x1="115" y1="85" x2="115" y2="150" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="125" y1="85" x2="135" y2="150" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Leg Supports */}
            <line x1="175" y1="85" x2="175" y2="150" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="175" y1="85" x2="195" y2="150" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Male Stick Figure (Electric Cyan) */}
            <circle cx="245" cy="55" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="245" y1="67" x2="225" y2="125" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="225" y1="125" x2="215" y2="175" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="225" y1="125" x2="235" y2="175" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms holding waist */}
            <line x1="240" y1="80" x2="175" y2="85" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="240" y1="80" x2="165" y2="95" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 2 && (
          /* 3. Cowgirl Riding: Male flat on back. Female sitting upright with 2 straight legs and 2 straight arms */
          <g>
            {/* Male Base (Electric Cyan) */}
            <circle cx="55" cy="140" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="67" y1="140" x2="250" y2="140" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="165" y1="140" x2="215" y2="120" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="140" x2="235" y2="160" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="100" y1="140" x2="65" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="140" x2="135" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />

            {/* Female Rider (Neon Pink) */}
            <circle cx="165" cy="40" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="165" y1="52" x2="165" y2="120" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="165" y1="75" x2="115" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="75" x2="215" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="165" y1="120" x2="125" y2="155" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="120" x2="205" y2="155" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 3 && (
          /* 4. Reverse Cowgirl: Male flat, Female sitting upright facing opposite direction */
          <g>
            {/* Male Base (Electric Cyan) */}
            <circle cx="255" cy="140" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="243" y1="140" x2="60" y2="140" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="155" y1="140" x2="105" y2="120" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="155" y1="140" x2="85" y2="160" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="210" y1="140" x2="245" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="210" y1="140" x2="175" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />

            {/* Female Rider Facing Left (Neon Pink) */}
            <circle cx="155" cy="40" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="155" y1="52" x2="155" y2="120" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="155" y1="75" x2="105" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="155" y1="75" x2="205" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="155" y1="120" x2="115" y2="155" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="155" y1="120" x2="195" y2="155" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 4 && (
          /* 5. Spooning: Both stick figures horizontal side-by-side with 2 straight arms and 2 straight legs */
          <g>
            {/* Female Inner Figure (Neon Pink) */}
            <circle cx="110" cy="80" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="122" y1="80" x2="175" y2="95" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="175" y1="95" x2="225" y2="135" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="175" y1="95" x2="210" y2="155" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="140" y1="85" x2="175" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="140" y1="85" x2="190" y2="120" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Male Outer Figure (Electric Cyan) */}
            <circle cx="75" cy="65" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="87" y1="65" x2="150" y2="80" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="150" y1="80" x2="200" y2="120" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="150" y1="80" x2="185" y2="140" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="115" y1="70" x2="160" y2="95" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="115" y1="70" x2="175" y2="105" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 5 && (
          /* 6. Standing Lap Lift: Male standing vertical, Female lifted with 2 straight arms and 2 straight legs */
          <g>
            {/* Male Standing Figure (Electric Cyan) */}
            <circle cx="125" cy="30" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="125" y1="42" x2="125" y2="120" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="125" y1="120" x2="105" y2="175" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="125" y1="120" x2="145" y2="175" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms supporting */}
            <line x1="125" y1="65" x2="170" y2="95" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="125" y1="65" x2="160" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />

            {/* Female Lifted Figure (Neon Pink) */}
            <circle cx="165" cy="45" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="165" y1="57" x2="160" y2="110" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arms around neck */}
            <line x1="165" y1="70" x2="125" y2="45" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="70" x2="125" y2="60" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Legs around waist */}
            <line x1="160" y1="110" x2="115" y2="135" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="160" y1="110" x2="205" y2="140" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 6 && (
          /* 7. 69 Inverted Position: 2 inverted horizontal stick figures */
          <g>
            {/* Top Inverted Female (Neon Pink) */}
            <circle cx="215" cy="110" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="203" y1="110" x2="140" y2="95" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="140" y1="95" x2="80" y2="85" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="140" y1="95" x2="85" y2="115" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="180" y1="105" x2="130" y2="130" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="180" y1="105" x2="110" y2="130" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Bottom Male (Electric Cyan) */}
            <circle cx="75" cy="65" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="87" y1="65" x2="150" y2="80" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="150" y1="80" x2="210" y2="90" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="150" y1="80" x2="205" y2="60" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="110" y1="70" x2="160" y2="45" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="110" y1="70" x2="180" y2="45" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 7 && (
          /* 8. Lotus Seated: Male seated, Female sitting in lap facing him */
          <g>
            {/* Male Seated Base (Electric Cyan) */}
            <circle cx="130" cy="35" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="130" y1="47" x2="130" y2="115" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="130" y1="115" x2="80" y2="150" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="130" y1="115" x2="180" y2="150" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="130" y1="70" x2="80" y2="100" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="130" y1="70" x2="180" y2="100" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />

            {/* Female Lap Rider (Neon Pink) */}
            <circle cx="165" cy="35" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="165" y1="47" x2="160" y2="115" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="165" y1="70" x2="115" y2="95" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="70" x2="215" y2="95" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="160" y1="115" x2="110" y2="145" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="160" y1="115" x2="205" y2="145" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 8 && (
          /* 9. Standing Rear Entry: Female torso bent 90deg forward, 2 straight leg supports. Male standing behind */
          <g>
            {/* Female Bent Over (Neon Pink) */}
            <circle cx="70" cy="105" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="82" y1="105" x2="160" y2="105" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Arm Supports */}
            <line x1="95" y1="105" x2="95" y2="165" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="105" y1="105" x2="115" y2="165" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Leg Supports */}
            <line x1="160" y1="105" x2="150" y2="165" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="160" y1="105" x2="170" y2="165" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Male Standing Behind (Electric Cyan) */}
            <circle cx="230" cy="45" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="230" y1="57" x2="220" y2="120" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="220" y1="120" x2="210" y2="170" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="220" y1="120" x2="230" y2="170" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms holding waist */}
            <line x1="225" y1="75" x2="160" y2="105" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="225" y1="75" x2="150" y2="115" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {posType === 9 && (
          /* 10. Pretzel Side Lock: Side-lying angle with 2 straight legs and 2 straight arms */
          <g>
            {/* Female Side Figure (Neon Pink) */}
            <circle cx="105" cy="30" r="12" fill="#ff007f" stroke="#ffffff" strokeWidth="2" />
            <line x1="117" y1="30" x2="140" y2="95" stroke="#ff007f" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="140" y1="95" x2="200" y2="135" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="140" y1="95" x2="70" y2="135" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="125" y1="55" x2="175" y2="70" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />
            <line x1="125" y1="55" x2="165" y2="90" stroke="#ff007f" strokeWidth="8" strokeLinecap="round" />

            {/* Male Side Figure (Electric Cyan) */}
            <circle cx="165" cy="50" r="12" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
            <line x1="165" y1="62" x2="150" y2="115" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round" />
            {/* 2 Straight Legs */}
            <line x1="150" y1="115" x2="210" y2="150" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="150" y1="115" x2="100" y2="150" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            {/* 2 Straight Arms */}
            <line x1="160" y1="80" x2="110" y2="90" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
            <line x1="160" y1="80" x2="120" y2="110" stroke="#00d2ff" strokeWidth="8" strokeLinecap="round" />
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
                100 STICK POSITIONS GALLERY 🔥
              </h2>
              <p className="text-xs text-gray-400">Scroll down to view 3 positions at a time</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full mt-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 100 Stick Man & Woman Positions..."
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
          ✨ 100 Classic Straight-Limb Stick Man & Woman Position Diagrams
        </div>
      </div>
    </div>
  );
}
