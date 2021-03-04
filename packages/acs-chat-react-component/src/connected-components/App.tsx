// © Microsoft Corporation. All rights reserved.
import { ChatClientProvider } from './ChatClientProvider';
import { DeclarativeChatClient, chatClientDeclaratify } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import { SendBoxContainer } from './SendBoxContainer';
import { ChatThreadContainer } from './ChatThreadContainer';
import { initChat } from './initChat';
import React from 'react';

const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjc0MGU5MTdiLTFhZTAtNDdhYS1iYzY4LWFlOTU2MDBiYTFlM18wMDAwMDAwOC05NGVkLTllNjMtN2YwNy0xMTNhMGQwMDMyMzQiLCJzY3AiOjE3OTIsImNzaSI6IjE2MTQ3MjM5MzkiLCJpYXQiOjE2MTQ3MjM5MzksImV4cCI6MTYxNDgxMDMzOSwiYWNzU2NvcGUiOiJ2b2lwLGNoYXQiLCJyZXNvdXJjZUlkIjoiNzQwZTkxN2ItMWFlMC00N2FhLWJjNjgtYWU5NTYwMGJhMWUzIn0.hVqkEwEPl7OGbd6W2pncrbU96UREjL7L4l_snVr8aZQ1EsZeKmlkMHtdtFyCI-xSVm4DMoV384zNPNwoZbYpZn2d86tnUgLpQTfqJNFWaQy3kns01vJzPsYIy1zFbU5eM_baiC1dUo-MjjpyePvUSzzUfxnAupznkx-MFVo5ma-mmdBqLeiJ_eGob-2UPIt1Z3gEVAkaABJWMdpomZNny40nNrvyG_KW41wx5x38s20inAL0DDeK9-6aGZPHrWBTj8Z5r_jWem7tA9kdoIEh_wv3dUvoWU6IGTnHrv8sAl1Pa_JEPT9phPutTiconaKS08Cfk2AYivPzBSWOg8SEDA';
const endPoint = 'https://acscallingherosample.communication.azure.com';
const threadId = '19:30c3124c80fa4a7897e65cd3f535f148@thread.v2';
const userId = '8:acs:740e917b-1ae0-47aa-bc68-ae95600ba1e3_00000008-94ed-9e63-7f07-113a0d003234';

export const App = (props: { chatClient: DeclarativeChatClient; chatThreadClient: ChatThreadClient }): JSX.Element => {
  return (
    <ChatClientProvider chatClient={props.chatClient} chatThreadClients={[props.chatThreadClient]}>
      <SendBoxContainer userId={userId} threadId={threadId} />
      <div
        style={{
          height: '100%',
          width: '100%',
          marginLeft: '6%',
          marginRight: '6%',
          paddingBottom: '1rem',
          overflow: 'auto'
        }}
      >
        <ChatThreadContainer userId={userId} threadId={threadId} />
      </div>
    </ChatClientProvider>
  );
};

const render = async (): Promise<void> => {
  const chatClient = chatClientDeclaratify(initChat(token, endPoint));
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  chatClient.startRealtimeNotifications();
  if (document.getElementById('root') !== undefined) {
    ReactDOM.render(
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <App chatClient={chatClient} chatThreadClient={chatThreadClient} />
      </>,
      document.getElementById('root')
    );
  }
};

render();
