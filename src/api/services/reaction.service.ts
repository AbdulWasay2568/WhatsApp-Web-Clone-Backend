import { Reaction } from "@prisma/client";
import prismaClient from "../../prisma/prisma.client";
import { CreateReactionDto } from "../interfaces/reaction.interface";

export const fetchReactions = async (): Promise<Reaction[]> => {
  return await prismaClient.reaction.findMany({
    include: { message: true }
  });
};

// ⬇️ UPDATED: include message relation (with senderId)
export const createReaction = async (reactionData: CreateReactionDto) => {
  return await prismaClient.reaction.create({
    data: reactionData,
    include: { message: true }
  });
};

// ⬇️ ADD readReaction (used in delete controller)
export const readReaction = async (id: number) => {
  return await prismaClient.reaction.findUnique({
    where: { id },
    include: { message: true }
  });
};

export const deleteReaction = async (id: number): Promise<void> => {
  await prismaClient.reaction.delete({
    where: { id }
  });
};
