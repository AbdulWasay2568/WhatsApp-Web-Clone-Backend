export interface CreateReplyDto {
  content: string;
  senderId: number;
  originalMessageId: number;
  fileUrl?: string;
  imageUrl?: string;
  status?: "Sent" | "Delivered" | "Read"; // optional if you use default
}

export interface ReplyResponse {
  id: number;
  content: string;
  senderId: number;
  originalMessageId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  read: boolean;
  fileUrl?: string;
  imageUrl?: string;
}
