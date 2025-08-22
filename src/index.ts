// index.ts
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { initSocket } from './socket'; // import initSocket function here

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "production" ? [] : ["query", "error", "warn"],
    });
  }
  return prisma;
}

const app: Express = express();
const httpServer = createServer(app);

// Initialize socket.io using httpServer
const io = initSocket(httpServer);

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Parse JSON body
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("WhatsApp backend is running on Vercel");
});

// Simple DB test route (debug only — remove in prod)
app.get("/test-db", (req, res) => {
  res.json({ status: "ok", message: "Route is working" });
});

import { userRouter, authRouter, messageRouter, reactionRouter, replyRouter, callRouter, chatRouter, uploadRouter } from './api/routes/index';

// Register routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter);
app.use('/reaction', reactionRouter);
app.use('/replies', replyRouter);
app.use('/calls', callRouter);
app.use('/chats', chatRouter);
app.use('/upload', uploadRouter);

const PORT = process.env.PORT || 3000;

// For Vercel serverless functions, we need to export the app
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), don't start the server
  console.log('🚀 Server configured for Vercel deployment');
} else {
  // In development, start the server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;