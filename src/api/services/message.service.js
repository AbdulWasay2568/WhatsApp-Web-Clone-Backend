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
exports.readMessagesBetweenUsers = exports.deleteMessage = exports.updateMessage = exports.readMessage = exports.createMessage = exports.fetchMessages = void 0;
const prisma_client_1 = __importDefault(require("../../prisma/prisma.client"));
const fetchMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.findMany({});
});
exports.fetchMessages = fetchMessages;
const createMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.create({
        data: messageData
    });
});
exports.createMessage = createMessage;
const readMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.findUnique({
        where: { id }
    });
});
exports.readMessage = readMessage;
const updateMessage = (id, messageData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.update({
        where: { id },
        data: messageData
    });
});
exports.updateMessage = updateMessage;
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_client_1.default.message.delete({
        where: { id }
    });
});
exports.deleteMessage = deleteMessage;
// read all message of a sender and receiver
const readMessagesBetweenUsers = (userId1, userId2) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.message.findMany({
        where: {
            OR: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
});
exports.readMessagesBetweenUsers = readMessagesBetweenUsers;
