import { io } from 'socket.io-client'
import { SOCKET_URL } from './api'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], autoConnect: true })
  }
  return socket
}

export function closeSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
