// © Microsoft Corporation. All rights reserved.
import React, { useCallback } from 'react';
import { SendBoxComponent } from '../components';
import { useChatThreadClient } from './ChatClientProvider';
import { ChatThreadClient } from '@azure/communication-chat';

const sendMessage = async (client: ChatThreadClient, message: string): Promise<void> => {
  await client.sendMessage({
    content: message
  });
};

export const SendBoxContainer = ({ threadId, userId }: { threadId: string; userId: string }): JSX.Element | null => {
  const client = useChatThreadClient(threadId);

  const onSendMessage = useCallback(
    async (_displayName: string, _userId: string, messageContent: string) => {
      if (!client) return;
      await sendMessage(client, messageContent);
    },
    [client]
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return (
    <SendBoxComponent
      disabled={false}
      displayName=""
      userId={userId}
      sendMessage={onSendMessage}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSendTypingNotification={async () => {}}
    />
  );
};
