import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AccessToken } from 'livekit-server-sdk';
import logger from './logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleDistPaths = [
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist')
];
const clientDistPath = possibleDistPaths.find(p => fs.existsSync(p)) || possibleDistPaths[0];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(clientDistPath));

// LiveKit Token Endpoint
app.post('/api/livekit-token', async (req, res) => {
  try {
    const { roomName, participantName } = req.body;
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secretsecretsecretsecretsecretsecretsecret';

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName || 'Anonymous_' + Math.floor(Math.random() * 1000),
    });
    at.addGrant({ roomJoin: true, room: roomName || 'shared-space-default' });

    const token = await at.toJwt();
    res.json({ 
      token, 
      wsUrl: process.env.LIVEKIT_URL || 'wss://demo.livekit.cloud' 
    });
  } catch (err) {
    logger.info('LIVEKIT', 'Error generating token fallback', { error: err.message });
    res.status(500).json({ error: 'Failed to generate LiveKit token' });
  }
});

// In-memory storage
const rooms = new Map();

// REST Endpoint to fetch public rooms dashboard list
app.get('/api/rooms', (req, res) => {
  const roomList = [];
  rooms.forEach((room, roomCode) => {
    roomList.push({
      roomCode,
      isPrivate: !!room.isPrivate,
      userCount: room.users ? room.users.size : 0,
      hasPassword: !!room.password
    });
  });
  res.json(roomList);
});

// Health check
app.get('/health', (req, res) => {
  logger.info('HEALTH', 'Health check requested', { rooms: rooms.size });
  res.json({ status: 'ok', rooms: rooms.size });
});

