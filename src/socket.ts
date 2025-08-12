// socket.ts
import { Server } from 'socket.io';
import http from 'http';
import { socketAuthMiddleware, handleSocketConnection } from './api/handlers/socketHandlers';

let io: Server;

export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  socketAuthMiddleware(io);
  handleSocketConnection(io);

  return io;
};

export { io };
