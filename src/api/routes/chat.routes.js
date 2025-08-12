"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const chatRoutes = express_1.default.Router();
// POST /chats/mark-read
chatRoutes.post("/message/mark-read", chat_controller_1.markMessagesAsReadController);
// GET /chats/recent/:userId
chatRoutes.get("/recent/:userId", chat_controller_1.getRecentChatsController);
exports.default = chatRoutes;
