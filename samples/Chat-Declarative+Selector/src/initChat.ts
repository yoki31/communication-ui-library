// © Microsoft Corporation. All rights reserved.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';

export const createAzureCommunicationUserCredential = (
  token: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): AzureCommunicationTokenCredential => {
  if (refreshTokenCallback !== undefined) {
    const options: CommunicationTokenRefreshOptions = {
      token: token,
      tokenRefresher: () => refreshTokenCallback(),
      refreshProactively: true
    };
    return new AzureCommunicationTokenCredential(options);
  } else {
    return new AzureCommunicationTokenCredential(token);
  }
};

export const initChat = (token: string, endpointUrl: string): ChatClient => {
  return new ChatClient(endpointUrl, createAzureCommunicationUserCredential(token));
};
