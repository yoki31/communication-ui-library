## API Report File for "@internal/acs-ui-common"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="react" />

import { CommunicationIdentifier } from '@azure/communication-common';

// @public
export type AreEqual<A extends (props: any) => JSX.Element | undefined, B extends (props: any) => JSX.Element | undefined> = true extends AreTypeEqual<A, B> & AreParamEqual<A, B> ? true : false;

// @public
export type AreParamEqual<A extends (props: any) => JSX.Element | undefined, B extends (props: any) => JSX.Element | undefined> = AreTypeEqual<Required<Parameters<A>[0]>, Required<Parameters<B>[0]>>;

// @public
export type AreTypeEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

// @public
export type CallbackType<KeyT, ArgsT extends unknown[], FnRetT> = (memoizedFn: FunctionWithKey<KeyT, ArgsT, FnRetT>) => FnRetT[];

// @public
export type Common<A, B> = Pick<A, CommonProperties<A, B>>;

// @public
export type CommonProperties<A, B> = {
    [P in keyof A & keyof B]: A[P] extends B[P] ? P : never;
}[keyof A & keyof B];

// @public
export const fromFlatCommunicationIdentifier: (id: string) => CommunicationIdentifier;

// @public
export type FunctionWithKey<KeyT, ArgsT extends unknown[], RetT> = (key: KeyT, ...args: ArgsT) => RetT;

// @internal
export const _getApplicationId: () => string;

// @public
export const memoizeFnAll: <KeyT, ArgsT extends unknown[], FnRetT, CallBackT extends CallbackType<KeyT, ArgsT, FnRetT>>(fnToMemoize: FunctionWithKey<KeyT, ArgsT, FnRetT>, shouldCacheUpdate?: (args1: unknown, args2: unknown) => boolean) => (callback: CallBackT) => FnRetT[];

// @public
export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';

// @public
export const toFlatCommunicationIdentifier: (id: CommunicationIdentifier) => string;

// (No @packageDocumentation comment for this package)

```
