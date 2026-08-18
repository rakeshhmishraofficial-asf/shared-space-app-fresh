# Project Structure

## Repository Layout

```
shared-space-app/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js server
├── .kiro/                  # Kiro AI configuration
├── README.md               # Main project documentation
└── START_HERE.md          # Deployment guide
```

## Client Structure (`/client`)

```
client/
├── public/                 # Static assets
│   ├── icon-*.svg         # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/        # React components
│   │   ├── AudioCall.jsx
│   │   ├── CallNotification.jsx
│   │   ├── CameraPreview.jsx
│   │   ├── Canvas.jsx
│   │   ├── ChatSidebar.jsx
│   │   ├── InstallPrompt.jsx
│   │   ├── Memories.jsx
│   │   ├── PasswordPrompt.jsx
│   │   ├── TextBox.jsx
│   │   └── VideoCall.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useSocket.js   # Socket.IO connection hook
│   ├── utils/             # Utility functions
│   │   ├── logger.js      # Client-side logging
│   │   └── webrtc.js      # WebRTC helpers
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles + Tailwind
├── dist/                  # Production build output (generated)
├── .env                   # Environment variables
├── .env.example           # Environment template
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── server.js              # Production static file server
```

## Server Structure (`/server`)

```
server/
├── index.js               # Main server file (Express + Socket.IO)
├── logger.js              # Server-side logging utility
├── .env                   # Environment variables
├── .env.example           # Environment template
└── package.json           # Dependencies and scripts
```

## Component Organization

### Main App Component (`App.jsx`)
- Entry point and state management
- Room join/create logic
- Authentication flow
- Feature toggles (canvas, chat, camera, calls)
- Socket connection management

### Feature Components
- **Canvas.jsx** - Collaborative drawing with real-time sync
- **ChatSidebar.jsx** - Messaging interface with file sharing
- **VideoCall.jsx** - WebRTC video call interface
- **AudioCall.jsx** - WebRTC audio call interface
- **CameraPreview.jsx** - Camera capture and group snap
- **Memories.jsx** - Saved snapshots viewer
- **TextBox.jsx** - Collaborative text editing
- **CallNotification.jsx** - Incoming call alerts
- **InstallPrompt.jsx** - PWA installation prompt
- **PasswordPrompt.jsx** - App authentication

### Custom Hooks
- **useSocket.js** - Manages Socket.IO connection lifecycle and room joining

## Server Architecture

### Main Server (`server/index.js`)
- Express HTTP server setup
- Socket.IO server with CORS configuration
- In-memory room state management using Maps
- Event handlers for all real-time features:
  - Room management (join, leave)
  - Chat messages and file sharing
  - Drawing and canvas operations
  - WebRTC signaling (offer, answer, ICE candidates)
  - Video/audio call coordination
  - Memories storage and retrieval

### Data Structure
```javascript
rooms = Map {
  roomCode: {
    users: Map { socketId: { userId, username } },
    boxes: [],
    drawings: [],
    wallpaper: '#1a1a2e',
    memories: []
  }
}
```

## Code Conventions

### File Naming
- React components: PascalCase (e.g., `Canvas.jsx`, `ChatSidebar.jsx`)
- Utilities/hooks: camelCase (e.g., `useSocket.js`, `logger.js`)
- Configuration: kebab-case (e.g., `vite.config.js`)

### Component Structure
- Functional components with hooks
- State management with `useState` and `useEffect`
- Socket event listeners in `useEffect` with cleanup
- Props destructuring in function parameters

### Styling Approach
- Tailwind utility classes for all styling
- Responsive design with mobile-first breakpoints (`md:`, `lg:`)
- Glass morphism effect via custom `.glass` class
- Gradient backgrounds for visual appeal

### Socket Event Naming
- kebab-case for event names (e.g., `join-room`, `chat-message`)
- Consistent payload structure: `{ roomCode, ...data }`
- Emit to specific rooms using `socket.to(roomCode).emit()`
- Broadcast to all including sender: `io.to(roomCode).emit()`

### State Management
- Local component state for UI concerns
- Socket events for cross-user synchronization
- localStorage for session persistence
- No global state management library (Redux, Zustand, etc.)

## Key Patterns

### Real-Time Synchronization
1. User performs action (draw, type, send message)
2. Update local state immediately (optimistic update)
3. Emit socket event to server with room code
4. Server broadcasts to other users in room
5. Other users receive event and update their state

### WebRTC Connection Flow
1. User initiates call → emit `initiate-video-call`
2. Other users receive `incoming-video-call` notification
3. Users join call → emit `join-call`
4. WebRTC peer connections established via signaling:
   - Offer/Answer exchange
   - ICE candidate exchange
5. Direct peer-to-peer media streams

### Error Handling
- Toast notifications for user feedback
- Console logging for debugging
- Permission checks before accessing camera/microphone
- Graceful fallbacks for unsupported features
