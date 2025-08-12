import { User } from "@prisma/client";
import prismaClient from "../../prisma/prisma.client";
import { CreateUserDto, UpdateUserDto } from "../interfaces/user.interface";

export const fetchUsers = async (): Promise<User[]> => {
  return await prismaClient.user.findMany({});
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  return await prismaClient.user.create({
    data: userData
  });
};

export const readUser = async (id: number): Promise<User | null> => {
  return await prismaClient.user.findUnique({
    where: { id }
  });
};

export const updateUser = async (id: number, userData: UpdateUserDto): Promise<User> => {
  return await prismaClient.user.update({
    where: { id },
    data: userData
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await prismaClient.user.delete({
    where: { id }
  });
};
