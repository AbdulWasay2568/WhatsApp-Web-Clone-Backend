import express from "express";
import { markMessagesAsReadController, getRecentChatsController } from "../controllers/chat.controller";

const chatRoutes = express.Router();

// POST /chats/mark-read
chatRoutes.post("/message/mark-read", markMessagesAsReadController);


// GET /chats/recent/:userId
chatRoutes.get("/recent/:userId", getRecentChatsController);


export default chatRoutes;
