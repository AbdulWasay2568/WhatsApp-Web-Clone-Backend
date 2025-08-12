import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const registerUserController = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).json({ message: "Email, password, and username are required" });
    return;
  }

  try {
    const { token, message } = await registerUser({ email, password, username});
    res.status(201).json({ token, message });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const { token, message } = await loginUser({ email, password });
    res.status(200).json({ token, message }); 
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Invalid email or password" });
  }
};
