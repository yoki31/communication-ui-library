// © Microsoft Corporation. All rights reserved.
import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import { sendBoxSelector, chatThreadSelector, createDefaultHandlersForComponent } from '@azure/acs-chat-selector';
import { ChatThreadComponent, SendBoxComponent } from '@azure/acs-chat-react-component';
import React, { useState, useEffect } from 'react';

const threadParentStyle = {
  height: '100%',
  width: '100%',
  marginLeft: '6%',
  marginRight: '6%',
  paddingBottom: '1rem',
  overflow: 'auto'
};

const threadId = '19:3c483f6899a646cc8b6d06e45fbad77f@thread.v2';
const userId = '8:acs:740e917b-1ae0-47aa-bc68-ae95600ba1e3_00000008-9f63-ce14-edbe-a43a0d002ad4';

const checkIfUserPaid = (): boolean => false;

export const App = (props: { chatClient: DeclarativeChatClient; chatThreadClient: ChatThreadClient }): JSX.Element => {
  const { chatClient, chatThreadClient } = props;
  const [state, setState] = useState(chatClient.state);

  useEffect(() => {
    chatClient.onStateChange((_state) => {
      setState(_state);
    });
  }, [chatClient]);

  const chatConfig = { threadId, userId };

  const chatHandlers = createDefaultHandlersForComponent(chatClient, chatThreadClient, ChatThreadComponent);
  const sendHandlers = createDefaultHandlersForComponent(chatClient, chatThreadClient, SendBoxComponent);

  const onSendMessage = async (text: string): Promise<void> => {
    const newText = 'I am an unpaid user: ' + text;
    sendHandlers.onSendMessage(checkIfUserPaid() ? text : newText);
  };

  return (
    <>
      <SendBoxComponent {...sendBoxSelector(state, chatConfig)} {...sendHandlers} onSendMessage={onSendMessage} />
      <div style={threadParentStyle}>
        <ChatThreadComponent {...chatThreadSelector(state, chatConfig)} {...chatHandlers} />
      </div>
    </>
  );
};
