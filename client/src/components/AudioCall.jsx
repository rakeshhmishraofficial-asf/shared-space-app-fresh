import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, PhoneOff, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import WebRTCPeer from '../utils/webrtc'

export default function AudioCall({ socket, roomCode, username, isOpen, onClose }) {
  const [localStream, setLocalStream] = useState(null)
  const [peers, setPeers] = useState({})
  const [audioEnabled, setAudioEnabled] = useState(true)
  const remoteAudiosRef = useRef({})

  useEffect(() => {
    if (!isOpen || !socket) return

    startCall()

    return () => {
      stopCall()
    }
  }, [isOpen, socket])

  useEffect(() => {
    if (!socket || !localStream) return

    const handleUserJoined = async ({ username: joinedUser, userId }) => {
      console.log('User joined audio call:', joinedUser, userId)
      
      // Don't create peer connection with yourself
      if (userId === socket.id) {
        console.log('Ignoring self join event')
        return
      }
      
      toast(`${joinedUser} joined the call`)
      
      await createPeerConnection(userId)
    }

    const handleUserLeft = ({ username: leftUser, userId }) => {
      console.log('User left audio call:', leftUser, userId)
      toast(`${leftUser} left the call`)
      removePeerConnection(userId)
    }

    socket.on('user-joined-audio-call', handleUserJoined)
    socket.on('user-left-audio-call', handleUserLeft)

    return () => {
      socket.off('user-joined-audio-call', handleUserJoined)
      socket.off('user-left-audio-call', handleUserLeft)
    }
  }, [socket, localStream])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      setLocalStream(stream)

      // Wait a moment for stream to be ready
      setTimeout(() => {
        socket.emit('join-audio-call', { roomCode, username })
        toast.success('Joined audio call!')
      }, 500)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Could not access microphone. Please allow permissions.')
      onClose() // Close the call if permissions denied
    }
  }

  const createPeerConnection = async (remoteUserId) => {
    if (peers[remoteUserId]) return

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

    await peer.createOffer()
  }

  const handleRemoteStream = (userId, stream) => {
    console.log('Received remote audio stream from:', userId)
    
    setPeers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], stream }
    }))

    if (remoteAudiosRef.current[userId]) {
      remoteAudiosRef.current[userId].srcObject = stream
    }
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
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    Object.values(peers).forEach(({ peer }) => peer?.close())
    setPeers({})

    socket?.emit('leave-audio-call', { roomCode, username })
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-[60] flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold">Audio Call</h3>
          <span className="text-sm text-gray-400">
            ({Object.keys(peers).length + 1} {Object.keys(peers).length === 0 ? 'person' : 'people'})
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          {/* Animated Mic Icon */}
          <div className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ${audioEnabled ? 'animate-pulse' : ''}`}>
            {audioEnabled ? (
              <Mic className="w-16 h-16" />
            ) : (
              <MicOff className="w-16 h-16" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">{username}</h2>
          <p className="text-gray-400 mb-8">
            {Object.keys(peers).length === 0 ? 'Waiting for others...' : `Connected with ${Object.keys(peers).length} ${Object.keys(peers).length === 1 ? 'person' : 'people'}`}
          </p>

          {/* Participants */}
          {Object.keys(peers).length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {Object.keys(peers).map(userId => (
                <div key={userId} className="glass rounded-xl p-4 min-w-[120px]">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm">User {userId.slice(0, 4)}</p>
                  <audio
                    ref={el => remoteAudiosRef.current[userId] = el}
                    autoPlay
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="glass border-t border-white/10 px-4 py-6">
        <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
          {/* Toggle Audio */}
          <button
            onClick={toggleAudio}
            className={`p-6 rounded-full transition-all ${
              audioEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'
            }`}
            title={audioEnabled ? 'Mute mic' : 'Unmute mic'}
          >
            {audioEnabled ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
          </button>

          {/* End Call */}
          <button
            onClick={() => {
              stopCall()
              onClose()
            }}
            className="p-6 bg-red-500 hover:bg-red-600 rounded-full transition-all"
            title="End call"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  )
}
