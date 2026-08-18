import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file with timestamp
const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Log levels with colors and emojis
const levels = {
  ERROR: { color: colors.red, emoji: '❌', label: 'ERROR' },
  SUCCESS: { color: colors.green, emoji: '✅', label: 'SUCCESS' },
  INFO: { color: colors.blue, emoji: 'ℹ️', label: 'INFO' },
  WARN: { color: colors.yellow, emoji: '⚠️', label: 'WARN' },
  DEBUG: { color: colors.cyan, emoji: '🔍', label: 'DEBUG' },
  SOCKET: { color: colors.magenta, emoji: '🔌', label: 'SOCKET' },
  ROOM: { color: colors.green, emoji: '🏠', label: 'ROOM' },
  CHAT: { color: colors.blue, emoji: '💬', label: 'CHAT' },
  VIDEO: { color: colors.cyan, emoji: '📹', label: 'VIDEO' },
  AUDIO: { color: colors.magenta, emoji: '🎤', label: 'AUDIO' },
};

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function log(level, category, message, data = null) {
  const timestamp = getTimestamp();
  const levelInfo = levels[level] || levels.INFO;
  const categoryInfo = levels[category] || levels.INFO;
  
  // Format for terminal (with colors)
  const terminalLog = `${levelInfo.color}[${timestamp}] [${categoryInfo.emoji} ${category}] ${levelInfo.emoji} ${message}${colors.reset}`;
  
  // Format for file (without colors)
  const fileLog = `[${timestamp}] [${category}] [${level}] ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}`;
  
  // Print to terminal
  console.log(terminalLog);
  if (data) {
    console.log(`${levelInfo.color}   └─ Data:${colors.reset}`, data);
  }
  
  // Write to file
  fs.appendFileSync(logFile, fileLog + '\n');
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
};

export default logger;
