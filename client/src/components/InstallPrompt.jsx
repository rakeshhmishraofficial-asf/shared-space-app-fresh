import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS or if prompt not available
      alert('To install:\n\n1. Tap the Share button\n2. Tap "Add to Home Screen"\n3. Tap "Add"')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    
    setDeferredPrompt(null)
  }

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-2 text-sm">
          <span className="text-green-400">✓</span>
          <span>App Installed</span>
        </div>
      </div>
    )
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="glass rounded-xl p-4 shadow-2xl border border-purple-500/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Install Shared Space</h3>
              <p className="text-xs text-gray-400">Use like an app!</p>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="p-1 hover:bg-white/10 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Install on your home screen for quick access, just like ChatGPT!
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="flex-1 px-4 py-2 glass hover:bg-white/10 rounded-lg text-sm font-semibold transition-all"
          >
            Not Now
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-sm font-semibold transition-all"
          >
            Install
          </button>
        </div>

        {/* iOS Instructions */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-400">
            <strong>On iPhone:</strong> Tap Share → Add to Home Screen
          </p>
        </div>
      </div>
    </div>
  )
}
