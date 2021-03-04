// © Microsoft Corporation. All rights reserved.
import { ChatMessage } from '@azure/communication-chat';

export enum MessageStatus {
  DELIVERED = 'delivered',
  SENDING = 'sending',
  SEEN = 'seen',
  FAILED = 'failed'
}

export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
};
