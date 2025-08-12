"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesAsRead = exports.getRecentChats = void 0;
const prisma_client_1 = __importDefault(require("../../prisma/prisma.client"));
const getRecentChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_client_1.default.message.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ],
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            sender: true,
            receiver: true,
        },
    });
    const uniqueConversations = new Map();
    for (const msg of messages) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        if (!uniqueConversations.has(otherUser.id)) {
            // Count unread messages from the other user to the current user
            const unreadCount = yield prisma_client_1.default.message.count({
                where: {
                    senderId: otherUser.id,
                    receiverId: userId,
                    read: false,
                },
            });
            uniqueConversations.set(otherUser.id, {
                userId: otherUser.id,
                name: otherUser.username,
                lastMessage: msg.content,
                time: msg.createdAt,
                unreadCount,
            });
        }
    }
    return Array.from(uniqueConversations.values());
});
exports.getRecentChats = getRecentChats;
const markMessagesAsRead = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.updateMany({
        where: {
            senderId,
            receiverId,
            read: false,
        },
        data: {
            read: true,
        },
    });
});
exports.markMessagesAsRead = markMessagesAsRead;
