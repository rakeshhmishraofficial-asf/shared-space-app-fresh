import { useRef, useEffect, useState } from 'react'
import { Upload, Eraser, Pen, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Canvas({ socket, roomCode, brushType = 'normal', activeSticker, username, onClearPositionOverlay }) {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#ff0055')
  const [lineWidth, setLineWidth] = useState(4)
  const [tool, setTool] = useState('pen') // 'pen' or 'eraser'
  const hueRef = useRef(0)
  const drawNoticeTimeoutRef = useRef(null)
  const lastTapRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Listen for drawings from other users
  useEffect(() => {
    if (!socket) return

    socket.on('draw', ({ drawData }) => {
      drawLine(drawData)
    })

    socket.on('clear-canvas', () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (onClearPositionOverlay) onClearPositionOverlay()
    })

    return () => {
      socket.off('draw')
      socket.off('clear-canvas')
    }
  }, [socket, onClearPositionOverlay])

  const drawLine = (data) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = data.tool === 'eraser' ? '#0b0518' : data.color
    ctx.lineWidth = data.lineWidth

    if (data.brushType === 'rainbow') {
      hueRef.current = (hueRef.current + 3) % 360
      ctx.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`
    } else if (data.brushType === 'glow') {
      ctx.shadowBlur = 15
      ctx.shadowColor = data.color
    } else {
      ctx.shadowBlur = 0
    }

    ctx.beginPath()
    ctx.moveTo(data.prevX, data.prevY)
    ctx.lineTo(data.x, data.y)
    ctx.stroke()
  }

  const handleStart = (e) => {
    // Detect Double Tap on Touch / Mobile
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      handleClearCanvas()
      return
    }
    lastTapRef.current = now

    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    canvasRef.current.lastX = x
    canvasRef.current.lastY = y

    if (socket && roomCode) {
      if (drawNoticeTimeoutRef.current) clearTimeout(drawNoticeTimeoutRef.current)
      drawNoticeTimeoutRef.current = setTimeout(() => {
        socket.emit('draw:notice', { roomCode, username })
      }, 400)
    }
  }

  const handleMove = (e) => {
    if (!isDrawing) return
    const { x, y } = getCoordinates(e)
    const canvas = canvasRef.current

    const drawData = {
      prevX: canvas.lastX,
      prevY: canvas.lastY,
      x,
      y,
      color,
      lineWidth: tool === 'eraser' ? 24 : lineWidth,
      tool,
      brushType,
      roomCode
    }

    drawLine(drawData)

    if (socket && roomCode) {
      socket.emit('draw', { roomCode, drawData })
    }

    canvas.lastX = x
    canvas.lastY = y
  }

  const handleEnd = () => {
    setIsDrawing(false)
  }

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (onClearPositionOverlay) {
      onClearPositionOverlay()
    }

    if (socket && roomCode) {
      socket.emit('clear-canvas', { roomCode })
    }

    toast('Canvas & Position Overlay Cleared 🧹', { icon: '✨' })
  }

  return (
    <div className="relative w-full h-full bg-[#080312] overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onDoubleClick={handleClearCanvas}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-black/90 backdrop-blur-2xl border-2 border-purple-500/60 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] max-w-[95%] overflow-x-auto">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-7 h-7 rounded-full border-2 border-white/40 cursor-pointer bg-transparent"
          title="Brush Color"
        />

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              tool === 'pen' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              tool === 'eraser' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleClearCanvas}
          className="p-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1 transition-all"
          title="Clear Canvas & Position Overlay (Or Double Tap Canvas)"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Canvas</span>
        </button>
      </div>
    </div>
  )
}
