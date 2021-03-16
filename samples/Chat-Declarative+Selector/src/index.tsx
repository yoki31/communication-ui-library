// © Microsoft Corporation. All rights reserved.

import './index.css';

import { App } from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { FluentThemeProvider } from '@azure/communication-ui';
import { initChat } from '@azure/communication-ui/dist/connected-components/initChat';
import { chatClientDeclaratify } from '@azure/acs-chat-declarative';

const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjc0MGU5MTdiLTFhZTAtNDdhYS1iYzY4LWFlOTU2MDBiYTFlM18wMDAwMDAwOC05ZjYzLWNlMTQtZWRiZS1hNDNhMGQwMDJhZDQiLCJzY3AiOjE3OTIsImNzaSI6IjE2MTQ4OTk0NTYiLCJpYXQiOjE2MTQ4OTk0NTYsImV4cCI6MTYxNDk4NTg1NiwiYWNzU2NvcGUiOiJ2b2lwLGNoYXQiLCJyZXNvdXJjZUlkIjoiNzQwZTkxN2ItMWFlMC00N2FhLWJjNjgtYWU5NTYwMGJhMWUzIn0.tMXSkaoWCjL92iMJp6J6DaWT5M69VmceFUzS1_5ghs0PaLWljn3FIms7oqUVspul5gP9tQcdp3fdOjkw3sxGEsgOsKvAcXYcfyKCfB8pX29TLUVXDYTBSm-77m9gO66wKPQaWOC7JjYiHX6wWbbj0YJblALgVeeXdVBBVja5zFi9wvfPayWWVxKM7qMFDv1SnogKP5i5_XzCtL47KMmIFdaLFEc-Usrvdg-A9lWLmwFfrl-f-l8-yInZE0DhB48SqbeLRh139tl6Yc_d_X6zWsZvYJAArcQuLEHznKKjI4a4eVK9P-cyToXyzU6Q5YK-fWGb5bRix4aw-64Nu3ukoA';
const endPoint = 'https://acscallingherosample.communication.azure.com';
const threadId = '19:3c483f6899a646cc8b6d06e45fbad77f@thread.v2';

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
