import prismaClient from "../../prisma/prisma.client";

export const getRecentChats = async (userId: number) => {
  const messages = await prismaClient.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  const uniqueConversations = new Map<number, any>();

  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

    if (!uniqueConversations.has(otherUser.id)) {
      // Count unread messages from the other user to the current user
      const unreadCount = await prismaClient.message.count({
        where: {
          senderId: otherUser.id,
          receiverId: userId,
          read: false,
        },
      });

      uniqueConversations.set(otherUser.id, {
        userId: otherUser.id,
        name: otherUser.username,
        lastMessage: msg.content,
        time: msg.createdAt,
        unreadCount,
      });
    }
  }

  return Array.from(uniqueConversations.values());
};


export const markMessagesAsRead = async (senderId: number, receiverId: number) => {
  return await prismaClient.message.updateMany({
    where: {
      senderId,
      receiverId,
      read: false,
    },
    data: {
      read: true,
    },
  });
};
