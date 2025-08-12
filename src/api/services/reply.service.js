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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReply = exports.getReplyById = exports.getRepliesByMessageId = exports.createReply = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a reply
const createReply = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.reply.create({
        data,
        include: {
            sender: { select: { id: true, username: true } },
            originalMessage: true,
        },
    });
});
exports.createReply = createReply;
// Fetch replies for a specific message
const getRepliesByMessageId = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.reply.findMany({
        where: { originalMessageId: messageId },
        include: {
            sender: { select: { id: true, username: true } },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
});
exports.getRepliesByMessageId = getRepliesByMessageId;
// Fetch a single reply (optional)
const getReplyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.reply.findUnique({
        where: { id },
        include: {
            sender: { select: { id: true, username: true } },
            originalMessage: true,
        },
    });
});
exports.getReplyById = getReplyById;
// Delete a reply
const deleteReply = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.reply.delete({
        where: { id },
    });
});
exports.deleteReply = deleteReply;
