import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2, Minimize2, MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.services.mozilla.com' },
  ]
};

export default function LiveKitCall({ roomCode, username, socket, onClose, callType = 'video', onOpenChat }) {
  const isAudioOnly = callType === 'audio';

  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(!isAudioOnly);
  const [isMinimized, setIsMinimized] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);  // separate audio element for echo-free remote audio
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const timerRef = useRef(null);
  const signalListenersAdded = useRef(false);

  // Start local camera/mic with echo cancellation
  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isAudioOnly ? false : { facingMode: 'user' },
          audio: {
            echoCancellation: true,   // fixes echo on mobile
            noiseSuppression: true,   // removes background noise
            autoGainControl: true,    // balances mic volume
            sampleRate: 48000,
          }
        });

        localStreamRef.current = stream;

        // Show local video only for video calls (audio calls show avatar)
        if (!isAudioOnly && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setupPeerConnection(stream);
      } catch (err) {
        console.warn('Camera/Mic error:', err);
        // Fallback: try audio only if video failed
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          });
          localStreamRef.current = audioStream;
          setupPeerConnection(audioStream);
          toast(`📞 Video unavailable, connected audio only`, { icon: '🎙️' });
        } catch (e) {
          toast.error('Mic access denied. Allow microphone permission in browser settings.');
        }
      }
    }
    startMedia();

    return () => {
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      if (peerRef.current) peerRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
      if (socket && signalListenersAdded.current) {
        socket.off('webrtc:offer');
        socket.off('webrtc:answer');
        socket.off('webrtc:ice-candidate');
        socket.off('call:accepted');
      }
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (remoteConnected) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [remoteConnected]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const setupPeerConnection = async (stream) => {
    if (!socket) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerRef.current = pc;

    // Add all local tracks to peer connection
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // When remote track arrives — play audio separately (prevents echo loop)
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];

      if (isAudioOnly) {
        // Audio-only call: play audio through dedicated audio element
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      } else {
        // Video call: attach stream to video element (audio included automatically)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      }

      setRemoteConnected(true);
      toast.success(`${isAudioOnly ? '📞' : '📹'} Partner joined the call!`, { duration: 3000 });
    };

    // Send ICE candidates to other peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc:ice-candidate', { roomCode, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setRemoteConnected(true);
      }
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setRemoteConnected(false);
        toast(`Partner disconnected from call`, { icon: '📞' });
      }
    };

    // Register WebRTC signaling listeners (once only)
    if (!signalListenersAdded.current) {
      signalListenersAdded.current = true;

      socket.on('webrtc:offer', async ({ offer }) => {
        if (pc.signalingState !== 'stable') return;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc:answer', { roomCode, answer });
      });

      socket.on('webrtc:answer', async ({ answer }) => {
        if (pc.signalingState !== 'have-local-offer') return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('webrtc:ice-candidate', async ({ candidate }) => {
        try {
          if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {}
      });
    }

    // Create and send offer (this device initiates the WebRTC handshake)
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: !isAudioOnly,
      });
      await pc.setLocalDescription(offer);
      socket.emit('webrtc:offer', { roomCode, offer });
    } catch (err) {
      console.warn('Offer error:', err);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setMicEnabled(track.enabled);
        toast(track.enabled ? '🎙️ Mic On' : '🔇 Mic Muted', { duration: 1500, style: { fontSize: '12px', padding: '4px 10px' } });
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
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    if (peerRef.current) peerRef.current.close();
    if (socket) {
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');
    }
    onClose();
  };

  // ── AUDIO-ONLY CALL UI ──────────────────────────────────────────
  if (isAudioOnly && !isMinimized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
        {/* Hidden remote audio element (no echo because it's not played through video) */}
        <audio ref={remoteAudioRef} autoPlay playsInline />

        <div className="glass-neon-purple rounded-3xl p-8 max-w-sm w-full text-white border-2 border-purple-500/60 shadow-2xl flex flex-col items-center gap-6 text-center">
          {/* Animated Pulse Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center text-5xl font-black border-4 border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.5)]">
              {remoteConnected ? '💋' : '📞'}
            </div>
            {remoteConnected && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-pink-500/40 animate-ping" />
                <div className="absolute -inset-3 rounded-full border-2 border-purple-500/30 animate-ping delay-150" />
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-1">
              {remoteConnected ? 'In Call 🎙️' : 'Calling...'}
            </h2>
            <p className="text-purple-300 font-mono text-lg">
              {remoteConnected ? formatTime(callDuration) : `Room: ${roomCode}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {remoteConnected ? `Connected with partner • ${roomCode}` : 'Waiting for partner to join...'}
            </p>
          </div>

          {/* Audio Equalizer Animation when connected */}
          {remoteConnected && micEnabled && (
            <div className="flex items-end gap-1 h-8">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-gradient-to-t from-purple-600 to-pink-500"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `bounce ${0.4 + i * 0.1}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-2xl transition-all shadow-lg ${micEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              title={micEnabled ? 'Mute' : 'Unmute'}
            >
              {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
              title="End Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            <button
              onClick={handleOpenChatMode}
              className="p-4 rounded-2xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-300 transition-all"
              title="Open Chat"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MINIMIZED (AUDIO OR VIDEO) ───────────────────────────────────
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 w-64 bg-black/90 backdrop-blur-2xl rounded-3xl p-3 border-2 border-purple-500/80 shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-fade-in">
        <audio ref={remoteAudioRef} autoPlay playsInline />
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${remoteConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-ping`} />
            <span className="font-mono text-[10px] text-purple-300 font-bold uppercase">
              {remoteConnected ? formatTime(callDuration) : 'Connecting...'} • {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(false)} className="p-1 hover:bg-white/20 rounded-lg text-purple-200">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleEndCall} className="p-1 hover:bg-red-600/40 rounded-lg text-red-400">
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isAudioOnly ? (
          <div className="flex flex-col items-center justify-center gap-2 py-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center text-2xl ${remoteConnected ? 'animate-pulse' : ''}`}>
              {remoteConnected ? '💋' : '📞'}
            </div>
            <span className="text-xs text-purple-300 font-bold">{remoteConnected ? `🎙️ ${formatTime(callDuration)}` : 'Calling...'}</span>
          </div>
        ) : (
          <div className="w-full h-36 bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/40 relative">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-purple-300 text-xs font-bold">Camera Off</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── VIDEO CALL UI ────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      {/* Hidden audio element to avoid echo (remote audio comes through video element) */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

      <div className="glass-neon-purple rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-white border border-purple-500/50 shadow-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${remoteConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-ping`} />
            <span className="font-black text-base text-purple-400 uppercase tracking-widest neon-text-purple">
              {remoteConnected ? `LIVE ${formatTime(callDuration)}` : 'CONNECTING...'} • {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleOpenChatMode} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat 💬</span>
            </button>
            <button onClick={() => setIsMinimized(true)} className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1">
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Float</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 my-3 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden rounded-2xl">
          {/* Local Video */}
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

          {/* Remote Video */}
          <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-slate-900 border border-pink-500/40 flex items-center justify-center">
            {/* remote audio+video in one element */}
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center p-4">
                <div className="w-16 h-16 rounded-full bg-pink-600/30 border-2 border-pink-500/60 flex items-center justify-center text-3xl mb-2 animate-pulse">💋</div>
                <span className="text-sm font-bold text-pink-300">Your Partner</span>
                <span className="text-xs text-gray-400 mt-1">Waiting for connection...</span>
                <div className="mt-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
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
          <button onClick={toggleMic} className={`p-3 sm:p-4 rounded-2xl transition-all ${micEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} text-white shadow-lg`}>
            {micEnabled ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <button onClick={toggleVideo} className={`p-3 sm:p-4 rounded-2xl transition-all ${videoEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} text-white shadow-lg`}>
            {videoEnabled ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <button onClick={handleOpenChatMode} className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 text-white font-black shadow-lg flex items-center gap-2 transition-all">
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Chat 💬</span>
          </button>

          <button onClick={handleEndCall} className="p-3 sm:p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition-all">
            <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
