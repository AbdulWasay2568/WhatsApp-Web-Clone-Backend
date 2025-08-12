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
exports.deleteCall = exports.updateCall = exports.readCall = exports.createCall = exports.fetchCalls = void 0;
const prisma_client_1 = __importDefault(require("../../prisma/prisma.client"));
const fetchCalls = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.call.findMany({});
});
exports.fetchCalls = fetchCalls;
const createCall = (callData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.call.create({
        data: callData
    });
});
exports.createCall = createCall;
const readCall = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.call.findUnique({
        where: { id }
    });
});
exports.readCall = readCall;
const updateCall = (id, callData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.call.update({
        where: { id },
        data: callData
    });
});
exports.updateCall = updateCall;
const deleteCall = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_client_1.default.call.delete({
        where: { id }
    });
});
exports.deleteCall = deleteCall;
