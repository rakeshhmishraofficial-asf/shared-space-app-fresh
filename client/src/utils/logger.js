// Frontend logger utility with color-coded console output

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log levels with colors and emojis
const levels = {
  ERROR: { color: 'color: #ff4444; font-weight: bold;', emoji: '❌', label: 'ERROR' },
  SUCCESS: { color: 'color: #44ff44; font-weight: bold;', emoji: '✅', label: 'SUCCESS' },
  INFO: { color: 'color: #4444ff; font-weight: bold;', emoji: 'ℹ️', label: 'INFO' },
  WARN: { color: 'color: #ffaa00; font-weight: bold;', emoji: '⚠️', label: 'WARN' },
  DEBUG: { color: 'color: #00aaff; font-weight: bold;', emoji: '🔍', label: 'DEBUG' },
  SOCKET: { color: 'color: #ff44ff; font-weight: bold;', emoji: '🔌', label: 'SOCKET' },
  ROOM: { color: 'color: #44ff44; font-weight: bold;', emoji: '🏠', label: 'ROOM' },
  CHAT: { color: 'color: #4488ff; font-weight: bold;', emoji: '💬', label: 'CHAT' },
  VIDEO: { color: 'color: #00ddff; font-weight: bold;', emoji: '📹', label: 'VIDEO' },
  AUDIO: { color: 'color: #ff44ff; font-weight: bold;', emoji: '🎤', label: 'AUDIO' },
  WEBRTC: { color: 'color: #ff8800; font-weight: bold;', emoji: '📡', label: 'WEBRTC' },
};

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function log(level, category, message, data = null) {
  const timestamp = getTimestamp();
  const levelInfo = levels[level] || levels.INFO;
  const categoryInfo = levels[category] || levels.INFO;
  
  // Format for console with colors
  console.log(
    `%c[${timestamp}] [${categoryInfo.emoji} ${category}] ${levelInfo.emoji} ${message}`,
    levelInfo.color
  );
  
  if (data) {
    console.log('%c   └─ Data:', 'color: #888;', data);
  }
}

// Export logging functions
export const logger = {
  error: (category, message, data) => log('ERROR', category, message, data),
  success: (category, message, data) => log('SUCCESS', category, message, data),
  info: (category, message, data) => log('INFO', category, message, data),
  warn: (category, message, data) => log('WARN', category, message, data),
  debug: (category, message, data) => log('DEBUG', category, message, data),
  socket: (message, data) => log('INFO', 'SOCKET', message, data),
  room: (message, data) => log('INFO', 'ROOM', message, data),
  chat: (message, data) => log('INFO', 'CHAT', message, data),
  video: (message, data) => log('INFO', 'VIDEO', message, data),
  audio: (message, data) => log('INFO', 'AUDIO', message, data),
  webrtc: (message, data) => log('INFO', 'WEBRTC', message, data),
};

export default logger;
