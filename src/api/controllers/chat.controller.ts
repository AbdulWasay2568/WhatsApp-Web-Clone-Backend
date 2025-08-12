import { Request, Response } from "express";
import { markMessagesAsRead } from "../services/chat.service";
import { getRecentChats } from "../services/chat.service";

export const getRecentChatsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const recentChats = await getRecentChats(userId);
    res.status(200).json(recentChats);
  } catch (error) {
    console.error("Error getting recent chats:", error);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
};


export const markMessagesAsReadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      res.status(400).json({ error: "senderId and receiverId are required" });
      return;
    }

    const result = await markMessagesAsRead(senderId, receiverId);
    res.status(200).json({ message: "Messages marked as read", updatedCount: result.count });
  } catch (error) {
    console.error("Mark Messages As Read Error:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};
