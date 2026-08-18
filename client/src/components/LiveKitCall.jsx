import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2, Minimize2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ]
};

export default function LiveKitCall({ roomCode, username, socket, onClose, callType = 'video', onOpenChat }) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [isMinimized, setIsMinimized] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const isCaller = useRef(false);
  const timerRef = useRef(null);

  // Start local camera/mic
  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Once local stream is ready, initiate WebRTC
        setupPeerConnection(stream);
      } catch (err) {
        console.warn('Camera/Mic error:', err);
        toast.error('Camera/Mic access denied. Check browser permissions.');
      }
    }
    startMedia();

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (remoteConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [remoteConnected]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const setupPeerConnection = async (stream) => {
    if (!socket) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerRef.current = pc;

    // Add local tracks to peer connection
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // When remote track arrives
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setRemoteConnected(true);
      toast.success('Partner connected to call! 🔥', { duration: 3000 });
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc:ice-candidate', { roomCode, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setRemoteConnected(false);
        toast(`Partner disconnected from call`, { icon: '📞' });
      }
    };

    // As initiator (caller): create offer
    isCaller.current = true;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc:offer', { roomCode, offer });
    } catch (err) {
      console.warn('Offer creation failed:', err);
    }

    // Socket listeners for WebRTC signaling
    socket.on('webrtc:offer', async ({ offer }) => {
      // We are the answerer
      isCaller.current = false;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc:answer', { roomCode, answer });
    });

    socket.on('webrtc:answer', async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('webrtc:ice-candidate', async ({ candidate }) => {
      try {
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {}
    });
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setMicEnabled(track.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setVideoEnabled(track.enabled);
      }
    }
  };

  const handleOpenChatMode = () => {
    setIsMinimized(true);
    if (onOpenChat) onOpenChat();
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (peerRef.current) peerRef.current.close();
    if (socket) {
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');
    }
    onClose();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 w-64 bg-black/90 backdrop-blur-2xl rounded-3xl p-3 border-2 border-purple-500/80 shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-fade-in">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="font-mono text-[10px] text-purple-300 font-bold uppercase">
              {remoteConnected ? formatTime(callDuration) : 'Connecting...'} • {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(false)} className="p-1 hover:bg-white/20 rounded-lg text-purple-200 transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleEndCall} className="p-1 hover:bg-red-600/40 rounded-lg text-red-400 transition-colors">
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="w-full h-36 bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/40 relative">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-purple-300 text-xs font-bold">Camera Off</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="glass-neon-purple rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-white border border-purple-500/50 shadow-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${remoteConnected ? 'bg-green-400' : 'bg-red-500'} animate-ping`} />
            <span className="font-black text-base sm:text-lg text-purple-400 uppercase tracking-widest neon-text-purple">
              {remoteConnected ? `LIVE ${formatTime(callDuration)}` : 'CONNECTING...'} • {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenChatMode}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat 💬</span>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Float</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 my-3 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden rounded-2xl">
          {/* Local Video (You) */}
          <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-slate-900 border border-purple-500/40 flex items-center justify-center">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
            {!videoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <div className="w-16 h-16 rounded-full bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-2xl font-black mb-2">
                  {username ? username[0].toUpperCase() : '🔥'}
                </div>
                <span className="text-xs text-purple-300 font-bold">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/40">
              {username} (You)
            </div>
          </div>

          {/* Remote Video (Partner) */}
          <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-slate-900 border border-pink-500/40 flex items-center justify-center">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center p-4">
                <div className="w-16 h-16 rounded-full bg-pink-600/30 border-2 border-pink-500/60 flex items-center justify-center text-3xl mb-2 animate-pulse">💋</div>
                <span className="text-sm font-bold text-pink-300">Your Partner</span>
                <span className="text-xs text-gray-400 mt-1">Waiting for connection...</span>
                <div className="mt-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold text-pink-300 border border-pink-500/40">
              Partner {remoteConnected ? '• Live 🟢' : '• Connecting...'}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={toggleMic}
            className={`p-3 sm:p-4 rounded-2xl transition-all ${micEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} text-white shadow-lg`}
          >
            {micEnabled ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 sm:p-4 rounded-2xl transition-all ${videoEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} text-white shadow-lg`}
          >
            {videoEnabled ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <button
            onClick={handleOpenChatMode}
            className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 text-white font-black shadow-lg flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Chat 💬</span>
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 sm:p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg flex items-center gap-2 transition-all"
          >
            <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
