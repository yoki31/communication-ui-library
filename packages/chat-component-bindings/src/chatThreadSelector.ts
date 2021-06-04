// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  getChatMessages,
  getIsLargeGroup,
  getLatestReadTime,
  getUserId,
  sanitizedMessageContentType
} from './baseSelectors';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { ChatMessageWithStatus } from 'chat-stateful-client';
// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatMessageContent, ChatParticipant } from '@azure/communication-chat';
// @ts-ignore
import { ChatClientState } from 'chat-stateful-client';
// @ts-ignore
import { ChatBaseSelectorProps } from './baseSelectors';
// @ts-ignore
import { memoizeFnAll } from 'acs-ui-common';
// @ts-ignore
import {
  ChatMessage,
  MessageAttachedStatus,
  Message,
  MessageTypes,
  SystemMessage,
  CommunicationParticipant
} from 'react-components';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import { compareMessages } from './utils/compareMessages';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    message: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean
  ): ChatMessage | SystemMessage => {
    const messageType = sanitizedMessageContentType(message.type);

    if (messageType === 'text' || messageType === 'html' || messageType === 'richtext/html') {
      return {
        type: 'chat',
        payload: {
          createdOn: message.createdOn,
          content: message.content?.message,
          type: messageType,
          status: !isLargeGroup && message.status === 'delivered' && isSeen ? 'seen' : message.status,
          senderDisplayName: message.senderDisplayName,
          senderId: message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId,
          messageId: message.id,
          clientMessageId: message.clientMessageId
        }
      };
    } else if (messageType === 'topicupdated') {
      return {
        type: 'system',
        payload: {
          messageId: message.id,
          content: message.content?.topic,
          type: messageType,
          createdOn: message.createdOn,
          senderId: message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : undefined,
          iconName: 'Edit'
        }
      };
    } else if (messageType === 'participantadded' || messageType === 'participantremoved') {
      const communicationParticipants = message.content?.participants?.map((participant: ChatParticipant) => {
        return {
          userId: toFlatCommunicationIdentifier(participant.id),
          displayName: participant.displayName
        };
      });

      return {
        type: 'system',
        payload: {
          messageId: message.id,
          content: communicationParticipants ?? [],
          type: messageType,
          createdOn: message.createdOn,
          senderId: message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : undefined,
          iconName: messageType === 'participantadded' ? 'PeopleAdd' : 'PeopleBlock'
        }
      };
    } else {
      // If we encounter unknown messge, we'll create an chat message with unknown type.
      // This will be automatically handled in the MessageThread component.
      return {
        type: 'chat',
        payload: {
          type: 'unknown'
        }
      };
    }
  }
);

export const chatThreadSelector = createSelector(
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup],
  (userId, chatMessages, latestReadTime, isLargeGroup) => {
    // A function takes parameter above and generate return value
    console.log(chatMessages);
    const convertedMessages = memoizedAllConvertChatMessage((memoizedFn) =>
      Array.from(chatMessages.values()).map((message) =>
        memoizedFn(
          message.id ?? message.clientMessageId,
          message,
          userId,
          message.createdOn <= latestReadTime,
          isLargeGroup
        )
      )
    );

    updateMessagesWithAttached(convertedMessages, userId);
    return {
      userId,
      showMessageStatus: !isLargeGroup,
      messages: convertedMessages
    };
  }
);

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: (ChatMessage | SystemMessage)[],
  userId: string
): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    if (message.type === 'chat') {
      let attached: boolean | MessageAttachedStatus = false;

      const previousMessageSenderId = index > 0 ? messages[index - 1].payload.senderId : null;
      const nextMessageSenderId = index === messages.length - 1 ? null : messages[index + 1].payload.senderId;

      if (message.payload.senderId !== previousMessageSenderId) {
        if (message.payload.senderId === nextMessageSenderId) {
          attached = 'top';
        }
      } else {
        attached = message.payload.senderId === nextMessageSenderId ? true : 'bottom';
      }

      message.payload.attached = attached;
      message.payload.mine = message.payload.senderId === userId;
    }
  });
};
