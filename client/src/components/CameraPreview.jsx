import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CameraPreview({ socket, roomCode, username, onSnapCapture, onGroupSnap }) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)

  useEffect(() => {
    // Request camera permission on mount
    requestCameraAccess()

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const requestCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      
      setStream(mediaStream)
      setHasPermission(true)
      setCameraEnabled(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      toast.success('Camera access granted')
    } catch (error) {
      console.error('Camera access denied:', error)
      setHasPermission(false)
      toast.error('Camera access denied')
    }
  }

  const toggleCamera = () => {
    if (!stream) {
      requestCameraAccess()
      return
    }

    if (cameraEnabled) {
      // Disable camera
      stream.getVideoTracks().forEach(track => track.enabled = false)
      setCameraEnabled(false)
      toast('Camera disabled')
    } else {
      // Enable camera
      stream.getVideoTracks().forEach(track => track.enabled = true)
      setCameraEnabled(true)
      toast.success('Camera enabled')
    }
  }

  const captureSnapshot = () => {
    if (!videoRef.current || !cameraEnabled) {
      toast.error('Camera is not enabled')
      return null
    }

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    return imageData
  }

  const handleQuickSnap = () => {
    const snapshot = captureSnapshot()
    if (snapshot) {
      // Send snapshot to chat
      if (onSnapCapture) {
        onSnapCapture(snapshot, username)
      }
      toast.success('Snapshot captured!')
    }
  }

  // Listen for snap requests from other users
  useEffect(() => {
    if (!socket) return

    socket.on('snap-request', () => {
      // Auto-capture when someone requests a group snap
      if (cameraEnabled) {
        const snapshot = captureSnapshot()
        if (snapshot && onSnapCapture) {
          onSnapCapture(snapshot, username)
        }
      }
    })

    return () => {
      socket.off('snap-request')
    }
  }, [socket, cameraEnabled, username, onSnapCapture])

  if (hasPermission === false) {
    return (
      <div className="glass rounded-lg p-4 text-center">
        <CameraOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400 mb-3">Camera access denied</p>
        <button
          onClick={requestCameraAccess}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-semibold transition-all"
        >
          Request Access
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-lg overflow-hidden">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!cameraEnabled ? 'opacity-0' : ''}`}
        />
        {!cameraEnabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraOff className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Username overlay */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs font-semibold">
          {username} (You)
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 flex items-center justify-between gap-2">
        <button
          onClick={toggleCamera}
          className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            cameraEnabled
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {cameraEnabled ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span className="text-sm">Disable</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span className="text-sm">Enable</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            if (onGroupSnap) {
              onGroupSnap() // Request all users to snap
            }
          }}
          disabled={!cameraEnabled}
          className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Capture photos of all users with camera enabled"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm">Group Snap</span>
        </button>
      </div>
    </div>
  )
}
