export interface CreateMessageDto {
  content: string;
  senderId: number;
  receiverId: number;
  fileUrl?: string;
  imageUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface UpdateMessageDto {
  content?: string;
  fileUrl?: string;
  imageUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
}
