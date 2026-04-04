import { io } from 'socket.io-client';
import { getSocketBaseUrl } from './utils/socketBaseUrl';

let socket;

export function getAdminSocket() {
  if (!socket) {
    const url = getSocketBaseUrl();
    if (!url) return null;
    socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      reconnectionDelay: 2000
    });
  }
  return socket;
}
