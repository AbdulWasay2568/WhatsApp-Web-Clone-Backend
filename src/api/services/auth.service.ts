import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prismaClient from "../../prisma/prisma.client";

interface RegisterUserInput {
    username: string;
    email: string;
    password: string;
}

interface LoginUserInput {
    email: string;
    password: string;
}

export const registerUser = async (input: RegisterUserInput) => {
    const { email, password, username } = input;

    // 1️⃣ Check if the email is already registered
    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Email is already in use.");
    }

    // 2️⃣ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create the user with the selected role
    const newUser = await prismaClient.user.create({
        data: {
            email,
            password: hashedPassword,
            username
        },
    });

    // 4️⃣ Generate a JWT token
    const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    return { token, message: "User registered successfully." };
};

export const loginUser = async (input: LoginUserInput) => {
    const { email, password } = input;

    // 1️⃣ Find the user by email
    const user = await prismaClient.user.findUnique({ where: { email } });

    // 2️⃣ Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password.");
    }

    // 3️⃣ Generate a JWT token
    const token = jwt.sign(
        { id: user.id},
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    return { token, message: "User registered successfully."  };
};
