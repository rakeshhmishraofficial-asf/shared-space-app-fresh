# Product Overview

**Shared Space** is a real-time collaboration platform that combines multiple communication and creative tools in a single shared environment.

## Core Features

- **Collaborative Canvas**: Real-time drawing with multiple users, color selection, brush sizes, eraser tool, and image uploads
- **Live Chat**: Instant messaging with file sharing, delivery/read receipts, and timestamps
- **Video/Audio Calls**: WebRTC-based peer-to-peer calls with camera/microphone controls
- **Memories**: Capture and share snapshots with the room, including group snap functionality
- **Text Boxes**: Collaborative text editing with real-time synchronization
- **PWA Support**: Installable as a standalone app on mobile and desktop

## User Experience

Users create or join rooms using room codes (format: RS16XXXX). Each room maintains its own state including drawings, messages, and memories. The platform emphasizes real-time collaboration with instant synchronization across all connected users.

## Technical Approach

- Client-server architecture with WebSocket-based real-time communication
- Peer-to-peer WebRTC for video/audio calls to reduce server load
- In-memory state management (no database persistence)
- Privacy-focused: room data exists only while users are connected
- Free hosting tier optimized: services sleep after 15 minutes of inactivity
