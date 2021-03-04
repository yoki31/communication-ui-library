// © Microsoft Corporation. All rights reserved.
import React, { useEffect, useState } from 'react';
import { ChatThreadComponent } from '../components/ChatThread';
import { chatThreadSelector } from '@azure/acs-chat-declarative';
import { useChatClient } from './ChatClientProvider';

export const ChatThreadContainer = ({ threadId, userId }: { threadId: string; userId: string }): JSX.Element | null => {
  const chatClient = useChatClient(); // Could be context or any other global state sharing

  // These part could be abstract as a shared reusable code
  const [props, setProps] = useState(chatThreadSelector(chatClient.state, { threadId, userId }));
  useEffect(() => {
    chatClient.onStateChange(() => setProps(chatThreadSelector(chatClient.state, { threadId, userId })));
  }, [chatClient, threadId, userId]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <ChatThreadComponent {...props} disableReadReceipt={false} sendReadReceipt={async () => {}} />;
};
