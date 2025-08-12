import { Request, Response } from "express";
import {
  fetchUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
} from "../services/user.service";
import { CreateUserDto, UpdateUserDto } from "../interfaces/user.interface";

export const fetchUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserDto = req.body;
    const newUser = await createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const readUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await readUser(Number(id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userData: UpdateUserDto = req.body;
    const updatedUser = await updateUser(Number(id), userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteUser(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
