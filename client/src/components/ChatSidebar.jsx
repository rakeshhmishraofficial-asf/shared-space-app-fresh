import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Paperclip, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'

const getUserColor = (username) => {
  const colors = ['#EF4444', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#14B8A6'];
  let hash = 0;
  for (let i = 0; i < (username || 'User').length; i++) {
    hash = (username || 'User').charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const UserAvatar = ({ username }) => {
  const color = getUserColor(username || 'Anon');
  const initials = username ? username.slice(0, 2).toUpperCase() : '🔥';
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg border-2 border-white/20 flex-shrink-0"
      style={{ backgroundColor: color }}
      title={username}
    >
      {initials}
    </div>
  );
};

export default function ChatSidebar({ socket, roomCode, username, isOpen = true, onClose, onTriggerSoundboard, onOpenGamesModal }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket) return

    const handleMessage = ({ username: sender, message, timestamp, messageId }) => {
      const formattedTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => {
        if (prev.some(m => m.messageId === messageId)) return prev;
        return [...prev, {
          username: sender,
          message,
          timestamp: formattedTime,
          messageId: messageId || Date.now().toString(),
          isOwn: sender === username
        }];
      });
    }

    const handleFileMessage = ({ username: sender, fileData, fileName, fileType, timestamp, messageId }) => {
      const formattedTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => {
        if (prev.some(m => m.messageId === messageId)) return prev;
        return [...prev, {
          username: sender,
          fileData,
          fileName,
          fileType,
          timestamp: formattedTime,
          messageId: messageId || Date.now().toString(),
          isOwn: sender === username,
          isFile: true
        }];
      });
    }

    socket.on('chat-message', handleMessage)
    socket.on('file-message', handleFileMessage)

    return () => {
      socket.off('chat-message', handleMessage)
      socket.off('file-message', handleFileMessage)
    }
  }, [socket, username])

  // Custom Event listener for room broadcasted Dares & Prompts from Games Hub
  useEffect(() => {
    const handleLocalCustomMessage = (e) => {
      if (e.detail) {
        const { username: sender, message, timestamp, messageId } = e.detail;
        setMessages(prev => {
          if (prev.some(m => m.messageId === messageId)) return prev;
          return [...prev, {
            username: sender,
            message,
            timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageId: messageId || Date.now().toString(),
            isOwn: true
          }];
        });
      }
    };

    window.addEventListener('new-room-message', handleLocalCustomMessage);
    return () => window.removeEventListener('new-room-message', handleLocalCustomMessage);
  }, [username]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!inputMessage.trim()) return

    const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const text = inputMessage.trim()

    // Immediately display sender message locally so normal messages ALWAYS show up instantly!
    const newMsgObj = {
      username: username || 'Anonymous',
      message: text,
      timestamp,
      messageId,
      isOwn: true
    };

    setMessages(prev => {
      if (prev.some(m => m.messageId === messageId)) return prev;
      return [...prev, newMsgObj];
    });

    if (socket) {
      socket.emit('chat-message', {
        roomCode,
        username: username || 'Anonymous',
        message: text,
        timestamp,
        messageId
      })
    }

    setInputMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const messageId = 'file_' + Date.now()
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const fileData = event.target.result

      const fileMsgObj = {
        username: username || 'Anonymous',
        fileData,
        fileName: file.name,
        fileType: file.type,
        timestamp,
        messageId,
        isOwn: true,
        isFile: true
      };

      setMessages(prev => {
        if (prev.some(m => m.messageId === messageId)) return prev;
        return [...prev, fileMsgObj];
      });

      if (socket) {
        socket.emit('file-message', {
          roomCode,
          username: username || 'Anonymous',
          fileData,
          fileName: file.name,
          fileType: file.type,
          timestamp,
          messageId
        })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="h-full w-full min-h-[90vh] glass-dark flex flex-col z-50 text-white border-l-2 border-red-500/50 shadow-2xl">
      {/* Expanded Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/30 rounded-2xl border border-red-500/60 shadow-lg">
            <MessageCircle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-lg text-red-400 uppercase tracking-wider">Uncensored Room Chat</h3>
            <p className="text-xs text-gray-400 font-mono">Active Room: {roomCode || 'Lobby'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onOpenGamesModal && (
            <button
              onClick={onOpenGamesModal}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-white border border-pink-400/40 text-xs font-black shadow-lg transition-all"
              title="LDR Couples Games"
            >
              <span>Games 🎲</span>
            </button>
          )}
          {onTriggerSoundboard && (
            <button
              onClick={onTriggerSoundboard}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white border border-purple-400/40 text-xs font-bold transition-all flex items-center gap-1 shadow-lg"
              title="Soundboard"
            >
              <Volume2 className="w-4 h-4" />
              <span>SFX</span>
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Vertically Big Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/70 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-auto p-8 rounded-3xl bg-black/50 border border-white/10 shadow-2xl">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30 text-red-400 animate-bounce" />
            <p className="text-base font-black uppercase text-gray-300">Room Chat Ready</p>
            <p className="text-xs text-gray-400 mt-2">Send Normal Messages, Photos or Wild Erotic Dares!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isDare = msg.message?.includes('WILDEST LDR DARE') || msg.message?.includes('ROLLED WILDEST DICE');
            return (
              <div
                key={msg.messageId || index}
                className={`flex items-start gap-3.5 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
              >
                <UserAvatar username={msg.username} />
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm font-semibold shadow-2xl transition-all ${
                    isDare
                      ? 'bg-gradient-to-r from-purple-950 via-black to-pink-950 border-2 border-pink-500/80 text-pink-200 shadow-[0_0_35px_rgba(236,72,153,0.45)]'
                      : msg.isOwn
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white rounded-tr-none border border-red-400/50'
                      : 'bg-slate-900/95 border border-white/20 text-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs font-black text-red-300 mb-1 flex items-center justify-between gap-3">
                    <span>@{msg.username}</span>
                    {isDare && <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-600 text-white uppercase font-black tracking-wider">🔥 Wild Dare</span>}
                  </p>
                  {msg.isFile ? (
                    <div>
                      {msg.fileType?.startsWith('image/') ? (
                        <img src={msg.fileData} alt={msg.fileName} className="max-w-full rounded-xl my-2 max-h-72 object-cover border border-white/20 shadow-xl" />
                      ) : (
                        <a href={msg.fileData} download={msg.fileName} className="text-cyan-400 underline block my-2 font-bold text-sm">
                          📎 {msg.fileName}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="break-words leading-relaxed">{msg.message}</p>
                  )}
                  <span className="text-[10px] opacity-60 block text-right mt-2 font-mono">{msg.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Expanded Vertically Big Input Section */}
      <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-white/10 bg-black/95">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10 flex-shrink-0"
            title="Attach file or photo"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or dare... (Press Enter)"
            className="flex-1 px-4 py-3.5 bg-black/80 border border-red-500/50 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-semibold shadow-inner"
            maxLength={1000}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 rounded-2xl text-white font-black transition-all shadow-xl flex items-center justify-center gap-1.5 flex-shrink-0 active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase">Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
