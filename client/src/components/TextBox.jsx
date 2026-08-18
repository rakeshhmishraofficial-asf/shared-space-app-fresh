import { useState, useEffect } from 'react'

export default function TextBox({ id, initialText = '', onDelete, socket, roomCode }) {
  const [text, setText] = useState(initialText)

  // Listen for text updates from other users
  useEffect(() => {
    if (!socket) return

    socket.on('textbox-update', ({ boxId, text: newText }) => {
      if (boxId === id) {
        setText(newText)
      }
    })

    return () => {
      socket.off('textbox-update')
    }
  }, [socket, id])

  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    
    // Send to other users in real-time
    if (socket) {
      socket.emit('textbox-update', { roomCode, boxId: id, text: newText })
    }
  }

  return (
    <div className="glass rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Text Box {id}</span>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Delete
        </button>
      </div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type something..."
        className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
    </div>
  )
}
