import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useSocket } from './hooks/useSocket'

function App() {
  const [roomCode, setRoomCode] = useState('')
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState('')
  
  const { socket, connected } = useSocket(joined ? roomCode : null)

  const handleJoinRoom = () => {
    if (!roomCode.trim() || !username.trim()) {
      alert('Please enter name and room code')
      return
    }
    setJoined(true)
  }

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert('Please enter your name first')
      return
    }
    const newCode = 'RS16' + Math.random().toString(36).substring(2, 6).toUpperCase()
    setRoomCode(newCode)
    setJoined(true)
  }

  if (joined) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #4a1a4a 50%, #1a1a2e 100%)',
        color: 'white',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <Toaster />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>Shared Space</h1>
          <p>Room: {roomCode}</p>
          <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
          <p>Username: {username}</p>
          <button 
            onClick={() => setJoined(false)}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Leave Room
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #4a1a4a 50%, #1a1a2e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <Toaster />
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Shared Space</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button 
            onClick={handleJoinRoom}
            style={{
              padding: '12px',
              background: 'linear-gradient(to right, #a855f7, #3b82f6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Join Room
          </button>
          <div style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>or</div>
          <button 
            onClick={handleCreateRoom}
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
