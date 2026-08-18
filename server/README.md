# Shared Space - Backend Server

WebSocket server for real-time collaboration features including chat, video/audio calls, drawing, and shared textboxes.

## Tech Stack
- Node.js + Express
- Socket.IO for real-time communication
- CORS enabled

## Environment Variables
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL for CORS (required)

## Local Development
```bash
npm install
npm run dev
```

## Production
```bash
npm start
```
