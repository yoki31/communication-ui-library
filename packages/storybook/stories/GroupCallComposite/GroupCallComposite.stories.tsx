// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { PlaceholderProps } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs/blocks';
import { text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  CallComposite as GroupCallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter
} from 'react-composites';
import { v1 as createGUID } from 'uuid';

import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';

const groupCallCompositeExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;

const importStatement = `
  import { GroupCall } from 'react-composites';
  import { v1 as createGUID } from 'uuid';
  import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GroupCall</Title>
      <Description>GroupCall is an one-stop component that you can make ACS Group Call running.</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example Code</Heading>
      <Source code={groupCallCompositeExampleText} />

      <Heading>Props</Heading>
      <Props of={GroupCallComposite} />
    </>
  );
};

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Group Call`,
  component: GroupCallComposite,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Group Call');

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const userToken = await tokenClient.createUserAndToken(['voip']);

  return userToken;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const GroupCall: () => JSX.Element = () => {
  const [userId, setUserId] = useState<string>(
    '8:acs:71ec590b-cbad-490c-99c5-b578bdacde54_0000000a-1e8e-541a-99bf-a43a0d003aa8'
  );
  const [groupId, setGroupId] = useState<string>('885031e0-b7b6-11eb-9cad-e95d2cb9d1a6');
  const [token, setToken] = useState<string>(
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NF8wMDAwMDAwYS0xZThlLTU0MWEtOTliZi1hNDNhMGQwMDNhYTgiLCJzY3AiOjE3OTIsImNzaSI6IjE2MjEzMjc5MTciLCJpYXQiOjE2MjEzMjc5MTcsImV4cCI6MTYyMTQxNDMxNywiYWNzU2NvcGUiOiJjaGF0LHZvaXAiLCJyZXNvdXJjZUlkIjoiNzFlYzU5MGItY2JhZC00OTBjLTk5YzUtYjU3OGJkYWNkZTU0In0.wBgk_iUebYw1xrUqsBIqCCYek8hJVtFgdpU1FsX_eNnQHx-gtS1K0PjxcdXNtnXazMKBma-JlqxBQRbrBrW6UFuxqSOsoNUiuMlLpx8i1BZZbPZ5jzR-id4c_ys0_opc6i_8yEXRh9wfeQZLJX4KArwKkL_2cDBOgiVZT3l9xVBD8R3Eeoka_rngnjSI9V9UT9mUtFc8T7kU6yz5QFwDT4TVd0O5Dhvo0xNsbeSIYAehUmt-2_N9ply7izZxDLtI4cssnXcCXoyvdimxsG7FZyUt2cvZqSXOQ0Io_y3O1Plfq5aYJELifni14gXI0sa-qdmnjG7_CreK1g-eyBJHYw'
  );
  const connectionString = text(COMPOSITE_STRING_CONNECTIONSTRING, '');

  useEffect(() => {
    (async () => {
      if (connectionString) {
        try {
          const tokenResponse = await createUserToken(connectionString);
          setToken(tokenResponse.token);
          setUserId(tokenResponse.user.communicationUserId);
          const groupId = createGUID();
          console.log(`groupId: ${groupId}`);
          setGroupId(groupId);
        } catch (e) {
          console.error(e);
          console.log('Ensure your connection string is valid.');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionString]);

  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (token && userId && groupId) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(await createAzureCommunicationCallAdapter(token, groupId, 'test name'));
      };
      createAdapter();
    }
  }, [token, userId, groupId]);

  useEffect(() => {
    if (adapter === undefined) return;
    adapter.on('isSpeakingChanged', async (event) => {
      console.log(event);
    });
    adapter.on('callIdChanged', async (event) => {
      console.log(event);
    });
    adapter.on('displayNameChanged', async (event) => {
      console.log(event);
    });
    adapter.on('isMutedChanged', async (event) => {
      console.log(event);
    });
    adapter.on('isLocalScreenSharingActiveChanged', async (event) => {
      console.log(event);
    });
    adapter.on('participantsJoined', async (event) => {
      console.log(event);
    });
    adapter.on('participantsLeft', async (event) => {
      console.log(event);
    });
  }, [adapter]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {adapter && (
        <GroupCallComposite
          adapter={adapter}
          onRenderAvatar={(props, defaultOnRender) => {
            if (props.userId === userId) {
              return (
                <Stack>
                  <img
                    src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
                    style={{
                      borderRadius: '150px',
                      width: '150px',
                      position: 'absolute',
                      margin: 'auto',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }}
                  />
                </Stack>
              );
            } else {
              return defaultOnRender(props);
            }
          }}
        />
      )}
      {/* {!connectionString && CompositeConnectionParamsErrMessage([emptyConfigTips])} */}
    </div>
  );
};
