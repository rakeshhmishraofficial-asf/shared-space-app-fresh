import React from 'react';
import { Volume2, Flame } from 'lucide-react';

export default function ChaosToolbar({
  onOpenPositionsModal,
  onTriggerSoundboard
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-2 bg-black/90 backdrop-blur-2xl border-2 border-purple-500/60 rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.5)]">
      {/* Soundboard Button */}
      <button
        onClick={onTriggerSoundboard}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-lg border border-red-400/40 hover:scale-110 active:scale-95 transition-all group"
        title="Open SFX Soundboard"
      >
        <Volume2 className="w-5 h-5 text-white group-hover:animate-bounce" />
        <span className="text-[9px] uppercase tracking-tighter font-extrabold">SFX</span>
      </button>

      {/* Positions Gallery Button */}
      <button
        onClick={onOpenPositionsModal}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-lg border border-pink-400/40 hover:scale-110 active:scale-95 transition-all group"
        title="Positions Gallery"
      >
        <Flame className="w-5 h-5 text-pink-300 group-hover:animate-pulse" />
        <span className="text-[9px] uppercase tracking-tighter font-extrabold">POS 🔥</span>
      </button>
    </div>
  );
}
