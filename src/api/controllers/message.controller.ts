import { Request, Response } from "express";
import {
  fetchMessages,
  createMessage,
  readMessage,
  updateMessage,
  deleteMessage,
  readMessagesBetweenUsers,
} from "../services/message.service";
import { CreateMessageDto, UpdateMessageDto } from "../interfaces/message.interface";
import { io } from "../../socket"; // Socket.IO server instance

export const fetchMessagesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await fetchMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const createMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageData: CreateMessageDto = req.body;
    const newMessage = await createMessage(messageData);

    // 🔁 Emit to sender and receiver rooms for live sync
    io.to(newMessage.receiverId.toString()).emit("newMessage", newMessage);
    io.to(newMessage.senderId.toString()).emit("newMessageSent", newMessage); // Optional

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Create Message Error:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const readMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await readMessage(Number(id));
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.error("Read Message Error:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
};

// read all messages between a sender and receiver
export const getMessagesBetweenUsers = async (req: Request, res: Response) => {
  const userId1 = parseInt(req.params.userId1);
  const userId2 = parseInt(req.params.userId2);

  try {
    const messages = await readMessagesBetweenUsers(userId1, userId2);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const updateMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const messageData: UpdateMessageDto = req.body;
    const updatedMessage = await updateMessage(Number(id), messageData);

    // 🔁 Emit to both users
    io.to(updatedMessage.receiverId.toString()).emit("updatedMessage", updatedMessage);
    io.to(updatedMessage.senderId.toString()).emit("updatedMessage", updatedMessage);

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Update Message Error:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
};

export const deleteMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await readMessage(Number(id)); // Fetch before delete

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    await deleteMessage(Number(id));

    // 🔁 Notify both users
    io.to(message.receiverId.toString()).emit("deletedMessage", { id: message.id });
    io.to(message.senderId.toString()).emit("deletedMessage", { id: message.id });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
