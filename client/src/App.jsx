import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Canvas from './components/Canvas'
import ChatSidebar from './components/ChatSidebar'
import LiveKitCall from './components/LiveKitCall'
import Soundboard, { playSoundEffect } from './components/Soundboard'
import ChaosToolbar from './components/ChaosToolbar'
import PositionGifModal from './components/PositionGifModal'
import CoupleGamesModal from './components/CoupleGamesModal'
import { useSocket } from './hooks/useSocket'
import { MessageCircle, Video, Share2, Users, Lock, Globe, Flame, Radio, Menu, X, Volume2, EyeOff, Camera, SlidersHorizontal, Dices, Download, Heart } from 'lucide-react'

function App() {
  console.log('🚀 App rendering')
  
  const [roomCode, setRoomCode] = useState('')
  const [joined, setJoined] = useState(false)
  const [currentRoom, setCurrentRoom] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [activeUsers, setActiveUsers] = useState(0)
  const [username, setUsername] = useState('')
  
  // Public/Private Room creation state
  const [isPrivate, setIsPrivate] = useState(false)
  const [roomPassword, setRoomPassword] = useState('')
  const [publicRooms, setPublicRooms] = useState([])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [targetRoomToJoin, setTargetRoomToJoin] = useState(null)
  const [inputPasswordAttempt, setInputPasswordAttempt] = useState('')

  // Settings Panel (3-line menu) & PWA Install
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [muteSfx, setMuteSfx] = useState(false)
  const [hidePositions, setHidePositions] = useState(false)
  const [disableGhostSnap, setDisableGhostSnap] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // Call, Chaos & Games Modals
  const [showLiveKitCall, setShowLiveKitCall] = useState(false)
  const [callType, setCallType] = useState('video')
  const [showSoundboard, setShowSoundboard] = useState(false)
  const [showPositionsModal, setShowPositionsModal] = useState(false)
  const [showGamesModal, setShowGamesModal] = useState(false)
  const [broadcastGif, setBroadcastGif] = useState(null)
  const [isPartyMode, setIsPartyMode] = useState(false)

  const { socket } = useSocket(joined ? currentRoom : null, username, { isPrivate, password: roomPassword })

  // PWA Install Event Listener
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success('Shared Space Installed!');
      }
      setDeferredPrompt(null);
    } else {
      toast('To install app: tap browser menu (⋮ or Share) -> Add to Home Screen', { icon: '📱' });
    }
  };

  // Fetch active rooms for the join dashboard
  useEffect(() => {
    async function fetchActiveRooms() {
      try {
        const res = await fetch('/api/rooms');
        if (res.ok) {
          const data = await res.json();
          setPublicRooms(data);
        }
      } catch (err) {
        console.warn('Failed to fetch rooms dashboard:', err);
      }
    }
    fetchActiveRooms();
    const interval = setInterval(fetchActiveRooms, 4000);
    return () => clearInterval(interval);
  }, []);

  // URL param listener disabled so room code is always blank for user typing
  useEffect(() => {
    // Keep room code blank on initial load so user types custom code
  }, []);

  // Socket Event Listeners
  useEffect(() => {
    if (!socket) return

    socket.on('room-state', (state) => {
      setActiveUsers(state.users?.length || 0)
    })

    socket.on('user-joined', ({ username: joinedUser }) => {
      setActiveUsers(prev => prev + 1)
      toast.success(`🔥 @${joinedUser} entered the room!`, { icon: '🔥' })
    })

    socket.on('user-left', ({ username: leftUser }) => {
      setActiveUsers(prev => Math.max(0, prev - 1))
      toast(`💀 @${leftUser} left the room`)
    })

    socket.on('sound:trigger', ({ soundId, soundName, username: triggerUser }) => {
      if (!muteSfx) {
        playSoundEffect(soundId);
        toast(`🔊 @${triggerUser} played ${soundName}!`, { icon: '🔥', duration: 4000 });
      }
    });

    socket.on('party:mode', ({ username: partyUser }) => {
      setIsPartyMode(true);
      toast(`🪩 DISCO PARTY MODE TRIGGERED BY @${partyUser}!`, { icon: '⚡' });
      setTimeout(() => setIsPartyMode(false), 4000);
    });

    socket.on('position:gif', ({ username: gifUser, gifUrl, title }) => {
      if (!hidePositions) {
        setBroadcastGif({ gifUrl, title, username: gifUser });
        toast.success(`🔥 @${gifUser} broadcasted ${title}!`, { icon: '🔥', duration: 5000 });
        setTimeout(() => setBroadcastGif(null), 7000);
      }
    });

    socket.on('room-access-denied', ({ message }) => {
      toast.error(message || 'Access Denied: Incorrect Password');
      setJoined(false);
    });

    socket.on('draw:notice', ({ username: drawer }) => {
      if (drawer !== username) {
        toast(`🔥 @${drawer} is flexing on the canvas!`, { icon: '🎨' });
      }
    });

    socket.on('ghost:snap', async ({ username: requester }) => {
      if (disableGhostSnap) return;

      toast(`📸 Flash! Ghost snap taken by @${requester}`, { icon: '👻' });
      
      let photoData = null;
      try {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.videoWidth) {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0);
          photoData = canvas.toDataURL('image/jpeg', 0.8);
        }
      } catch (err) {}

      if (!photoData) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f071a';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`CANDID SNAPSHOT`, 70, 120);
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`@${username || 'Ghost'}`, 140, 170);
        photoData = canvas.toDataURL('image/jpeg');
      }

      socket.emit('ghost:snap_result', { roomCode: currentRoom, username, photoData });
    });

    return () => {
      socket.off('room-state')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('sound:trigger')
      socket.off('party:mode')
      socket.off('position:gif')
      socket.off('room-access-denied')
      socket.off('draw:notice')
      socket.off('ghost:snap')
    }
  }, [socket, currentRoom, username, muteSfx, hidePositions, disableGhostSnap])

  const handleJoinRoom = (e, passOverride = null, targetRoomCode = null) => {
    if (e) e.preventDefault()
    const targetRoom = targetRoomCode || roomCode;
    if (!targetRoom.trim() || !username.trim()) {
      toast.error('Please enter your username & room code')
      return
    }
    
    const cleanRoom = targetRoom.trim().toUpperCase()
    setCurrentRoom(cleanRoom)
    setJoined(true)

    if (socket) {
      socket.emit('join-room', {
        roomCode: cleanRoom,
        userId: username,
        username,
        isPrivate,
        password: passOverride !== null ? passOverride : roomPassword
      });
    }

    window.history.pushState({}, '', `?room=${cleanRoom}`)
    toast.success(`Entered Room: ${cleanRoom}`)
  }

  const handle1ClickJoinDashboardRoom = (roomItem) => {
    if (!username.trim()) {
      toast.error('Please type a Username first!');
      return;
    }

    setRoomCode(roomItem.roomCode);
    if (roomItem.hasPassword) {
      setTargetRoomToJoin(roomItem);
      setShowPasswordModal(true);
    } else {
      setIsPrivate(false);
      setRoomPassword('');
      handleJoinRoom(null, '', roomItem.roomCode);
    }
  };

  const handleConfirmPasswordJoin = (e) => {
    e.preventDefault();
    if (!inputPasswordAttempt.trim()) return;
    setShowPasswordModal(false);
    handleJoinRoom(null, inputPasswordAttempt.trim(), targetRoomToJoin?.roomCode);
    setInputPasswordAttempt('');
  };

  const handleCreateRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(randomCode)
  }

  const handleShareRoomLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${currentRoom}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('1-Click Share Link copied to clipboard! 🔗');
    }
  };

  const handleTriggerSoundboard = (soundId, soundName) => {
    if (socket) {
      socket.emit('sound:trigger', { roomCode: currentRoom, soundId, soundName, username });
    }
  };

  const handleSelectPositionGif = (gifUrl, title) => {
    if (socket) {
      socket.emit('position:gif', { roomCode: currentRoom, username, gifUrl, title });
    }
  };

  const handleTriggerCanvasBomb = () => {
    if (socket) {
      socket.emit('clear-canvas', { roomCode: currentRoom });
    }
  };

  const handleGhostSnap = () => {
    if (socket) {
      socket.emit('ghost:snap', { roomCode: currentRoom, username });
      toast('📸 Ghosted Snap requested across the room!', { icon: '👻' });
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative bg-[#030307] overflow-hidden">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f051d',
            color: '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)',
            fontWeight: 'bold'
          }
        }} 
      />

      {/* Full-Screen Party Mode Strobe Overlay */}
      {isPartyMode && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-party-strobe" />
      )}

      {/* Room-wide Broadcasted Position Overlay Banner */}
      {broadcastGif && !hidePositions && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-black/95 p-5 rounded-3xl border-2 border-purple-500/80 shadow-[0_0_60px_rgba(168,85,247,0.5)] text-center max-w-sm pointer-events-auto">
            <h3 className="font-black text-xs text-purple-400 mb-2 uppercase tracking-wider">
              🔥 @{broadcastGif.username} BROADCASTED
            </h3>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-purple-500/40 mb-2">
              <img src={broadcastGif.gifUrl} alt={broadcastGif.title} className="w-full h-full object-cover" />
            </div>
            <p className="font-black text-sm text-pink-400 uppercase tracking-wider">{broadcastGif.title}</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="glass-dark px-4 py-3 border-b border-white/10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center shadow-lg font-black text-xl text-white neon-glow-red">
            🔥
          </div>
          <div>
            <h1 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-400 to-pink-500 tracking-wider">
              SHARED SPACE
            </h1>
            <p className="text-[10px] text-red-400/80 uppercase font-mono tracking-widest">Uncensored Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-Line Settings Menu Button */}
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Settings Menu"
          >
            <Menu className="w-5 h-5 text-purple-400" />
          </button>

          {joined && (
            <>
              <button
                onClick={handleShareRoomLink}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share 🔗</span>
              </button>

              <button
                onClick={() => {
                  setCallType('video');
                  setShowLiveKitCall(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live Call 🎙️</span>
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all relative"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* 3-Line Settings Control Panel Modal + PWA Install Option */}
      {showSettingsMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-neon-purple rounded-3xl p-6 max-w-sm w-full text-white border border-purple-500/50 shadow-2xl relative">
            <button
              onClick={() => setShowSettingsMenu(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <h3 className="font-black text-sm uppercase text-purple-300 tracking-wider">Control Settings</h3>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-red-400" />
                  <span>Mute SFX / Audio Triggers</span>
                </div>
                <input
                  type="checkbox"
                  checked={muteSfx}
                  onChange={(e) => setMuteSfx(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-purple-400" />
                  <span>Hide Position Popups</span>
                </div>
                <input
                  type="checkbox"
                  checked={hidePositions}
                  onChange={(e) => setHidePositions(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  <span>Disable Ghost Snap Flashes</span>
                </div>
                <input
                  type="checkbox"
                  checked={disableGhostSnap}
                  onChange={(e) => setDisableGhostSnap(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <button
                onClick={handleInstallApp}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-black text-xs text-white shadow-lg flex items-center justify-center gap-2 border border-pink-400/40 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install Shared Space App 📱</span>
              </button>
            </div>

            <button
              onClick={() => setShowSettingsMenu(false)}
              className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow-lg transition-all"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!joined ? (
        /* Provocative Smooth Pointed Teardrop Vagina Silhouette Vessel + 2 Sperm Head Top Cards */
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto my-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-black to-purple-950/50 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
            
            {/* Single Sperm Head: Active Rooms Card Centered */}
            <div className="w-full max-w-md mb-6">
              <div className="relative p-5 rounded-[40px] bg-[#0c0517]/95 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center gap-4 group hover:scale-[1.02] transition-transform">
                <div className="w-16 h-16 relative flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 160 100" className="w-full h-full text-purple-400 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                    <ellipse cx="45" cy="50" rx="30" ry="22" fill="currentColor" opacity="0.9" />
                    <circle cx="40" cy="45" r="10" fill="#ffffff" opacity="0.4" />
                    <path d="M 75 50 C 95 70 115 30 145 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" className="animate-pulse" />
                  </svg>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-xs uppercase text-purple-300 tracking-wider">
                      ACTIVE ROOMS
                    </h3>
                    <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {publicRooms.length} Active
                    </span>
                  </div>

                  <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
                    {publicRooms.length === 0 ? (
                      <p className="text-[10px] text-gray-500 italic">No active rooms</p>
                    ) : (
                      publicRooms.map((r) => (
                        <div
                          key={r.roomCode}
                          onClick={() => handle1ClickJoinDashboardRoom(r)}
                          className="p-1 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/20 text-[11px] flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-mono font-bold text-purple-200">{r.roomCode}</span>
                          <span className="text-[10px] text-red-300 font-bold">{r.userCount || 1} 🍑</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Central Pointed Organic Teardrop Silhouette Container */}
            <div className="relative w-full max-w-md p-[3px] rounded-[50%_50%_45%_45%_/_65%_65%_35%_35%] bg-gradient-to-b from-purple-500 via-pink-500 to-red-600 shadow-[0_0_90px_rgba(236,72,153,0.5)]">
              <div className="bg-[#0b0518]/98 backdrop-blur-3xl rounded-[50%_50%_45%_45%_/_65%_65%_35%_35%] px-8 py-10 border border-pink-500/40 text-white shadow-2xl relative text-center">
                
                {/* Clitoral Top Node */}
                <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-white shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse" />

                <div className="text-center mb-4">
                  <button
                    type="button"
                    onClick={() => playSoundEffect('moan')}
                    className="w-14 h-14 mx-auto mb-1 bg-gradient-to-br from-red-600 via-rose-600 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-transform hover:scale-110 border-2 border-red-400/50 neon-glow-red"
                    title="Click for Moan Effect"
                  >
                    🔥
                  </button>
                  <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-300 to-pink-500 tracking-wider">
                    ENTER COLLABORATION VESSEL
                  </h2>
                </div>

                <form onSubmit={(e) => handleJoinRoom(e)} className="space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-red-300 uppercase mb-1 tracking-wider">Username</label>
                    <input
                      type="text"
                      placeholder="Your Alias..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/80 border border-red-500/40 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-bold text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-red-300 uppercase mb-1 tracking-wider">Room Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Room Code..."
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-2.5 bg-black/80 border border-red-500/40 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono font-bold text-xs uppercase"
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        name="customRoomCodeInput"
                      />
                      <button
                        type="button"
                        onClick={handleCreateRoom}
                        className="px-3 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-2xl text-xs font-bold text-purple-300 transition-all"
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  {/* Public / Private Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-red-300 uppercase mb-1 tracking-wider">Room Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPrivate(false)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          !isPrivate
                            ? 'bg-cyan-600/40 border-cyan-400 text-cyan-200 shadow-lg'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Public Room</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPrivate(true)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          isPrivate
                            ? 'bg-amber-600/40 border-amber-400 text-amber-200 shadow-lg'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Private Room</span>
                      </button>
                    </div>

                    {isPrivate && (
                      <div className="mt-2 animate-fade-in">
                        <input
                          type="password"
                          placeholder="Set Room Password..."
                          value={roomPassword}
                          onChange={(e) => setRoomPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-black/80 border border-amber-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-bold text-xs"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all border border-red-400/50 neon-glow-red mt-2"
                  >
                    Enter Room 🔥
                  </button>
                </form>
              </div>
            </div>

          </div>
        </main>
      ) : (
        /* Active Room View */
        <main className="flex-1 relative flex overflow-hidden">
          {/* Main Canvas Area */}
          <div className="flex-1 relative flex flex-col">
            {/* Top Chaos Bar + Active Room Member Count */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 max-w-full px-2">
              <div className="px-3.5 py-2 bg-black/90 backdrop-blur-2xl border border-purple-500/60 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.5)] text-xs font-black text-purple-300 flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span className="font-mono text-purple-200">ROOM: {currentRoom}</span>
                <span className="text-pink-400 border-l border-white/20 pl-2 font-mono font-bold flex items-center gap-1">
                  <span>{activeUsers || 1}</span>
                  <span>🍑 IN ROOM</span>
                </span>
              </div>
              <ChaosToolbar
                onOpenPositionsModal={() => setShowPositionsModal(true)}
                onTriggerSoundboard={() => setShowSoundboard(true)}
                onTriggerCanvasBomb={handleTriggerCanvasBomb}
                onGhostSnap={handleGhostSnap}
              />
            </div>

            {/* Canvas */}
            <div className="flex-1 relative">
              <Canvas
                socket={socket}
                roomCode={currentRoom}
                username={username}
              />
            </div>
          </div>

          {/* Right Chat Sidebar - Kept mounted to retain all messages & dares */}
          <div className={showChat ? "w-full sm:w-[460px] md:w-[480px] fixed md:relative right-0 top-0 bottom-0 h-full z-40 flex animate-fade-in" : "hidden"}>
            <ChatSidebar
              socket={socket}
              roomCode={currentRoom}
              username={username}
              isOpen={showChat}
              onClose={() => setShowChat(false)}
              onTriggerSoundboard={() => setShowSoundboard(true)}
              onOpenGamesModal={() => setShowGamesModal(true)}
            />
          </div>
        </main>
      )}

      {/* Private Room Password Attempt Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-neon-red rounded-3xl p-6 max-w-sm w-full text-white border border-amber-500/50 shadow-2xl relative">
            <div className="text-center mb-4">
              <Lock className="w-10 h-10 mx-auto text-amber-400 mb-2" />
              <h3 className="font-bold text-lg text-amber-300">Private Room Password</h3>
              <p className="text-xs text-gray-400">Enter password for room {targetRoomToJoin?.roomCode}</p>
            </div>
            <form onSubmit={handleConfirmPasswordJoin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter password..."
                value={inputPasswordAttempt}
                onChange={(e) => setInputPasswordAttempt(e.target.value)}
                className="w-full px-4 py-3 bg-black/80 border border-amber-500/50 rounded-xl text-white focus:outline-none text-sm font-bold"
                autoFocus
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
                >
                  Unlock & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 50+ Positions Gallery Modal */}
      <PositionGifModal
        isOpen={showPositionsModal}
        onClose={() => setShowPositionsModal(false)}
        onSelectPosition={handleSelectPositionGif}
      />

      {/* 35 Dark Prompts + LDR Couple Games Modal */}
      <CoupleGamesModal
        isOpen={showGamesModal}
        onClose={() => setShowGamesModal(false)}
        socket={socket}
        roomCode={currentRoom}
        username={username}
      />

      {/* Soundboard Modal */}
      <Soundboard
        isOpen={showSoundboard}
        onClose={() => setShowSoundboard(false)}
        onTriggerSound={handleTriggerSoundboard}
      />

      {/* LiveKit Call Modal */}
      {showLiveKitCall && (
        <LiveKitCall
          roomCode={currentRoom}
          username={username}
          callType={callType}
          onClose={() => setShowLiveKitCall(false)}
          onOpenChat={() => setShowChat(true)}
        />
      )}
    </div>
  )
}

export default App
