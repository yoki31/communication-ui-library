// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '../../acs-ui-common/src';
export type { CommonProperties } from '../../acs-ui-common/src';

export * from '../../calling-stateful-client/src';
export * from '../../chat-stateful-client/src';
export * from '../../react-components/src';
export * from '../../react-composites/src/index.release';

// export * from '../../acs-calling-selector/src';
import {
  GetSelector as GetCallSelector,
  usePropsFor as useCallPropsFor,
  useSelector as useCallSelector
} from '../../acs-calling-selector/src';
export {
  createDefaultCallingHandlersForComponent,
  createDefaultCallingHandlers,
  mediaGallerySelector,
  videoGallerySelector,
  complianceBannerSelector,
  participantListSelector,
  localPreviewSelector,
  cameraButtonSelector,
  microphoneButtonSelector,
  optionsButtonSelector,
  screenShareButtonSelector
} from '../../acs-calling-selector/src';
export type { CallingBaseSelectorProps, DefaultCallingHandlers } from '../../acs-calling-selector/src';

// export * from '../../acs-chat-selector/src';
import {
  GetSelector as GetChatSelector,
  usePropsFor as useChatPropsFor,
  useChatSelector
} from '../../acs-chat-selector/src';
export {
  createDefaultChatHandlers,
  createDefaultChatHandlersForComponent,
  ChatClientProvider,
  useChatClient,
  ChatThreadClientProvider,
  useChatThreadClient,
  useThreadId,
  useChatSelector,
  chatThreadSelector,
  typingIndicatorSelector,
  sendBoxSelector,
  chatParticipantListSelector
} from '../../acs-chat-selector/src';

export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  ChatBaseSelectorProps,
  DefaultChatHandlers,
  AreEqual
} from '../../acs-chat-selector/src';

// Export merged functions/types
export const useSelector = <SelectorT extends (state: any, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): any => {
  return useChatSelector(selector, selectorProps);
};

export const usePropsFor = <Component extends (props: any) => JSX.Element>(component: Component): any => {
  return useChatPropsFor(component);
};
