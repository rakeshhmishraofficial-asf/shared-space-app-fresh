import React from 'react';
import { Volume2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const SOUND_LIST = [
  { 
    id: 'moan', 
    name: 'Horny Moan', 
    icon: '🔞', 
    color: 'from-pink-600 to-rose-700',
    audioUrl: '/sounds/moan.webm'
  },
  { 
    id: 'vineboom', 
    name: 'Vine Boom', 
    icon: '💥', 
    color: 'from-red-600 to-amber-700',
    audioUrl: 'https://www.myinstants.com/media/sounds/vine-boom.mp3' 
  },
  { 
    id: 'airhorn', 
    name: 'Dank Airhorn', 
    icon: '🚨', 
    color: 'from-yellow-500 to-orange-600',
    audioUrl: 'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3'
  },
  { 
    id: 'bruh', 
    name: 'Bruh / Damage', 
    icon: '🤡', 
    color: 'from-purple-600 to-indigo-700',
    audioUrl: 'https://www.myinstants.com/media/sounds/bruh-sound-effect-meme.mp3'
  },
  { 
    id: 'gigachad', 
    name: 'GigaChad Theme', 
    icon: '🗿', 
    color: 'from-gray-600 to-slate-800',
    audioUrl: 'https://www.myinstants.com/media/sounds/can-you-feel-my-heart.mp3'
  },
  { 
    id: 'bassboom', 
    name: 'Bass Boost', 
    icon: '💣', 
    color: 'from-red-700 to-black',
    audioUrl: 'https://www.myinstants.com/media/sounds/bass-boosted-sound-effect.mp3'
  },
  { 
    id: 'sadviolin', 
    name: 'Sad Violin', 
    icon: '🎻', 
    color: 'from-blue-600 to-cyan-700',
    audioUrl: 'https://www.myinstants.com/media/sounds/sad-violin.mp3'
  },
  { 
    id: 'scream', 
    name: 'Wilhelm Scream', 
    icon: '😱', 
    color: 'from-amber-600 to-red-600',
    audioUrl: 'https://www.myinstants.com/media/sounds/wilhelm-scream.mp3'
  },
  { 
    id: 'slay', 
    name: 'Slay / Yass', 
    icon: '💅', 
    color: 'from-fuchsia-500 to-pink-600',
    audioUrl: 'https://www.myinstants.com/media/sounds/yasss-slay.mp3'
  },
  { 
    id: 'skull', 
    name: 'Skull Bell', 
    icon: '💀', 
    color: 'from-purple-800 to-slate-900',
    audioUrl: 'https://www.myinstants.com/media/sounds/taco-bell-bong.mp3'
  },
];

// Play real audio sample with fallback synthesis
export function playSoundEffect(soundId) {
  const item = SOUND_LIST.find((s) => s.id === soundId);
  
  if (item && item.audioUrl) {
    try {
      const audio = new Audio(item.audioUrl);
      audio.volume = 0.85;

      // Limit moan audio playback to first 8 seconds max
      if (soundId === 'moan') {
        setTimeout(() => {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {}
        }, 8000);
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play fallback to synth:', err);
          playSynthesizedSound(soundId);
        });
      }
      return;
    } catch (e) {
      console.warn('Audio element error:', e);
    }
  }

  playSynthesizedSound(soundId);
}

// Web Audio API Synthesizer Engine
export function playSynthesizedSound(soundId) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (soundId === 'moan') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.85);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.error('Audio synth error:', err);
  }
}

export default function Soundboard({ onTriggerSound, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-neon-red rounded-3xl p-6 max-w-lg w-full text-white border border-red-500/50 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-400 text-lg transition-colors font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-600/30 rounded-2xl border border-red-500/40 text-red-400">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-red-500 uppercase tracking-wider neon-text-red">
              UNCENSORED SOUNDBOARD
            </h2>
            <p className="text-xs text-gray-400">Broadcasts audio samples to everyone in the room</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SOUND_LIST.map((sound) => (
            <button
              key={sound.id}
              onClick={() => {
                playSoundEffect(sound.id);
                onTriggerSound(sound.id, sound.name);
                toast.success(`Triggered ${sound.name}!`, { icon: sound.icon });
              }}
              className={`p-4 rounded-2xl bg-gradient-to-r ${sound.color} opacity-90 hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 text-left flex items-center justify-between shadow-lg group`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl group-hover:animate-bounce">{sound.icon}</span>
                <span className="font-bold text-sm text-white drop-shadow">{sound.name}</span>
              </div>
              <Zap className="w-4 h-4 text-white/70 group-hover:text-yellow-300" />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-red-400/80 font-mono">
          🔥 Warning: Real Audio Broadcast Active
        </div>
      </div>
    </div>
  );
}
