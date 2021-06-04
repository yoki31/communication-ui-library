// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus } from 'acs-ui-common';
import { CommunicationParticipant } from './CommunicationParticipant';

export type MessageAttachedStatus = 'bottom' | 'top';

export type MessageContentType =
  | 'text'
  | 'html'
  | 'richtext/html'
  | 'topicupdated'
  | 'participantadded'
  | 'participantremoved'
  | 'unknown';

export type ChatMessagePayload = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
  type: MessageContentType;
};

export type SystemMessagePayload = {
  messageId: string;
  type: MessageContentType;
  content?: CommunicationParticipant[] | string;
  iconName?: string;
  createdOn?: Date;
  senderId?: string;
};

export type CustomMessagePayload = {
  messageId: string;
  content?: string;
  createdOn?: Date;
  senderId?: string;
};

export type MessageTypes = 'chat' | 'system' | 'custom';

export type Message<T extends MessageTypes> = {
  type: T;
  payload: T extends 'chat' ? ChatMessagePayload : T extends 'system' ? SystemMessagePayload : CustomMessagePayload;
};

export type ChatMessage = Message<'chat'>;
export type SystemMessage = Message<'system'>;
export type CustomMessage = Message<'custom'>;
