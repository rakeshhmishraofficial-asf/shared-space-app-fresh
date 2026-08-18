import { useRef, useEffect, useState } from 'react'
import { Upload, Eraser, Pen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Canvas({ socket, roomCode, brushType = 'normal', activeSticker, username }) {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#ff0055')
  const [lineWidth, setLineWidth] = useState(4)
  const [tool, setTool] = useState('pen') // 'pen' or 'eraser'
  const hueRef = useRef(0)
  const drawNoticeTimeoutRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Listen for drawings & ghost snaps from other users
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
    })

    socket.on('ghost:snap_result', ({ username: snapUser, photoData }) => {
      if (!photoData) return;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const x = Math.random() * (canvas.width - 240);
        const y = Math.random() * (canvas.height - 240);
        
        // Draw polaroid background
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(x, y, 220, 240);
        ctx.drawImage(img, x + 10, y + 10, 200, 170);
        
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`CAUGHT IN 4K 📸 @${snapUser}`, x + 12, y + 205);
        ctx.fillStyle = '#a855f7';
        ctx.font = '10px monospace';
        ctx.fillText(new Date().toLocaleTimeString(), x + 12, y + 225);
      };
      img.src = photoData;
      toast(`👻 Ghost Snap pinned by @${snapUser}!`, { icon: '📸' });
    });

    return () => {
      socket.off('draw')
      socket.off('clear-canvas')
      socket.off('ghost:snap_result')
    }
  }, [socket])

  const drawLine = (data) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (data.image) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, data.x, data.y, data.width, data.height)
      }
      img.src = data.image
      return
    }

    if (data.sticker) {
      ctx.font = `${data.lineWidth * 10}px sans-serif`
      ctx.fillText(data.sticker, data.x1, data.y1)
      return
    }

    ctx.beginPath()
    ctx.moveTo(data.x0, data.y0)
    
    if (data.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = data.lineWidth * 4
    } else if (data.brushType === 'laser') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#00f0ff'
      ctx.shadowColor = '#00f0ff'
      ctx.shadowBlur = 18
      ctx.lineWidth = data.lineWidth * 2.5
    } else if (data.brushType === 'rainbow') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = data.color || '#ff0055'
      ctx.shadowColor = data.color || '#ff0055'
      ctx.shadowBlur = 8
      ctx.lineWidth = data.lineWidth * 1.5
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = data.color || '#ff0055'
      ctx.shadowBlur = 0
      ctx.lineWidth = data.lineWidth
    }
    
    ctx.lineTo(data.x1, data.y1)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const x = clientX - rect.left
    const y = clientY - rect.top

    if (activeSticker) {
      const drawData = { x1: x, y1: y, sticker: activeSticker, lineWidth }
      drawLine(drawData)
      if (socket) socket.emit('draw', { roomCode, drawData })
      return
    }

    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
    
    canvasRef.current.lastX = x
    canvasRef.current.lastY = y

    // Throttle real-time draw notification to room
    if (socket && !drawNoticeTimeoutRef.current) {
      socket.emit('draw:notice', { roomCode, username });
      drawNoticeTimeoutRef.current = setTimeout(() => {
        drawNoticeTimeoutRef.current = null;
      }, 5000);
    }
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing || activeSticker) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const x = clientX - rect.left
    const y = clientY - rect.top

    let currentColor = color
    if (brushType === 'rainbow') {
      hueRef.current = (hueRef.current + 5) % 360
      currentColor = `hsl(${hueRef.current}, 100%, 60%)`
    }

    const drawData = {
      x0: canvasRef.current.lastX,
      y0: canvasRef.current.lastY,
      x1: x,
      y1: y,
      color: currentColor,
      lineWidth,
      tool,
      brushType: brushType || 'normal'
    }

    drawLine(drawData)
    
    if (socket) {
      socket.emit('draw', { roomCode, drawData })
    }

    canvasRef.current.lastX = x
    canvasRef.current.lastY = y
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Notify other users
    if (socket) {
      socket.emit('clear-canvas', { roomCode })
    }
    
    toast.success('Canvas cleared')
  }

  const handleCanvasTap = (e) => {
    // Check if it's a double tap (two taps within 300ms)
    const now = Date.now()
    const lastTap = canvasRef.current.lastTapTime || 0
    
    if (now - lastTap < 300) {
      // Double tap detected - clear canvas
      clearCanvas()
      canvasRef.current.lastTapTime = 0
    } else {
      canvasRef.current.lastTapTime = now
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        // Calculate scaling to fit canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height,
          1
        )
        
        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        toast.success('Image uploaded to room canvas! 🖼️')
        
        // Emit image to room
        if (socket) {
          const drawData = {
            image: event.target.result,
            x, y,
            width: img.width * scale,
            height: img.height * scale
          }
          socket.emit('draw', { roomCode, drawData })
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const colors = ['#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#ffd93d', '#6bcf7f']

  return (
    <div className="relative h-full">
      {/* Info Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-lg text-sm z-10 pointer-events-none">
        💡 Double-tap canvas to clear
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={(e) => {
          stopDrawing(e)
          handleCanvasTap(e)
        }}
        onClick={handleCanvasTap}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ touchAction: 'none' }}
      />

      {/* Drawing Tools */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-3 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-2 md:gap-4 z-10 max-w-[95vw] overflow-x-auto">
        {/* Tool Selection */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 md:p-2 rounded-lg transition-all ${
              tool === 'pen' ? 'bg-purple-500' : 'hover:bg-white/10'
            }`}
            title="Pen"
          >
            <Pen className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 md:p-2 rounded-lg transition-all ${
              tool === 'eraser' ? 'bg-purple-500' : 'hover:bg-white/10'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="w-px h-4 md:h-6 bg-white/20"></div>

        {/* Colors */}
        {tool === 'pen' && (
          <>
            <div className="flex items-center gap-1 md:gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="w-px h-4 md:h-6 bg-white/20"></div>
          </>
        )}

        {/* Line Width */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-400">Size:</span>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20 md:w-24"
          />
        </div>

        <div className="w-px h-4 md:h-6 bg-white/20"></div>

        {/* Upload Image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-all"
          title="Upload Image"
        >
          <Upload className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="w-px h-4 md:h-6 bg-white/20"></div>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all text-sm md:text-base"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
