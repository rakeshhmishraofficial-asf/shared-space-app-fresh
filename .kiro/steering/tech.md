# Technology Stack

## Frontend

### Core Technologies
- **React 18.2** - UI framework
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first styling
- **Socket.IO Client 4.6** - Real-time WebSocket communication

### Key Libraries
- **lucide-react** - Icon components
- **react-hot-toast** - Toast notifications
- **WebRTC API** - Peer-to-peer video/audio calls

### Build Configuration
- ES modules (`"type": "module"`)
- Vite with React plugin
- PostCSS with Autoprefixer
- Tailwind CSS processing

## Backend

### Core Technologies
- **Node.js 18+** - Runtime environment
- **Express 4.18** - Web framework
- **Socket.IO 4.6** - WebSocket server
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Architecture
- In-memory data storage using JavaScript Maps
- Event-driven Socket.IO communication
- WebRTC signaling server for peer connections
- No database or persistence layer

## Development Environment

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager

### Environment Variables

**Server (.env)**
```
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client (.env)**
```
VITE_SOCKET_URL=http://localhost:5000
```

## Common Commands

### Server
```bash
cd server
npm install          # Install dependencies
npm start           # Start production server
npm run dev         # Start with nodemon (auto-reload)
```

### Client
```bash
cd client
npm install          # Install dependencies
npm run dev         # Start dev server (port 5173)
npm run build       # Build for production
npm run preview     # Preview production build
npm start           # Serve production build (port 10000)
```

### Full Application
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

## Deployment

### Production Configuration
- Backend: Port 10000 (Render.com)
- Frontend: Port 10000 (Render.com)
- HTTPS/SSL enabled automatically
- WebSocket transport: websocket + polling fallback

### Build Process
- Client: `npm run build` creates optimized production bundle in `dist/`
- Server: No build step, runs directly with Node.js
- Static serving: Express serves built client files in production

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)
- WebRTC support required for video/audio calls
