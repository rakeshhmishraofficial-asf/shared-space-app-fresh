import { Phone, Video, X, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CallNotification({ 
  isVisible, 
  callerName, 
  callType, // 'video' or 'audio'
  onAccept, 
  onReject 
}) {
  const [ringing, setRinging] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setRinging(true)
      // Play ringtone (optional)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRQLRp/g8r5sIQUrgs/y2Ik2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5sIQUrgs/y2Yk2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5sIQUrgs/y2Yk2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5sIQUrgs/y2Yk2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5sIQUrgs/y2Yk2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5sIQUrgs/y2Yk2CBhkuezooVARDEyl4fCyZx4FNo3V8859LwUofszw3JE7ChNctOvqp1UVC0af4PK+bCEFK4LP8tmJNggYZLns6KFQEQxMpeHwsmceBTaN1fPOfS8FKH7M8NyROwsTXLTr6qdVFQtGn+DyvmwhBSuCz/LZiTYIGGS57OihUBEMTKXh8LJnHgU2jdXzzn0vBSh+zPDckTsKE1y06+qnVRULRp/g8r5s=')
      audio.loop = true
      audio.play().catch(() => {})
      
      return () => {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center animate-fade-in">
      <div className="glass rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-bounce-in">
        {/* Caller Icon */}
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          ringing ? 'animate-pulse' : ''
        } ${callType === 'video' ? 'bg-gradient-to-br from-green-500 to-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
          {callType === 'video' ? (
            <Video className="w-12 h-12" />
          ) : (
            <Phone className="w-12 h-12" />
          )}
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-bold mb-2">{callerName}</h2>
        <p className="text-gray-400 mb-8">
          Incoming {callType === 'video' ? 'Video' : 'Audio'} Call...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center shadow-lg"
            title="Reject"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center shadow-lg animate-pulse"
            title="Accept"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>

        {/* Ringing Text */}
        <p className="text-sm text-gray-500 mt-6 animate-pulse">
          Ringing...
        </p>
      </div>
    </div>
  )
}
