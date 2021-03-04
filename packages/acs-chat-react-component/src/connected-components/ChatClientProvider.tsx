// © Microsoft Corporation. All rights reserved.

import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import React, { createContext, useContext } from 'react';

export const ChatClientContext = createContext<DeclarativeChatClient | undefined>(undefined);
export const ChatThreadClientContext = createContext<ChatThreadClient[]>([]);

type ChatClientProviderProps = {
  chatClient: DeclarativeChatClient;
  chatThreadClients: ChatThreadClient[];
  children: React.ReactNode;
};

type ChatThreadProviderProps = {
  chatThreadClients: ChatThreadClient[];
  children: React.ReactNode;
};

export const ChatClientProvider = (props: ChatClientProviderProps): JSX.Element => {
  return (
    <ChatClientContext.Provider value={props.chatClient}>
      <ChatThreadClientProvider chatThreadClients={props.chatThreadClients}>{props.children}</ChatThreadClientProvider>
    </ChatClientContext.Provider>
  );
};

export const ChatThreadClientProvider = (props: ChatThreadProviderProps): JSX.Element => {
  return (
    <ChatThreadClientContext.Provider value={props.chatThreadClients}>
      {props.children}
    </ChatThreadClientContext.Provider>
  );
};

export const useChatClient = (): DeclarativeChatClient => {
  const chatClient = useContext(ChatClientContext);
  if (!chatClient) {
    throw Error('Please init provider with a DeclarativeChatClient object first');
  }
  return chatClient;
};

export const useChatThreadClient = (threadId: string): ChatThreadClient => {
  const client = useContext(ChatThreadClientContext).find((chatThreadClient) => chatThreadClient.threadId === threadId);
  if (!client) {
    throw Error('Please init provider with a DeclarativeChatThreadClient list first');
  }
  return client;
};