// Socket.IO connection
io.on('connection', (socket) => {
  logger.socket('User connected', { socketId: socket.id });

  // Join room
  socket.on('join-room', ({ roomCode, userId, username, isPrivate = false, password = '' }) => {
    logger.room('User joining room', { roomCode, userId, username, isPrivate, socketId: socket.id });
    
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, {
        users: new Map(),
        boxes: [],
        drawings: [],
        wallpaper: '#1a1a2e',
        isPrivate: !!isPrivate,
        password: password || ''
      });
      logger.room('New room created', { roomCode, isPrivate });
    }
    
    const room = rooms.get(roomCode);

    // If private room with password, check password match
    if (room.isPrivate && room.password && room.password !== password) {
      socket.emit('room-access-denied', { message: 'Incorrect room password!' });
      return;
    }

    socket.join(roomCode);
    room.users.set(socket.id, { userId, username });
    
    // Broadcast current state to ALL room participants so count updates instantly for everyone
    io.to(roomCode).emit('room-state', {
      users: Array.from(room.users.values()),
      boxes: room.boxes,
      drawings: room.drawings,
      wallpaper: room.wallpaper
    });
    
    // Notify others (not including the joining user)
    socket.to(roomCode).emit('user-joined', { username });
    logger.room('User joined room successfully', { roomCode, username, totalUsers: room.users.size });
  });

  // Text update
  socket.on('text-update', ({ roomCode, boxId, text }) => {
    socket.to(roomCode).emit('text-update', { boxId, text });
  });

  // Textbox update (real-time sync)
  socket.on('textbox-update', ({ roomCode, boxId, text }) => {
    socket.to(roomCode).emit('textbox-update', { boxId, text });
  });

  // Typing indicator
  socket.on('typing', ({ roomCode, boxId, isTyping, username }) => {
    socket.to(roomCode).emit('typing', { boxId, isTyping, username });
  });

  // Chat message
  socket.on('chat-message', ({ roomCode, username, message, timestamp, messageId }) => {
    logger.chat('Message sent', { roomCode, username, messageId });
    io.to(roomCode).emit('chat-message', { username, message, timestamp, messageId });
  });

  // Message delivery confirmation
  socket.on('message-delivered', ({ roomCode, messageId }) => {
    logger.chat('Message delivered', { roomCode, messageId });
    socket.to(roomCode).emit('message-delivered', { messageId });
  });

  // Message seen confirmation (per-user tracking)
  socket.on('message-seen', ({ roomCode, messageId, userId }) => {
    logger.chat('Message seen by user', { roomCode, messageId, userId });
    // Broadcast to all users in room with userId info
    io.to(roomCode).emit('message-seen-by-user', { messageId, userId });
  });

  // File message
  socket.on('file-message', ({ roomCode, username, fileData, fileName, fileType, timestamp, messageId }) => {
    logger.chat('File message sent', { roomCode, username, fileName, fileType, messageId });
    socket.to(roomCode).emit('file-message', { username, fileData, fileName, fileType, timestamp, messageId });
  });

  // Live Call Signaling & Invitation Events
  socket.on('call:initiate', ({ roomCode, callerName, callType }) => {
    logger.room('Call initiated', { roomCode, callerName, callType });
    socket.to(roomCode).emit('call:incoming', { callerName, callType });
  });

  socket.on('call:reject', ({ roomCode, username }) => {
    logger.room('Call rejected', { roomCode, username });
    socket.to(roomCode).emit('call:rejected', { username });
  });

  // Memories
  socket.on('get-memories', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.memories) {
      logger.info('MEMORIES', 'Memories retrieved', { roomCode, count: room.memories.length });
      socket.emit('room-memories', room.memories);
    }
  });

  socket.on('save-memory', (memory) => {
    const room = rooms.get(memory.roomCode);
    if (room) {
      if (!room.memories) room.memories = [];
      room.memories.push(memory);
      logger.info('MEMORIES', 'Memory saved', { roomCode: memory.roomCode, memoryId: memory.id });
      // Broadcast to all users in room
      io.to(memory.roomCode).emit('new-memory', memory);
    }
  });

  socket.on('delete-memory', ({ roomCode, memoryId }) => {
    const room = rooms.get(roomCode);
    if (room && room.memories) {
      room.memories = room.memories.filter(m => m.id !== memoryId);
      logger.info('MEMORIES', 'Memory deleted', { roomCode, memoryId });
      io.to(roomCode).emit('memory-deleted', { memoryId });
    }
  });

  // Snapshot message
  socket.on('snapshot-message', ({ roomCode, username, imageData, timestamp }) => {
    logger.chat('Snapshot sent', { roomCode, username });
    // Broadcast snapshot to all users in the room (including sender for confirmation)
    io.to(roomCode).emit('snapshot-message', { username, imageData, timestamp });
  });

  // Snap request - trigger all users to capture their photos
  socket.on('snap-request', ({ roomCode }) => {
    logger.chat('Group snap requested', { roomCode });
    // Broadcast snap request to all users in the room
    socket.to(roomCode).emit('snap-request');
  });

  // Video call events
  socket.on('initiate-video-call', ({ roomCode, callerName }) => {
    logger.video('Video call initiated', { roomCode, callerName });
    socket.to(roomCode).emit('incoming-video-call', { callerName });
  });

  socket.on('join-call', ({ roomCode, username }) => {
    // Get all users currently in the call
    const room = io.sockets.adapter.rooms.get(roomCode);
    const existingUsers = room ? Array.from(room).filter(id => id !== socket.id) : [];
    
    logger.video('User joining video call', { roomCode, username, socketId: socket.id, existingUsers: existingUsers.length });
    
    // Tell the new user about existing users
    existingUsers.forEach(existingUserId => {
      socket.emit('user-joined-call', { 
        username: 'Existing User', 
        userId: existingUserId 
      });
    });
    
    // Broadcast to ALL users in the room (including sender for confirmation)
    io.to(roomCode).emit('user-joined-call', { username, userId: socket.id });
    logger.video('Broadcasted join event', { roomCode, username });
  });

  socket.on('leave-call', ({ roomCode, username }) => {
    logger.video('User left video call', { roomCode, username });
    socket.to(roomCode).emit('user-left-call', { username, userId: socket.id });
  });

  // Audio call events
  socket.on('initiate-audio-call', ({ roomCode, callerName }) => {
    logger.audio('Audio call initiated', { roomCode, callerName });
    socket.to(roomCode).emit('incoming-audio-call', { callerName });
  });

  socket.on('join-audio-call', ({ roomCode, username }) => {
    // Get all users currently in the call
    const room = io.sockets.adapter.rooms.get(roomCode);
    const existingUsers = room ? Array.from(room).filter(id => id !== socket.id) : [];
    
    logger.audio('User joining audio call', { roomCode, username, socketId: socket.id, existingUsers: existingUsers.length });
    
    // Tell the new user about existing users
    existingUsers.forEach(existingUserId => {
      socket.emit('user-joined-audio-call', { 
        username: 'Existing User', 
        userId: existingUserId 
      });
    });
    
    // Broadcast to ALL users in the room (including sender for confirmation)
    io.to(roomCode).emit('user-joined-audio-call', { username, userId: socket.id });
    logger.audio('Broadcasted join event', { roomCode, username });
  });

  socket.on('leave-audio-call', ({ roomCode, username }) => {
    logger.audio('User left audio call', { roomCode, username });
    socket.to(roomCode).emit('user-left-audio-call', { username, userId: socket.id });
  });

  // WebRTC signaling for peer-to-peer connections
  socket.on('webrtc-offer', ({ roomCode, offer, targetUserId }) => {
    logger.video('Forwarding WebRTC offer', { from: socket.id, to: targetUserId });
    io.to(targetUserId).emit('webrtc-offer', { offer, fromUserId: socket.id });
  });

  socket.on('webrtc-answer', ({ roomCode, answer, targetUserId }) => {
    logger.video('Forwarding WebRTC answer', { from: socket.id, to: targetUserId });
    io.to(targetUserId).emit('webrtc-answer', { answer, fromUserId: socket.id });
  });

  socket.on('ice-candidate', ({ roomCode, candidate, targetUserId }) => {
    logger.video('Forwarding ICE candidate', { from: socket.id, to: targetUserId });
    io.to(targetUserId).emit('ice-candidate', { candidate, fromUserId: socket.id });
  });

  // Drawing
  socket.on('draw', ({ roomCode, drawData }) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.drawings.push(drawData);
      if (room.drawings.length > 1000) {
        room.drawings = room.drawings.slice(-1000);
      }
    }
    socket.to(roomCode).emit('draw', { drawData });
  });

  // Clear canvas
  socket.on('clear-canvas', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) room.drawings = [];
    logger.info('CANVAS', 'Canvas cleared', { roomCode });
    socket.to(roomCode).emit('clear-canvas');
  });

  // Wallpaper
  socket.on('wallpaper-change', ({ roomCode, wallpaper }) => {
    const room = rooms.get(roomCode);
    if (room) room.wallpaper = wallpaper;
    logger.info('CANVAS', 'Wallpaper changed', { roomCode, wallpaper });
    socket.to(roomCode).emit('wallpaper-change', { wallpaper });
  });

  // Add box
  socket.on('add-box', ({ roomCode, box }) => {
    const room = rooms.get(roomCode);
    if (room) room.boxes.push(box);
    logger.info('TEXTBOX', 'Box added', { roomCode, boxId: box.id });
    socket.to(roomCode).emit('add-box', { box });
  });

  // Update box
  socket.on('update-box', ({ roomCode, boxId, updates }) => {
    socket.to(roomCode).emit('update-box', { boxId, updates });
  });

  // Delete box
  socket.on('delete-box', ({ roomCode, boxId }) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.boxes = room.boxes.filter(b => b.id !== boxId);
    }
    logger.info('TEXTBOX', 'Box deleted', { roomCode, boxId });
    socket.to(roomCode).emit('delete-box', { boxId });
  });

  // Soundboard Trigger Event (18+ SFX)
  socket.on('sound:trigger', ({ roomCode, soundId, soundName, username }) => {
    logger.chat('Sound trigger broadcast', { roomCode, soundId, username });
    io.to(roomCode).emit('sound:trigger', { soundId, soundName, username });
  });

  // Ghosted Snap Event (Candid Camera Capture)
  socket.on('ghost:snap', ({ roomCode, username }) => {
    logger.chat('Ghost snap requested', { roomCode, username });
    socket.to(roomCode).emit('ghost:snap', { username });
  });

  socket.on('ghost:snap_result', ({ roomCode, username, photoData }) => {
    logger.chat('Ghost snap result broadcast', { roomCode, username });
    io.to(roomCode).emit('ghost:snap_result', { username, photoData });
  });

  // Disco Party Mode Strobe Flash
  socket.on('party:mode', ({ roomCode, username }) => {
    logger.chat('Party mode triggered', { roomCode, username });
    io.to(roomCode).emit('party:mode', { username });
  });

  // Room-wide Rainbow Trail Mode Toggle
  socket.on('rainbow:mode', ({ roomCode, username, enabled }) => {
    logger.chat('Rainbow mode toggled', { roomCode, username, enabled });
    io.to(roomCode).emit('rainbow:mode', { username, enabled });
  });

  // Room-wide Position GIF Trigger
  socket.on('position:gif', ({ roomCode, username, gifUrl, title }) => {
    logger.chat('Position GIF broadcast', { roomCode, username, title });
    io.to(roomCode).emit('position:gif', { username, gifUrl, title });
  });

  // Draw Notice Event
  socket.on('draw:notice', ({ roomCode, username }) => {
    socket.to(roomCode).emit('draw:notice', { username });
  });

  // Random Matching Queue by Gender (Boys vs Girls)
  const randomQueue = { Male: [], Female: [], Any: [] };

  socket.on('random:match', ({ username, gender, preferredGender }) => {
    logger.room('Random match requested', { username, gender, preferredGender });

    // Look for opposite gender or any in queue
    const targetQueue = preferredGender === 'Female' ? randomQueue.Female : preferredGender === 'Male' ? randomQueue.Male : randomQueue.Any;
    
    if (targetQueue.length > 0) {
      const partner = targetQueue.shift();
      const matchRoom = `MATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Notify both sockets of successful match
      socket.emit('random:matched', { roomCode: matchRoom, partnerName: partner.username });
      partner.socket.emit('random:matched', { roomCode: matchRoom, partnerName: username });
      logger.room('Random match created', { matchRoom, user1: username, user2: partner.username });
    } else {
      // Add to queue
      const userQueue = gender === 'Female' ? randomQueue.Female : gender === 'Male' ? randomQueue.Male : randomQueue.Any;
      userQueue.push({ socket, username, gender });
      socket.emit('random:queued', { message: 'Searching for partner of opposite gender...' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Find which rooms the user was in and notify others
    rooms.forEach((room, roomCode) => {
      if (room.users.has(socket.id)) {
        const user = room.users.get(socket.id);
        room.users.delete(socket.id);
        socket.to(roomCode).emit('user-left', { username: user.username });
        io.to(roomCode).emit('room-state', {
          users: Array.from(room.users.values()),
          boxes: room.boxes,
          drawings: room.drawings,
          wallpaper: room.wallpaper
        });
        logger.socket('User disconnected from room', { socketId: socket.id, username: user.username, roomCode });
      }
    });
    logger.socket('User disconnected', { socketId: socket.id });
  });
});

// Uncaught Exception & Promise Rejection Safeguards (Prevents Render Process Crashes)
process.on('uncaughtException', (err) => {
  console.error('🛡️ Process Uncaught Exception Guard:', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('🛡️ Process Unhandled Rejection Guard:', reason);
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="3"></head><body><h2>Loading Shared Space...</h2></body></html>');
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.success('SERVER', `Server running on port ${PORT}`, { port: PORT });
  
  // Render Free Tier Keep-Alive Pinger (Pings every 45s to prevent Render sleep)
  const selfUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  setInterval(() => {
    try {
      fetch(`${selfUrl}/health`).catch(() => {});
    } catch (e) {}
  }, 45000);
});
