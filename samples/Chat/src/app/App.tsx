// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';
import { getBuildTime, getChatSDKVersion } from './utils/utils';
import { initializeIcons } from '@fluentui/react';

import { ChatScreen } from './ChatScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import HomeScreen from './HomeScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { getThreadId } from './utils/getThreadId';
import { ChatProvider, ErrorProvider, CommunicationUiErrorInfo } from '@azure/communication-ui';
import { refreshTokenAsync } from './utils/refreshToken';

console.info(`Thread chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

initializeIcons();

export default (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [_userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [chatClient, setChatClient] = useState<DeclarativeChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();

  useEffect(() => {
    if (token && _userId && displayName && threadId && endpointUrl) {
      // This hack can be removed when `getIdFromToken` is dropped in favour of actually passing in user credentials.
      const userId = { kind: 'communicationUser', communicationUserId: _userId } as CommunicationUserKind;
      const createClient = async (): Promise<void> => {
        const chatClient = chatClientDeclaratify(
          new ChatClient(endpointUrl, createAzureCommunicationUserCredential(token, refreshTokenAsync(_userId))),
          { userId, displayName }
        );

        chatClient.onStateChange((state) => {
          const thread = state.threads.get(threadId);
          if (thread) {
            for (const message of thread.chatMessages.values()) {
              console.log('content: ' + message.content?.message + ' status: ' + message.status);
            }
          }
        });

        const threadClient = chatClient.getChatThreadClient(threadId);
        threadClient.sendMessage({ content: 'hello' });

        setChatClient(chatClient);
        setChatThreadClient(undefined);

        // chatClient.startRealtimeNotifications();
      };
      createClient();
    }
  }, [displayName, endpointUrl, threadId, token, _userId]);

  const getComponent = (): JSX.Element => {
    if (page === 'home') {
      return <HomeScreen />;
    } else if (page === 'configuration') {
      return (
        <ConfigurationScreen
          joinChatHandler={() => {
            setPage('chat');
          }}
          setToken={setToken}
          setUserId={setUserId}
          setDisplayName={setDisplayName}
          setThreadId={setThreadId}
          setEndpointUrl={setEndpointUrl}
        />
      );
    } else if (page === 'chat') {
      return (
        <ErrorProvider
          onErrorCallback={(error: CommunicationUiErrorInfo) => console.error('onErrorCallback received error:', error)}
        >
          <ChatProvider
            token={token}
            displayName={displayName}
            threadId={threadId}
            endpointUrl={endpointUrl}
            refreshTokenCallback={refreshTokenAsync(userId)}
          >
            <ChatScreen
              endChatHandler={() => {
                setPage('end');
                // Send up signal that the user wants to leave the chat
                // Move to to next screen on success
              }}
              errorHandler={() => {
                setPage('error');
              }}
            />
          </ChatProvider>
        </ErrorProvider>
      );
    } else if (page === 'end') {
      return (
        <EndScreen
          rejoinHandler={() => {
            setPage('chat'); // use store information to attempt to rejoin the chat thread
          }}
          homeHandler={() => {
            window.location.href = window.location.origin;
          }}
          userId={_userId}
          displayName={displayName}
        />
      );
    } else if (page === 'error') {
      return (
        <ErrorScreen
          homeHandler={() => {
            window.location.href = window.location.origin;
          }}
        />
      );
    } else {
      throw new Error('Page type not recognized');
    }
  };

  if (getThreadId() && page === 'home') {
    setPage('configuration');
  }

  return getComponent();
};
