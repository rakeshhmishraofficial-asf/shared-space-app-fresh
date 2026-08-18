// WebRTC utility for peer-to-peer connections
import logger from './logger'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ]
}

export class WebRTCPeer {
  constructor(socket, roomCode, localStream, remoteUserId, onRemoteStream) {
    this.socket = socket
    this.roomCode = roomCode
    this.localStream = localStream
    this.remoteUserId = remoteUserId
    this.onRemoteStream = onRemoteStream
    this.peerConnection = null
    this.isInitiator = false
    this.offerHandler = null
    this.answerHandler = null
    this.candidateHandler = null
    
    this.setupPeerConnection()
    this.setupSocketListeners()
  }

  setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS)
    logger.webrtc('Peer connection created', { remoteUserId: this.remoteUserId })

    // Add local stream tracks
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream)
      logger.webrtc('Added local track', { kind: track.kind, enabled: track.enabled })
    })

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      logger.webrtc('Received remote track', { 
        kind: event.track.kind, 
        streamId: event.streams[0]?.id 
      })
      if (event.streams && event.streams[0]) {
        this.onRemoteStream(this.remoteUserId, event.streams[0])
      }
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        logger.webrtc('Sending ICE candidate', { 
          remoteUserId: this.remoteUserId,
          candidateType: event.candidate.type 
        })
        this.socket.emit('ice-candidate', {
          roomCode: this.roomCode,
          candidate: event.candidate,
          targetUserId: this.remoteUserId
        })
      }
    }

    // Handle connection state
    this.peerConnection.onconnectionstatechange = () => {
      logger.webrtc('Connection state changed', { 
        state: this.peerConnection.connectionState, 
        remoteUserId: this.remoteUserId 
      })
      if (this.peerConnection.connectionState === 'connected') {
        logger.success('WEBRTC', 'Peer connection established', { remoteUserId: this.remoteUserId })
      } else if (this.peerConnection.connectionState === 'failed') {
        logger.error('WEBRTC', 'Peer connection failed', { remoteUserId: this.remoteUserId })
      }
    }

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      logger.webrtc('ICE connection state changed', { 
        state: this.peerConnection.iceConnectionState, 
        remoteUserId: this.remoteUserId 
      })
    }
  }

  setupSocketListeners() {
    // Create handler functions that we can remove later
    this.offerHandler = async ({ offer, fromUserId }) => {
      logger.webrtc('Received offer', { fromUserId, forUser: this.remoteUserId })
      if (fromUserId === this.remoteUserId) {
        try {
          logger.webrtc('Processing offer', { fromUserId })
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await this.peerConnection.createAnswer()
          await this.peerConnection.setLocalDescription(answer)
          
          logger.webrtc('Sending answer', { toUserId: fromUserId })
          this.socket.emit('webrtc-answer', {
            roomCode: this.roomCode,
            answer: answer,
            targetUserId: fromUserId
          })
          logger.success('WEBRTC', 'Answer sent', { toUserId: fromUserId })
        } catch (error) {
          logger.error('WEBRTC', 'Error processing offer', { error: error.message })
        }
      }
    }

    this.answerHandler = async ({ answer, fromUserId }) => {
      logger.webrtc('Received answer', { fromUserId, forUser: this.remoteUserId })
      if (fromUserId === this.remoteUserId) {
        try {
          logger.webrtc('Processing answer', { fromUserId })
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
          logger.success('WEBRTC', 'Remote description set', { fromUserId })
        } catch (error) {
          logger.error('WEBRTC', 'Error processing answer', { error: error.message })
        }
      }
    }

    this.candidateHandler = async ({ candidate, fromUserId }) => {
      logger.webrtc('Received ICE candidate', { fromUserId, forUser: this.remoteUserId })
      if (fromUserId === this.remoteUserId) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
          logger.success('WEBRTC', 'ICE candidate added', { fromUserId })
        } catch (error) {
          logger.error('WEBRTC', 'Error adding ICE candidate', { error: error.message })
        }
      }
    }

    // Listen for WebRTC signaling
    this.socket.on('webrtc-offer', this.offerHandler)
    this.socket.on('webrtc-answer', this.answerHandler)
    this.socket.on('ice-candidate', this.candidateHandler)
  }

  async createOffer() {
    this.isInitiator = true
    try {
      logger.webrtc('Creating offer', { remoteUserId: this.remoteUserId })
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
      await this.peerConnection.setLocalDescription(offer)
      
      logger.webrtc('Sending offer', { toUserId: this.remoteUserId })
      this.socket.emit('webrtc-offer', {
        roomCode: this.roomCode,
        offer: offer,
        targetUserId: this.remoteUserId
      })
    } catch (error) {
      logger.error('WEBRTC', 'Error creating offer', { error: error.message })
    }
  }

  close() {
    logger.webrtc('Closing peer connection', { remoteUserId: this.remoteUserId })
    
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    
    // Remove socket listeners using the stored handlers
    if (this.offerHandler) {
      this.socket.off('webrtc-offer', this.offerHandler)
    }
    if (this.answerHandler) {
      this.socket.off('webrtc-answer', this.answerHandler)
    }
    if (this.candidateHandler) {
      this.socket.off('ice-candidate', this.candidateHandler)
    }
  }
}

export default WebRTCPeer
