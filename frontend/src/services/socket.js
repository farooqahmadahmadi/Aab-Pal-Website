import { io } from "socket.io-client";

let socket = null;

/**
 * Create or return existing socket connection
 * (Singleton Pattern - ONLY ONE connection in whole app)
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    console.log("🟢 Socket connected:", socket.id);
  }

  return socket;
};

/**
 * Disconnect socket safely (optional use on logout)
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔴 Socket disconnected");
  }
};

export default getSocket;
