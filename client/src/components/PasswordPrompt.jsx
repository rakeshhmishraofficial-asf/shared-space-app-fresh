import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PasswordPrompt({ onCorrectPassword }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const CORRECT_PASSWORD = 'bokaro8294'

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('app_authenticated', 'true')
      localStorage.setItem('auth_time', Date.now().toString())
      onCorrectPassword()
      toast.success('Access granted!')
    } else {
      setAttempts(prev => prev + 1)
      setPassword('')
      toast.error('Incorrect password!')
      
      if (attempts >= 2) {
        toast.error('Too many failed attempts. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="glass rounded-3xl p-12 max-w-md w-full">
        {/* Lock Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Shared Space
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Enter password to access
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-all"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-3 rounded-xl font-semibold transition-all"
          >
            Unlock
          </button>
        </form>

        {/* Attempts Warning */}
        {attempts > 0 && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
            <p className="text-sm text-red-400">
              Failed attempts: {attempts}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Secure access required</p>
        </div>
      </div>
    </div>
  )
}
