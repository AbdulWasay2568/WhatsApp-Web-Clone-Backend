import { Request, Response } from "express";
import { fetchReactions, createReaction, deleteReaction, readReaction } from "../services/reaction.service";
import { CreateReactionDto } from "../interfaces/reaction.interface";
import { io } from "../../socket";

export const fetchReactionsController = async (req: Request, res: Response) => {
  try {
    const reactions = await fetchReactions();
    res.status(200).json(reactions);
  } catch (error) {
    console.error("Fetch Reactions Error:", error);
    res.status(500).json({ error: "Failed to fetch reactions" });
  }
};

export const createReactionController = async (req: Request, res: Response) => {
  try {
    const reactionData: CreateReactionDto = req.body;
    const newReaction = await createReaction(reactionData);

    // Notify the message sender and the user who reacted
    io.to(newReaction.message.senderId.toString()).emit("reaction:new", newReaction);
    io.to(newReaction.userId.toString()).emit("reaction:sent", newReaction); // optional

    res.status(201).json(newReaction);
  } catch (error) {
    console.error("Create Reaction Error:", error);
    res.status(500).json({ error: "Failed to create reaction" });
  }
};

export const deleteReactionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const reaction = await readReaction(Number(id));
    if (!reaction) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    await deleteReaction(Number(id));

    // Notify involved users
    io.to(reaction.message.senderId.toString()).emit("reaction:deleted", { id: reaction.id });
    io.to(reaction.userId.toString()).emit("reaction:deleted", { id: reaction.id });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Reaction Error:", error);
    res.status(500).json({ error: "Failed to delete reaction" });
  }
};
