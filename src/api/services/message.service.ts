import { Message } from "@prisma/client";
import prismaClient from "../../prisma/prisma.client";
import { CreateMessageDto, UpdateMessageDto } from "../interfaces/message.interface";

export const fetchMessages = async (): Promise<Message[]> => {
  return await prismaClient.message.findMany({});
};

export const createMessage = async (messageData: CreateMessageDto): Promise<Message> => {
  return await prismaClient.message.create({
    data: messageData
  });
};

export const readMessage = async (id: number): Promise<Message | null> => {
  return await prismaClient.message.findUnique({
    where: { id }
  });
};

export const updateMessage = async (id: number, messageData: UpdateMessageDto): Promise<Message> => {
  return await prismaClient.message.update({
    where: { id },
    data: messageData
  });
};

export const deleteMessage = async (id: number): Promise<void> => {
  await prismaClient.message.delete({
    where: { id }
  });
};

// read all message of a sender and receiver

export const readMessagesBetweenUsers = async (
  userId1: number,
  userId2: number
): Promise<Message[]> => {
  return await prismaClient.message.findMany({
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
};
