import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create socket instance with auto-reconnect
export const socket: Socket = io(API_URL, {
  autoConnect: false, // We'll connect manually
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Socket event types
export type SocketEvent = 
  | 'order:created'
  | 'order:updated'
  | 'order:deleted'
  | 'shipment:created'
  | 'shipment:updated'
  | 'shipment:deleted'

// Helper to connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Helper to disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
