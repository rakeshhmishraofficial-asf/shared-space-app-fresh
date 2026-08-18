import { useEffect, useRef, useState } from 'react'
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react'
import toast from 'react-hot-toast'
import WebRTCPeer from '../utils/webrtc'
import logger from '../utils/logger'

export default function VideoCall({ socket, roomCode, username, isOpen, onClose }) {
  const localVideoRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [peers, setPeers] = useState({}) // { userId: { peer: WebRTCPeer, stream: MediaStream } }
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [permissionError, setPermissionError] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const remoteVideosRef = useRef({})

  useEffect(() => {
    if (!isOpen || !socket) return

    startCall()

    return () => {
      stopCall()
    }
  }, [isOpen, socket])

  useEffect(() => {
    if (!socket || !localStream) return

    // Listen for other users joining the call
    const handleUserJoined = async ({ username: joinedUser, userId }) => {
      logger.video('User joined call', { username: joinedUser, userId })
      
      // Don't create peer connection with yourself
      if (userId === socket.id) {
        logger.video('Ignoring self join event', { userId })
        return
      }
      
      toast(`${joinedUser} joined the call`)
      
      // Create peer connection for new user
      await createPeerConnection(userId)
    }

    // Listen for users leaving the call
    const handleUserLeft = ({ username: leftUser, userId }) => {
      logger.video('User left call', { username: leftUser, userId })
      toast(`${leftUser} left the call`)
      removePeerConnection(userId)
    }

    socket.on('user-joined-call', handleUserJoined)
    socket.on('user-left-call', handleUserLeft)

    return () => {
      socket.off('user-joined-call', handleUserJoined)
      socket.off('user-left-call', handleUserLeft)
    }
  }, [socket, localStream])

  const startCall = async () => {
    try {
      setIsConnecting(true)
      setPermissionError(false)
      
      logger.video('Requesting camera and microphone access', {})
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      logger.success('VIDEO', 'Got media stream', { streamId: stream.id })
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Wait for video to be ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      logger.video('Emitting join-call event', { roomCode, username })
      // Notify others that you joined
      socket.emit('join-call', { roomCode, username })
      
      setIsConnecting(false)
      toast.success('✅ Connected! Waiting for others...')
    } catch (error) {
      logger.error('VIDEO', 'Error accessing media', { error: error.message, name: error.name })
      setPermissionError(true)
      setIsConnecting(false)
      
      let errorMessage = '❌ Could not access camera/microphone\n\n'
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += '🔒 Permission denied!\n\nSteps to fix:\n1. Click camera icon in address bar\n2. Allow camera and microphone\n3. Refresh page and try again'
      } else if (error.name === 'NotFoundError') {
        errorMessage += '📷 No camera/microphone found!\n\nMake sure your device has a camera and microphone.'
      } else if (error.name === 'NotReadableError') {
        errorMessage += '⚠️ Camera is being used by another app!\n\nClose other apps using camera and try again.'
      } else {
        errorMessage += `Error: ${error.message}`
      }
      
      toast.error(errorMessage, { duration: 8000 })
      
      // Close call after 3 seconds if permission denied
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  const createPeerConnection = async (remoteUserId) => {
    if (peers[remoteUserId]) {
      logger.warn('VIDEO', 'Peer connection already exists', { remoteUserId })
      return // Already connected
    }

    logger.video('Creating peer connection', { remoteUserId })
    logger.video('Local stream available', { 
      hasStream: !!localStream, 
      tracks: localStream?.getTracks().map(t => `${t.kind}: ${t.enabled}`)
    })

    const peer = new WebRTCPeer(
      socket,
      roomCode,
      localStream,
      remoteUserId,
      handleRemoteStream
    )

    setPeers(prev => ({
      ...prev,
      [remoteUserId]: { peer, stream: null }
    }))

    // Create offer to initiate connection
    logger.video('Creating offer', { remoteUserId })
    await peer.createOffer()
    logger.success('VIDEO', 'Offer created and sent', { remoteUserId })
  }

  const handleRemoteStream = (userId, stream) => {
    logger.success('VIDEO', 'Received remote stream', { 
      userId, 
      streamId: stream.id,
      tracks: stream.getTracks().map(t => `${t.kind}: ${t.enabled}`)
    })
    
    setPeers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], stream }
    }))

    // Set video element immediately
    setTimeout(() => {
      if (remoteVideosRef.current[userId]) {
        remoteVideosRef.current[userId].srcObject = stream
        logger.success('VIDEO', 'Set srcObject for user', { userId })
      } else {
        logger.warn('VIDEO', 'Video ref not found for user', { userId })
      }
    }, 100)
  }

  const removePeerConnection = (userId) => {
    if (peers[userId]) {
      peers[userId].peer?.close()
      setPeers(prev => {
        const newPeers = { ...prev }
        delete newPeers[userId]
        return newPeers
      })
    }
  }

  const stopCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    // Close all peer connections
    Object.values(peers).forEach(({ peer }) => peer?.close())
    setPeers({})

    // Notify others
    socket?.emit('leave-call', { roomCode, username })
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setVideoEnabled(videoTrack.enabled)
      toast(videoTrack.enabled ? 'Camera on' : 'Camera off')
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setAudioEnabled(audioTrack.enabled)
      toast(audioTrack.enabled ? 'Mic on' : 'Mic off')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-green-400" />
          <h3 className="font-bold">Video Call</h3>
          <span className="text-sm text-gray-400">
            ({Object.keys(peers).length + 1} {Object.keys(peers).length === 0 ? 'person' : 'people'})
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Permission Error Screen */}
        {permissionError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
            <div className="text-center max-w-md px-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Camera/Microphone Blocked</h3>
              <p className="text-gray-300 mb-6">
                Please allow camera and microphone permissions to use video calls.
              </p>
              <div className="glass rounded-xl p-4 text-left mb-6">
                <p className="font-bold mb-2">How to fix:</p>
                <ol className="text-sm space-y-2 text-gray-300">
                  <li>1. Click the camera icon (🎥) in your browser's address bar</li>
                  <li>2. Select "Allow" for camera and microphone</li>
                  <li>3. Refresh the page</li>
                  <li>4. Try joining the call again</li>
                </ol>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all"
              >
                Close Call
              </button>
            </div>
          </div>
        )}

        {/* Connecting Screen */}
        {isConnecting && !permissionError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Connecting to camera...</p>
              <p className="text-sm text-gray-400 mt-2">Please allow camera and microphone access</p>
            </div>
          </div>
        )}

        {/* Remote Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 h-full">
          {Object.entries(peers).map(([userId, { stream }]) => (
            <div key={userId} className="relative bg-gray-900 rounded-xl overflow-hidden">
              {stream ? (
                <video
                  ref={el => {
                    if (el && stream) {
                      remoteVideosRef.current[userId] = el
                      el.srcObject = stream
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Connecting...</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 rounded-lg text-sm">
                User {userId.slice(0, 4)}
              </div>
            </div>
          ))}
          
          {/* Show message if alone */}
          {Object.keys(peers).length === 0 && !isConnecting && !permissionError && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Waiting for others to join...</p>
                <p className="text-sm">Share the room code with others</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-32 md:w-48 md:h-48 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs">
            You
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass border-t border-white/10 px-4 py-4">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              videoEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'
            }`}
            title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Toggle Audio */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              audioEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'
            }`}
            title={audioEnabled ? 'Mute mic' : 'Unmute mic'}
          >
            {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={() => {
              stopCall()
              onClose()
            }}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  )
}
