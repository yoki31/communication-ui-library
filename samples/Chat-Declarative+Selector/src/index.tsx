// © Microsoft Corporation. All rights reserved.

import './index.css';

import { App } from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { FluentThemeProvider } from '@azure/communication-ui';
import { initChat } from './initChat';
import { chatClientDeclaratify } from '@azure/acs-chat-declarative';

const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjc0MGU5MTdiLTFhZTAtNDdhYS1iYzY4LWFlOTU2MDBiYTFlM18wMDAwMDAwOC1kOWYzLWY4NDUtY2ViMS1hNDNhMGQwMDhiYjYiLCJzY3AiOjE3OTIsImNzaSI6IjE2MTU4ODE5ODMiLCJpYXQiOjE2MTU4ODE5ODMsImV4cCI6MTYxNTk2ODM4MywiYWNzU2NvcGUiOiJ2b2lwLGNoYXQiLCJyZXNvdXJjZUlkIjoiNzQwZTkxN2ItMWFlMC00N2FhLWJjNjgtYWU5NTYwMGJhMWUzIn0.JpiyadZwE5ltVy4_lj7tn8KV5twZU3mmUeCoHPZrvyQrYy9bOHCWC3h0FU4tTNNHQz_Uaj5Ek2EJgjgFMDM9hm89iFKu8OvE-I0cUgCIRwXqgqH_TOx7j6g8HiYgRAN9kUGKCywBKPWuPQwY4YQN5f11_P0kdAbDjbflbBBzt7ES6qBrK8Dg75ZPaZfjuakkp-xQM1iUAU0Jyzm5A9w_JZENeHX8uuCnkT6GWK9gZuabZxMyhWjvwoLlogStVfXRJQGBWWBjMUmVbohf3s450seyCn5aFkxaHt0fDITu0bcVIbA8jvHFkn_95qr1hqZZkTIuCfNSbfoOqHN1C-Zgow';
const endPoint = 'https://acscallingherosample.communication.azure.com';
const threadId = '19:6178c8d91a984c5988a83cb79dcbff49@thread.v2';

const render = async (): Promise<void> => {
  const chatClient = chatClientDeclaratify(initChat(token, endPoint));
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  chatClient.startRealtimeNotifications();

  if (document.getElementById('root') !== undefined) {
    ReactDOM.render(
      <FluentThemeProvider>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <App chatClient={chatClient} chatThreadClient={chatThreadClient} />
      </FluentThemeProvider>,
      document.getElementById('root')
    );
  }
};

render();
