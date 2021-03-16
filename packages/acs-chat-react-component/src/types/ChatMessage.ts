// © Microsoft Corporation. All rights reserved.

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';

export type ChatMessage = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status: MessageStatus;
};
