# 🎨 Shared Space - Real-Time Collaboration App

A real-time collaboration platform where users can draw together, chat, share memories, and make video/audio calls - all in one shared space!

## ✨ Features

### 🎨 Canvas
- Real-time collaborative drawing
- Multiple colors and brush sizes
- Eraser tool
- Image upload
- Clear canvas
- Custom wallpapers

### 💬 Chat
- Live messaging
- File sharing
- Message delivery & read receipts
- Timestamps
- User identification

### 📸 Memories
- Capture and save special moments
- Share snapshots with the room
- View saved memories anytime

### 📞 Calls
- Video calls with multiple participants
- Audio-only calls
- Toggle camera and microphone
- Real-time peer-to-peer connections

### 📱 PWA Support
- Install as app on mobile/desktop
- Works offline (basic functionality)
- App-like experience
- Custom app icon

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shared-space-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

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

4. **Run the application**

   **Terminal 1 - Start Backend:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📦 Project Structure

```
shared-space-app/
├── client/                 # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Backend (Node.js + Express + Socket.IO)
│   ├── index.js          # Server entry point
│   ├── logger.js         # Logging utility
│   ├── .env              # Environment variables
│   └── package.json
│
└── render.yaml           # Render.com deployment config
```

## 🌐 Deployment

### Deploy to Render.com (FREE Forever!)

**Quick Start:**
1. Read `READ_ME_FIRST.txt`
2. Follow `RENDER_QUICK_START.txt`
3. Your app will be live in 15 minutes!

**Features:**
- ✅ FREE forever (no credit card needed)
- ✅ No time limits
- ✅ Automatic HTTPS/SSL
- ✅ WebSocket support
- ⚠️ Services sleep after 15 min (wakes in 30-60 sec)

**Detailed guides:**
- `DEPLOY_RENDER_FREE.md` - Complete deployment guide
- `RENDER_VS_RAILWAY.md` - Platform comparison
- `render.yaml` - Automated deployment config

## 📚 Documentation

### User Guides
- `READ_ME_FIRST.txt` - Start here!
- `LOCAL_SETUP_GUIDE.md` - Local development setup
- `HOW_TO_INSTALL_APP.md` - PWA installation guide

### Deployment
- `RENDER_QUICK_START.txt` - Quick deployment guide
- `DEPLOY_RENDER_FREE.md` - Detailed deployment guide
- `FREE_HOSTING_SUMMARY.txt` - Hosting options summary
- `DEPLOYMENT_COMPARISON.txt` - Platform comparison

### Features
- `CALL_FEATURES_GUIDE.md` - Video/audio calls guide
- `CALLS_WORKING_GUIDE.md` - How calls work
- `GROUP_SNAP_FEATURE.md` - Group snapshot feature
- `PWA_INSTALL_GUIDE.md` - PWA installation
- `PWA_ICONS_README.md` - PWA icons setup

### Testing
- `TESTING_GUIDE.md` - Testing checklist
- `QUICK_TEST_GUIDE.md` - Quick testing guide
- `TEST_CHECKLIST.md` - Feature testing checklist

### Technical
- `FILE_STRUCTURE.md` - Project structure
- `PROJECT_DOCUMENTATION.md` - Technical documentation
- `MOBILE_DNS_FIX.md` - Mobile troubleshooting

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **CORS** - Cross-origin resource sharing

### Real-Time Features
- **WebRTC** - Peer-to-peer video/audio
- **Socket.IO** - Real-time messaging
- **Canvas API** - Drawing functionality

## 🎯 How It Works

1. **Create/Join Room**: Users enter a room code to collaborate
2. **Real-Time Sync**: All actions sync instantly via WebSocket
3. **Peer-to-Peer Calls**: Video/audio uses WebRTC for direct connections
4. **Persistent State**: Room state maintained on server
5. **PWA**: Can be installed as standalone app

## 🔧 Development Scripts

### Server
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

### Client
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm start       # Start production server
```

## 🌟 Features in Detail

### Canvas Drawing
- Real-time collaborative drawing
- Multiple users can draw simultaneously
- Smooth drawing experience
- Color picker and brush size control
- Eraser tool
- Clear canvas for all users
- Image upload and sharing

### Chat System
- Instant messaging
- File sharing (images, documents)
- Message delivery confirmations
- Read receipts (per-user tracking)
- Timestamps
- User identification
- System notifications (join/leave)

### Video/Audio Calls
- Multiple participants support
- Toggle camera on/off
- Toggle microphone on/off
- Peer-to-peer connections (WebRTC)
- Automatic connection management
- Call notifications
- Clean, simple interface (like Google Meet)

### Memories
- Capture special moments
- Save snapshots to room
- View all saved memories
- Delete memories
- Share with all room members

## 🔒 Security

- HTTPS/SSL encryption (in production)
- CORS protection
- Input validation
- Secure WebSocket connections
- No data persistence (privacy-focused)

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🆘 Support

- Check documentation files for detailed guides
- Review troubleshooting guides for common issues
- Check browser console for error messages

## 🎉 Enjoy Your Shared Space!

Create rooms, invite friends, and collaborate in real-time!

---

**Made with ❤️ for seamless collaboration**
