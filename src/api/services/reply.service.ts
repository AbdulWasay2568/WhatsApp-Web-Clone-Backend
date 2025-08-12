import { PrismaClient, MessageStatus } from "@prisma/client";
import { CreateReplyDto } from "../interfaces/reply.interface";

const prisma = new PrismaClient();

// Create a reply
export const createReply = async (data: CreateReplyDto) => {
  return prisma.reply.create({
    data,
    include: {
      sender: { select: { id: true, username: true } },
      originalMessage: true,
    },
  });
};

// Fetch replies for a specific message
export const getRepliesByMessageId = async (messageId: number) => {
  return prisma.reply.findMany({
    where: { originalMessageId: messageId },
    include: {
      sender: { select: { id: true, username: true } },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

// Fetch a single reply (optional)
export const getReplyById = async (id: number) => {
  return prisma.reply.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, username: true } },
      originalMessage: true,
    },
  });
};

// Delete a reply
export const deleteReply = async (id: number) => {
  return prisma.reply.delete({
    where: { id },
  });
};
