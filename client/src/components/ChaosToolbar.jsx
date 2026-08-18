import React from 'react';
import { Bomb, Volume2, Flame, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function ChaosToolbar({
  onOpenPositionsModal,
  onTriggerSoundboard,
  onTriggerCanvasBomb,
  onGhostSnap
}) {
  const handleBomb = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onTriggerCanvasBomb();
    toast('💣 CANVAS BOMB DETONATED!', { icon: '💥' });
  };

  return (
    <div className="flex items-center gap-2.5 p-2 bg-black/85 backdrop-blur-2xl border border-red-500/40 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-x-auto max-w-full">
      {/* Soundboard Button */}
      <button
        onClick={onTriggerSoundboard}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg border border-red-400/30 hover:scale-105 active:scale-95 transition-all"
        title="Open Soundboard"
      >
        <Volume2 className="w-4 h-4 animate-pulse" />
        <span>SFX 🔊</span>
      </button>

      {/* Positions Gallery Modal Button */}
      <button
        onClick={onOpenPositionsModal}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg border border-pink-400/30 hover:scale-105 active:scale-95 transition-all"
        title="Positions Gallery"
      >
        <Flame className="w-4 h-4 text-pink-300" />
        <span>Positions 🔞</span>
      </button>

      {/* Ghosted Snap Button */}
      <button
        onClick={onGhostSnap}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg border border-purple-400/30 hover:scale-105 active:scale-95 transition-all"
        title="Candid Camera Snap of other person"
      >
        <Camera className="w-4 h-4 text-purple-200" />
        <span>Ghost Snap 👻📸</span>
      </button>

      {/* Canvas Bomb */}
      <button
        onClick={handleBomb}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-lg border border-amber-400/30"
        title="Detonate Canvas Confetti Bomb"
      >
        <Bomb className="w-4 h-4 text-yellow-300" />
        <span>Bomb 💣</span>
      </button>
    </div>
  );
}
