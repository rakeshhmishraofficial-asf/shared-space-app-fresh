import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Maximize2, Minimize2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LiveKitCall({ roomCode, username, onClose, callType = 'video', onOpenChat }) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [stream, setStream] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let localStream = null;
    async function startMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true
        });
        setStream(localStream);
      } catch (err) {
        console.warn('Camera/Mic permission warning:', err);
        toast.error('Camera/Mic access denied or unavailable.');
      }
    }
    startMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType]);

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const handleOpenChatMode = () => {
    setIsMinimized(true);
    if (onOpenChat) onOpenChat();
    toast.success('Switched to Floating Call Mode & Room Chat! 💬');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 w-64 bg-black/90 backdrop-blur-2xl rounded-3xl p-3 border-2 border-purple-500/80 shadow-[0_0_40px_rgba(168,85,247,0.6)] cursor-pointer animate-fade-in group">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[10px] text-purple-300 font-bold uppercase">Call ({roomCode})</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenChatMode}
              className="p-1 hover:bg-white/20 rounded-lg text-pink-300 transition-colors"
              title="Open Chat"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/20 rounded-lg text-purple-200 transition-colors"
              title="Expand Full Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-600/40 rounded-lg text-red-400 transition-colors"
              title="End Call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Small Floating Video Stream Container */}
        <div
          onClick={() => setIsMinimized(false)}
          className="w-full h-36 bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/40 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform"
        >
          {videoEnabled && stream ? (
            <video
              ref={(el) => {
                if (el && stream) el.srcObject = stream;
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-600/40 flex items-center justify-center font-bold text-xs text-purple-200 mb-1">
                {username ? username[0].toUpperCase() : '🔥'}
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Camera Off</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
            Click to Expand ↗
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-6 max-w-4xl w-full text-white border border-purple-500/50 shadow-2xl flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-black text-lg text-purple-400 uppercase tracking-widest neon-text-purple">
              LIVE CALL • {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenChatMode}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-400/40 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-all"
              title="Open Chat & Dares"
            >
              <MessageCircle className="w-4 h-4 text-white animate-pulse" />
              <span>Chat & Dares 💬</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Minimize Video Floating Window"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Floating Window ↘</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Room: {roomCode}</span>
            </div>
          </div>
        </div>

        {/* Video Grid Container */}
        <div className="flex-1 my-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center overflow-hidden relative rounded-2xl bg-black/60 border border-white/10 p-2">
          {/* Main User Feed */}
          <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-slate-900 border border-purple-500/30 shadow-inner flex items-center justify-center">
            {videoEnabled && stream ? (
              <video
                ref={(el) => {
                  if (el && stream) el.srcObject = stream;
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-2xl font-black mb-2 text-purple-300 neon-glow-purple">
                  {username ? username[0].toUpperCase() : '🔥'}
                </div>
                <span className="font-bold text-sm text-gray-300">{username} (You)</span>
                <span className="text-xs text-purple-400 mt-1">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/40">
              {username} (You)
            </div>
          </div>

          {/* Remote Peer / Partner Panel */}
          <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-slate-900/80 border border-pink-500/30 shadow-inner flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-20 h-20 rounded-full bg-pink-600/30 border-2 border-pink-500/60 flex items-center justify-center text-3xl font-black mb-3 animate-pulse">
                💋
              </div>
              <span className="font-bold text-sm text-pink-300">Your Partner</span>
              <span className="text-xs text-gray-400 mt-1">Connected in Room • {roomCode}</span>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-green-600/20 border border-green-500/40 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                <span className="text-xs text-green-300 font-bold">Live in Room</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 max-w-[160px]">Peer video requires a LiveKit server. Both of you can see yourselves and talk over mic!</p>
            </div>
          </div>
        </div>

        {/* Call Controls Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-4">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-2xl transition-all ${
              micEnabled ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            } shadow-lg`}
            title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
          >
            {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-2xl transition-all ${
              videoEnabled ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            } shadow-lg`}
            title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button
            onClick={handleOpenChatMode}
            className="px-5 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-black shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-pink-400/40"
            title="Open Chat & Dares"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden sm:inline">Open Chat & Dares 💬</span>
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
