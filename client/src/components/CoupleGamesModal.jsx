import React, { useState } from 'react';
import { X, Flame, Dices, RotateCcw, Shuffle, Sparkles, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

// Darkest Wild Erotic Actions (Pure Wild & Dirty LDR Intimacy)
const DARK_WILD_ACTIONS = [
  "Slowly slide your hand inside your clothes and rub your bare",
  "Pinch your nipples hard through your top until they stiffen, looking at",
  "Spread your legs slightly on camera and slowly stroke your inner",
  "Moan loudly into the microphone while pressing two fingers against your",
  "Unbutton your shorts/pants to expose your lower waist and trace your",
  "Bite your bottom lip hard, stare into webcam and scratch your bare",
  "Lick your lips in slow motion and whisper your dirtiest fantasy while touching your",
  "Rub ice or cold wet fingers over your bare chest and",
  "Take off your shirt/top for 5 seconds and reveal your bare",
  "Press your lips to the camera lens and moan your partner's name while touching your",
  "Blow hot deep panting breaths onto your mic and slide your hand down to your",
  "Hold your hands behind your head while your partner commands how to touch your",
  "Slap your own ass cheek on camera and let your partner hear the sound over",
  "Trace a line of saliva down your neck and chest towards your",
  "Pinch your lower lip, look intensely at the cam and tease your bare"
];

// Dark Wild Target Areas
const DARK_WILD_TARGETS = [
  "ass & butt cheeks on webcam 🍑",
  "bare nipples & chest area 🔥",
  "inner thigh & pantyline 💋",
  "lower belly & waistline 👄",
  "collarbone & throat 🦴",
  "lips & tongue on camera 👅",
  "hips & pelvic bone ⏳",
  "bare shoulder & neck 💥"
];

// Dark Wild Erotic Commands & Modes
const DARK_WILD_MODES = [
  "for 30 seconds straight without breaking eye contact 👀",
  "while moaning softly into the mic for your partner to hear 🎙️",
  "and tell your partner exactly how wet/hard you are right now 🔞",
  "and give your partner 3 explicit commands on how to touch themselves 🗣️",
  "while holding a needy, intense look into the camera lens 📹",
  "and whisper the dirtiest thing you want done to you when you meet 💬",
  "and show a 5-second live webcam teaser clip 👙",
  "while taking 3 deep panting breaths onto the mic 😮‍💨",
  "and count down from 10 to 1 together in a dirty whisper ⏳",
  "and kiss the camera screen for 5 seconds 👄"
];

const CATEGORIES = [
  "Dark Explicit Touch 🔞",
  "Dirty Audio Moan 🎙️",
  "Wild Erotic Tease 🔥",
  "Sensory Audio Tease ⚡",
  "Explicit Visual Cam 📹",
  "Climax Sync 💓"
];

export function generateDarkWildDare() {
  const act = DARK_WILD_ACTIONS[Math.floor(Math.random() * DARK_WILD_ACTIONS.length)];
  const tar = DARK_WILD_TARGETS[Math.floor(Math.random() * DARK_WILD_TARGETS.length)];
  const mod = DARK_WILD_MODES[Math.floor(Math.random() * DARK_WILD_MODES.length)];
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const cardId = Math.floor(Math.random() * 50000) + 1;

  return {
    id: cardId,
    text: `${act} ${tar} ${mod}`,
    category: cat
  };
}

export default function CoupleGamesModal({ isOpen, onClose, socket, roomCode, username }) {
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts', 'tictactoe', 'dice', 'race'
  const [currentPrompt, setCurrentPrompt] = useState(generateDarkWildDare());

  // Interactive Tic Tac Toe State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [tttWinner, setTttWinner] = useState(null);

  // Interactive Dice States
  const [diceAction, setDiceAction] = useState('Touch Nipple 🔥');
  const [diceTarget, setDiceTarget] = useState('Inner Thigh 💋');
  const [isRolling, setIsRolling] = useState(false);

  // Interactive Bike/Couples Speed Race States
  const [p1Progress, setP1Progress] = useState(0);
  const [p2Progress, setP2Progress] = useState(0);
  const [raceWinner, setRaceWinner] = useState(null);

  if (!isOpen) return null;

  const drawRandomDareCard = () => {
    const nextDare = generateDarkWildDare();
    setCurrentPrompt(nextDare);
    toast.success('Drawn Fresh Wild Dark Dare! 🎲🔥');
  };

  // Tic Tac Toe logic
  const handleBoardClick = (idx) => {
    if (board[idx] || tttWinner) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);

    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    let won = false;
    for (let l of lines) {
      const [a, b, c] = l;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        won = true;
        setTttWinner(newBoard[a]);
        toast.success(`🎉 PLAYER ${newBoard[a]} WON CROSS CIRCLE! Winner commands a Wild Penalty!`);
        break;
      }
    }
    if (!won && newBoard.every(cell => cell !== null)) {
      setTttWinner('Draw');
    } else if (!won) {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setTttWinner(null);
  };

  const rollDice = () => {
    setIsRolling(true);
    const actions = ['Touch Nipple 🔥', 'Kiss 💋', 'Lick 👅', 'Pinch 😬', 'Caress 👋', 'Rub ✋', 'Whisper 🎙️', 'Spank 🍑'];
    const targets = ['Inner Thigh 💋', 'Lips 👄', 'Ass & Butt 🍑', 'Collarbone 🦴', 'Waist ⏳', 'Ear 👂', 'Cam 📷'];

    setTimeout(() => {
      const act = actions[Math.floor(Math.random() * actions.length)];
      const tar = targets[Math.floor(Math.random() * targets.length)];
      setDiceAction(act);
      setDiceTarget(tar);
      setIsRolling(false);

      const diceText = `🎲 ROLLED WILDEST DICE: ${act} on ${tar}!`;
      const messageId = 'dice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      window.dispatchEvent(new CustomEvent('new-room-message', {
        detail: { username: username || 'You', message: diceText, timestamp, messageId, roomCode: roomCode || 'GLOBAL' }
      }));

      if (socket) {
        socket.emit('chat-message', {
          roomCode: roomCode || 'GLOBAL',
          username: username || 'You',
          message: diceText,
          timestamp,
          messageId
        });
      }
      toast.success(`Rolled: ${act} on ${tar}!`);
    }, 500);
  };

  const handleMashSprint = () => {
    if (raceWinner) return;
    const nextProg = p1Progress + 10;
    setP1Progress(nextProg);
    if (nextProg >= 100) {
      setRaceWinner(username || 'You');
      toast.success('🏆 YOU WON THE BIKE RACE! Pick a Wild Dare for your partner!');
    }
  };

  const resetRace = () => {
    setP1Progress(0);
    setP2Progress(0);
    setRaceWinner(null);
  };

  const broadcastPromptToRoom = () => {
    const messageId = 'dare_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `🔥 WILDEST LDR DARE: ${currentPrompt.text}`;

    const msgDetail = {
      username: username || 'You',
      message: text,
      timestamp,
      messageId,
      roomCode: roomCode || 'GLOBAL'
    };

    window.dispatchEvent(new CustomEvent('new-room-message', { detail: msgDetail }));

    if (socket) {
      socket.emit('chat-message', {
        roomCode: roomCode || 'GLOBAL',
        username: username || 'You',
        message: text,
        timestamp,
        messageId
      });
    }
    toast.success('Broadcasted Wild Dare to Room Chat! 🔥');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-6 max-w-4xl w-full text-white border border-pink-500/50 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pink-400 text-lg transition-colors font-bold"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl border border-pink-400/40 text-white shadow-lg">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-red-500 uppercase tracking-wider">
                COUPLE PLAY AREA (DARK & WILD DARES)
              </h2>
              <p className="text-xs text-gray-400">Deep, wild erotic dares designed for intimate LDR couples</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                activeTab === 'prompts' ? 'bg-pink-600 text-white border-pink-400' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              Random Dark Dare 🎲
            </button>
            <button
              onClick={() => setActiveTab('tictactoe')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                activeTab === 'tictactoe' ? 'bg-pink-600 text-white border-pink-400' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              Cross Circle ⭕❌
            </button>
            <button
              onClick={() => setActiveTab('dice')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                activeTab === 'dice' ? 'bg-pink-600 text-white border-pink-400' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              Wild Dice 🎲
            </button>
            <button
              onClick={() => setActiveTab('race')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                activeTab === 'race' ? 'bg-pink-600 text-white border-pink-400' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              Bike Race 🏎️
            </button>
          </div>
        </div>

        {/* Tab 1: Dark & Wild Erotic Dare Generator */}
        {activeTab === 'prompts' && (
          <div className="flex-1 overflow-hidden flex flex-col justify-between p-4 bg-black/60 rounded-2xl border border-pink-500/30">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                Wild Dare #{currentPrompt.id} • {currentPrompt.category}
              </span>
              <span className="text-xs text-purple-300 font-bold">Dark LDR Intimacy</span>
            </div>

            {/* Main Erotic Dare Card Display */}
            <div className="my-auto py-8 px-6 text-center bg-gradient-to-br from-purple-950/90 via-black to-pink-950/90 rounded-3xl border-2 border-pink-500/60 shadow-[0_0_55px_rgba(236,72,153,0.4)]">
              <p className="text-lg md:text-xl font-black text-white leading-relaxed tracking-wide drop-shadow-xl">
                "{currentPrompt.text}"
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={drawRandomDareCard}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Shuffle className="w-4 h-4" />
                <span>Draw Random Dark Dare 🎲</span>
              </button>

              <button
                onClick={broadcastPromptToRoom}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg border border-red-400/40 active:scale-95 transition-all"
              >
                Send Dare to Room Chat 🔥
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Cross Circle (Tic Tac Toe) */}
        {activeTab === 'tictactoe' && (
          <div className="flex-1 my-auto py-6 text-center bg-gradient-to-br from-purple-950/80 to-black p-6 rounded-3xl border-2 border-pink-500/40 flex flex-col items-center justify-center">
            <h4 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-3">CROSS CIRCLE (TIC TAC TOE) DARE GAME ⭕❌</h4>
            <p className="text-xs text-gray-400 mb-4">Current Turn: Player {turn}. Winner commands a Wild Erotic Dare!</p>

            <div className="grid grid-cols-3 gap-3 w-64 h-64 mx-auto mb-4">
              {board.map((val, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBoardClick(idx)}
                  className="w-20 h-20 bg-black/80 rounded-2xl border-2 border-purple-500/50 flex items-center justify-center font-black text-3xl text-pink-400 hover:bg-purple-900/40 transition-all shadow-lg"
                >
                  {val === 'X' ? '❌' : val === 'O' ? '⭕' : ''}
                </button>
              ))}
            </div>

            {tttWinner && (
              <div className="space-y-2 animate-bounce">
                <p className="text-sm font-black text-pink-300">
                  {tttWinner === 'Draw' ? '🤝 Game Draw!' : `🎉 PLAYER ${tttWinner} WON! Pick a Wild Dare for Loser!`}
                </p>
                <button
                  onClick={resetBoard}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Reset Cross Circle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Interactive Wild Dice */}
        {activeTab === 'dice' && (
          <div className="flex-1 my-auto py-8 text-center bg-gradient-to-br from-purple-950/80 to-black p-8 rounded-3xl border-2 border-pink-500/40 flex flex-col items-center justify-center">
            <h4 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-6">WILD ACTION & BODY TARGET DICE</h4>
            
            <div className="flex justify-center gap-6 mb-8">
              <div className={`w-36 h-36 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 flex flex-col items-center justify-center font-black text-base text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-red-400 ${isRolling ? 'animate-bounce' : ''}`}>
                <span className="text-xs text-red-200 uppercase font-mono mb-2">Action</span>
                <span className="px-2">{diceAction}</span>
              </div>

              <div className={`w-36 h-36 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex flex-col items-center justify-center font-black text-base text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] border-2 border-purple-400 ${isRolling ? 'animate-bounce' : ''}`}>
                <span className="text-xs text-purple-200 uppercase font-mono mb-2">Touch Target</span>
                <span className="px-2">{diceTarget}</span>
              </div>
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl transition-all border border-pink-400/40 active:scale-95"
            >
              {isRolling ? 'Rolling Dice...' : 'Roll Wild Dice 🎲'}
            </button>
          </div>
        )}

        {/* Tab 4: Interactive Couple Bike Sprint Race */}
        {activeTab === 'race' && (
          <div className="flex-1 overflow-y-auto p-6 bg-black/60 rounded-3xl border border-pink-500/40 flex flex-col justify-between">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-pink-300 uppercase">COUPLES SPRINT BIKE RACE 🏎️</h3>
              <p className="text-xs text-gray-400">Mash the Sprint button fast! First to 100% wins and gets to command a Wild Dare penalty!</p>
            </div>

            <div className="space-y-6 my-auto max-w-xl mx-auto w-full">
              <div>
                <div className="flex justify-between text-xs font-bold text-pink-300 mb-1">
                  <span>@{username || 'You'} (Rider 1)</span>
                  <span>{p1Progress}%</span>
                </div>
                <div className="w-full h-6 bg-slate-900 rounded-full overflow-hidden border border-pink-500/40 p-1">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-150"
                    style={{ width: `${p1Progress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-purple-300 mb-1">
                  <span>@Partner (Rider 2)</span>
                  <span>{p2Progress}%</span>
                </div>
                <div className="w-full h-6 bg-slate-900 rounded-full overflow-hidden border border-purple-500/40 p-1">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-150"
                    style={{ width: `${p2Progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-white/10 flex items-center justify-center gap-4">
              {raceWinner ? (
                <div className="space-y-3 animate-bounce">
                  <div className="p-3 bg-pink-600/40 border border-pink-400 rounded-2xl text-pink-200 font-black text-sm">
                    🏆 WINNER: {raceWinner}! Pick a Wild Dare for your partner!
                  </div>
                  <button
                    onClick={resetRace}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleMashSprint}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-widest shadow-2xl border-2 border-pink-400/50 hover:scale-105 active:scale-95 transition-all"
                >
                  MASH SPRINT 🏎️💨
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-pink-400/80 font-mono flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-pink-500 animate-ping" />
          <span>Couple Play Area • Dark & Wild Erotic LDR Dares</span>
        </div>
      </div>
    </div>
  );
}
