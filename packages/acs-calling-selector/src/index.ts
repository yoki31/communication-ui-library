// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './baseSelectors';
export * from './callControlSelectors';
export { createDefaultCallingHandlersForComponent, createDefaultCallingHandlers } from './handlers/createHandlers';
export { mediaGallerySelector } from './mediaGallerySelector';
export { videoGallerySelector } from './videoGallerySelector';
export { complianceBannerSelector } from './complianceBannerSelector';
export { participantListSelector } from './participantListSelector';
export { localPreviewSelector } from './localPreviewSelector';

export type { CallingBaseSelectorProps } from './baseSelectors';
export type { DefaultCallingHandlers } from './handlers/createHandlers';

/* eslint-disable @typescript-eslint/no-unused-vars */
// Stub while these are being implemented
export const useSelector = <SelectorT extends (state: any, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): never => {
  throw 'stub';
};
export const usePropsFor = <Component extends (props: any) => JSX.Element>(component: Component): never => {
  throw 'stub';
};
export type GetSelector<Component> = never;
