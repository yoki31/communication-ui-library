import React, { useState, useEffect } from 'react';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';
import { ChatConfig } from '../ChatConfig';

export const ContosoChatContainer = (props: { config: ChatConfig | undefined }): JSX.Element => {
  const { config } = props;

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (config) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            config.token,
            config.endpointUrl,
            config.threadId,
            config.displayName
          )
        );
      };
      createAdapter();
    }
  }, [config]);

  useEffect(() => {
    if (adapter === undefined) return;
    adapter.on('messageReceived', async (event) => {
      console.log(event);
      console.log(event.message);
    });
    adapter.on('participantsAdded', async (event) => {
      console.log(event);
      console.log(event.participantsAdded);
    });
    adapter.on('messageRead', async (event) => {
      console.log(event);
      console.log(event.readBy);
    });
    adapter.on('messageSent', async (event) => {
      console.log(event);
      console.log(event.message);
    });
    adapter.on('participantsRemoved', async (event) => {
      console.log(event);
      console.log(event.removedBy);
    });
    adapter.on('topicChanged', async (event) => {
      console.log(event);
      console.log(event.topic);
    });

    setTimeout(() => {
      adapter.setTopic('TestTopic');
    }, 5000);
  }, [adapter]);

  return <>{adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}</>;
};
