import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocket = (roomCode, username, roomOptions = {}) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Always maintain a socket connection or connect when roomCode is present
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('✅ Connected to server')
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
