import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// Automatically detect host URL so Socket.IO connects to current domain on production or localhost in dev
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

export const useSocket = (roomCode, username, roomOptions = {}) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Always maintain a socket connection or connect when roomCode is present
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('✅ Connected to server:', SOCKET_URL)
      setConnected(true)
      
      if (roomCode && username) {
        socketInstance.emit('join-room', {
          roomCode,
          userId: username,
          username: username,
          isPrivate: roomOptions.isPrivate || false,
          password: roomOptions.password || ''
        })
      }
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from server')
      setConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [roomCode, username, roomOptions.isPrivate, roomOptions.password])

  return { socket, connected }
}
