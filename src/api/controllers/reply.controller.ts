import { Request, Response } from "express";
import {
  createReply,
  getRepliesByMessageId,
  getReplyById,
  deleteReply,
} from "../services/reply.service";
import { CreateReplyDto } from "../interfaces/reply.interface";
import { io } from "../../socket"; // Your Socket.IO server instance

// 🆕 Create Reply Controller
export const createReplyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, originalMessageId, fileUrl, imageUrl, status } = req.body;
    const senderId = (req as any).user.id;

    const data: CreateReplyDto = {
      content,
      originalMessageId,
      senderId,
      fileUrl,
      imageUrl,
      status,
    };

    const newReply = await createReply(data);

    const receiverId = newReply.originalMessage?.receiverId === senderId
      ? newReply.originalMessage.senderId
      : newReply.originalMessage.receiverId;

    // 🔁 Emit to both users
    io.to(senderId.toString()).emit("newReply", newReply);
    io.to(receiverId.toString()).emit("newReply", newReply);

    res.status(201).json(newReply);
  } catch (error) {
    console.error("Create Reply Error:", error);
    res.status(500).json({ error: "Failed to create reply" });
  }
};

// 📥 Get Replies for a Message
export const getRepliesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = Number(req.params.messageId);
    const replies = await getRepliesByMessageId(messageId);
    res.status(200).json(replies);
  } catch (error) {
    console.error("Get Replies Error:", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
};

// 🔍 Get a Single Reply
export const getReplyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const replyId = Number(req.params.id);
    const reply = await getReplyById(replyId);

    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    res.status(200).json(reply);
  } catch (error) {
    console.error("Get Reply Error:", error);
    res.status(500).json({ error: "Failed to fetch reply" });
  }
};

// ❌ Delete a Reply
export const deleteReplyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const replyId = Number(req.params.id);
    const reply = await getReplyById(replyId);

    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    await deleteReply(replyId);

    const senderId = reply.sender.id;
    const receiverId = reply.originalMessage?.receiverId === senderId
      ? reply.originalMessage.senderId
      : reply.originalMessage.receiverId;

    io.to(senderId.toString()).emit("deletedReply", { id: replyId });
    io.to(receiverId.toString()).emit("deletedReply", { id: replyId });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Reply Error:", error);
    res.status(500).json({ error: "Failed to delete reply" });
  }
};
