// © Microsoft Corporation. All rights reserved.
import { createAzureCommunicationUserCredential } from '../utils/chatUtils';
import { ChatClient } from '@azure/communication-chat';

export const initChat = (token: string, endpointUrl: string): ChatClient => {
  return new ChatClient(endpointUrl, createAzureCommunicationUserCredential(token));
};
