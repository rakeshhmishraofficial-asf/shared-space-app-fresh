import { useState, useEffect } from 'react'
import { X, Download, Trash2, Camera, Play } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Memories({ socket, roomCode, isOpen, onClose }) {
  const [memories, setMemories] = useState([])
  const [selectedMemory, setSelectedMemory] = useState(null)

  useEffect(() => {
    if (!socket || !isOpen) return

    // Request memories when opening
    socket.emit('get-memories', { roomCode })

    // Listen for memories
    socket.on('room-memories', (roomMemories) => {
      setMemories(roomMemories || [])
    })

    socket.on('new-memory', (memory) => {
      setMemories(prev => [...prev, memory])
      toast.success(`New memory from ${memory.username}!`)
    })

    socket.on('memory-deleted', ({ memoryId }) => {
      setMemories(prev => prev.filter(m => m.id !== memoryId))
    })

    return () => {
      socket.off('room-memories')
      socket.off('new-memory')
      socket.off('memory-deleted')
    }
  }, [socket, roomCode, isOpen])

  const deleteMemory = (memoryId) => {
    socket?.emit('delete-memory', { roomCode, memoryId })
    setMemories(prev => prev.filter(m => m.id !== memoryId))
    toast('Memory deleted')
  }

  const downloadMemory = (memory) => {
    const link = document.createElement('a')
    link.href = memory.data
    link.download = `memory-${memory.id}.${memory.type === 'photo' ? 'jpg' : 'webm'}`
    link.click()
    toast.success('Downloaded!')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-[70] flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold">📸 Memories</h2>
          <span className="text-sm text-gray-400">({memories.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Memories Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Camera className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 mb-2">No memories yet</p>
            <p className="text-sm text-gray-500">
              Memories are created when you take snapshots during video calls
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Click the camera icon (📷) during a video call to capture a moment!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {memories.map(memory => (
              <div
                key={memory.id}
                className="relative aspect-[3/4] glass rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setSelectedMemory(memory)}
              >
                {memory.type === 'photo' ? (
                  <img
                    src={memory.data}
                    alt="Memory"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={memory.data}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-12 h-12" />
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-semibold truncate">{memory.username}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Viewer */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black z-[80] flex flex-col">
          <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold">{selectedMemory.username}</p>
              <p className="text-xs text-gray-400">
                {new Date(selectedMemory.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadMemory(selectedMemory)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  deleteMemory(selectedMemory.id)
                  setSelectedMemory(null)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-red-400"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-black">
            {selectedMemory.type === 'photo' ? (
              <img
                src={selectedMemory.data}
                alt="Memory"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={selectedMemory.data}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
