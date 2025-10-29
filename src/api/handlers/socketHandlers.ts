import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface PrivateMessagePayload {
  to: number;
  content: string;
  fileUrl?: string;
  imageUrl?: string;
}

// ✅ Track connected users in memory
const onlineUsers = new Set<string>();

export const socketAuthMiddleware = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id?: number | string };
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token payload'));
      }

      socket.data.userId = decoded.id.toString();
      next();
    } catch (err) {
      return next(new Error('Authentication error: Token verification failed'));
    }
  });
};

export const handleSocketConnection = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;

    socket.join(userId); // join their own room
    onlineUsers.add(userId); // track online user

    console.log(`✅ User ${userId} connected and joined room ${userId}`);

    // ✅ Notify other users that this one is online
    socket.broadcast.emit('online', userId);

    // ✅ Send current online users to this socket
    socket.emit('online-users', Array.from(onlineUsers));

    // 📨 Private messaging
    socket.on('private:message', async (data: PrivateMessagePayload) => {
      const { to, content, fileUrl, imageUrl } = data;

      if (!to || (!content && !fileUrl && !imageUrl)) {
        socket.emit('error', 'Invalid message data');
        return;
      }

      try {
        const msg = await prisma.message.create({
          data: {
            senderId: Number(userId),
            receiverId: to,
            content: content || "",         // fallback to empty string
            fileUrl: fileUrl || null,
            imageUrl: imageUrl || null,
          },
        });

        const messagePayload = {
          from: Number(userId),
          to,
          content: msg.content,
          timestamp: msg.createdAt,
          status: msg.read ? 'read' : 'sent',
          fileUrl: msg.fileUrl,
          imageUrl: msg.imageUrl,
        };

        io.to(to.toString()).emit('private:message', messagePayload);
      } catch (error) {
        console.error('❌ Error sending private message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

        // 💬 Reply message handler
    socket.on('private:reply', async (data) => {
      const { originalMessageId, content, fileUrl, imageUrl, status } = data;

      if (!originalMessageId || !content) {
        socket.emit('error', 'Invalid reply data');
        return;
      }

      try {
        const reply = await prisma.reply.create({
          data: {
            originalMessageId,
            senderId: Number(userId),
            content,
            fileUrl,
            imageUrl,
            status,
          },
          include: {
            sender: { select: { id: true, username: true } },
            originalMessage: true,
          },
        });

        const receiverId =
          reply.originalMessage.receiverId === Number(userId)
            ? reply.originalMessage.senderId
            : reply.originalMessage.receiverId;

        // ✅ Emit to both users
        io.to(userId).emit('newReply', reply);
        io.to(receiverId.toString()).emit('newReply', reply);
      } catch (err) {
        console.error('❌ Reply socket error:', err);
        socket.emit('error', 'Failed to send reply');
      }
    });


    // 🟡 Typing indicators
    socket.on('typing:start', (receiverId: number) => {
      socket.to(receiverId.toString()).emit('typing:start', Number(userId));
    });

    socket.on('typing:stop', (receiverId: number) => {
      socket.to(receiverId.toString()).emit('typing:stop', Number(userId));
    });

    socket.on("call:request", ({ from, to, type, offer }) => {
      console.log(`📞 Call request from ${from} to ${to}`);
      io.to(to.toString()).emit("call:incoming", { from, type, offer });
    });

    socket.on("call:answer", ({ to, answer }) => {
      console.log(`✅ Call answer from ${to}`);
      io.to(to.toString()).emit("call:answer", { answer });
    });

    socket.on("call:ice-candidate", ({ to, candidate }) => {
      io.to(to.toString()).emit("call:ice-candidate", { candidate });
    });

    socket.on("call:end", ({ to }) => {
      console.log(`🔚 Call ended to ${to}`);
      io.to(to.toString()).emit("call:ended");
    });


    // ❌ Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected.`);
      onlineUsers.delete(userId);
      socket.broadcast.emit('offline', userId);
    });
  });
};
