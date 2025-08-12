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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = __importDefault(require("../../prisma/prisma.client"));
const registerUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = input;
    // 1️⃣ Check if the email is already registered
    const existingUser = yield prisma_client_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Email is already in use.");
    }
    // 2️⃣ Hash the password before saving
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // 3️⃣ Create the user with the selected role
    const newUser = yield prisma_client_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            username
        },
    });
    // 4️⃣ Generate a JWT token
    const token = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token, message: "User registered successfully." };
});
exports.registerUser = registerUser;
const loginUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    // 1️⃣ Find the user by email
    const user = yield prisma_client_1.default.user.findUnique({ where: { email } });
    // 2️⃣ Check if user exists and password is correct
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        throw new Error("Invalid email or password.");
    }
    // 3️⃣ Generate a JWT token
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token, message: "User registered successfully." };
});
exports.loginUser = loginUser;
