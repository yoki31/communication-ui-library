// © Microsoft Corporation. All rights reserved.

import { CallClient, CallAgent, DeviceManager } from '@azure/communication-calling';
import { AzureCommunicationUserCredential, CommunicationUserCredential } from '@azure/communication-common';
import { AzureLogger } from '@azure/logger';
import { CallingAdapter } from '../CallingAdapter';
import { CallingState } from '../CallingState';
import { createActions, CallingStateUpdate, CallingStateUpdateAsync, isPromise } from './ActionsCreator';
import { CallingActions } from '../CallingActions';
import { subscribeToDeviceManager } from './DeviceManagerSubscriber';
import { EventEmitter } from 'events';
import { createDraft, finishDraft } from 'immer';

export interface AcsCallingAdapterOptions {
  tokenRefresher?: () => Promise<string>;
  logger?: AzureLogger;
}

export type UnsubscribeFunction = () => void;
export type ChangeEmitter = (update: CallingStateUpdate | CallingStateUpdateAsync | undefined) => Promise<void>;

/**
 * CallingAdapter for @azure/communication-calling.
 */
export class AcsCallingAdapter implements CallingAdapter {
  private readonly credential: CommunicationUserCredential;
  private callClient!: CallClient;
  private callAgent!: CallAgent;
  private deviceManager!: DeviceManager;
  private logger: AzureLogger | undefined;
  private actions!: CallingActions;
  private getState!: () => Readonly<CallingState>;

  private isInitialized = false;
  private isInitializing = false;
  private initPromise: Promise<CallingActions> | undefined;
  private isDisposed = false;
  private isDisposing = false;

  private readonly emitter = new EventEmitter();

  private unsubscribeFromDeviceManager!: UnsubscribeFunction;

  constructor(token: string, options?: AcsCallingAdapterOptions) {
    this.logger = options?.logger;
    this.credential = options?.tokenRefresher
      ? new AzureCommunicationUserCredential({
          tokenRefresher: options.tokenRefresher,
          initialToken: token,
          refreshProactively: true
        })
      : new AzureCommunicationUserCredential(token);
  }

  public async createCallingActions(getState: () => Readonly<CallingState>): Promise<CallingActions> {
    if ((this.isInitializing || this.isInitialized) && this.initPromise) {
      this.logger?.warning('AcsCalling has already been initialized');
      return this.initPromise;
    }
    this.isInitializing = true;
    this.isDisposed = false;
    this.getState = getState;

    const initPromise = (async (): Promise<CallingActions> => {
      await this.initCalling();
      this.actions = createActions(getState, this.emitStateChange.bind(this), this.callAgent, this.deviceManager);

      this.unsubscribeFromDeviceManager = subscribeToDeviceManager(
        getState,
        this.emitStateChange.bind(this),
        this.deviceManager
      );

      this.isInitialized = true;
      this.isInitializing = false;

      return this.actions;
    })();
    this.initPromise = initPromise;
    return initPromise;
  }

  public onStateChange(listener: (state: Readonly<CallingState>) => void): void {
    this.emitter.on('onStateChange', listener);
  }

  private emitStateChange: ChangeEmitter = async (
    update: CallingStateUpdate | CallingStateUpdateAsync | undefined
  ): Promise<void> => {
    if (!update) return;
    const draft = createDraft(this.getState());
    const result = update(draft as CallingState);
    if (isPromise(result)) {
      await result;
    }
    this.emitter.emit('onStateChange', finishDraft(draft));
  };

  public async dispose(): Promise<void> {
    if (this.isDisposing || this.isDisposed) {
      this.logger?.warning('AcsCalling has already been disposed');
      return;
    }
    this.isDisposing = true;

    this.unsubscribeFromDeviceManager();
    await this.callAgent.dispose();
    this.emitter.removeAllListeners();

    this.isDisposed = true;
    this.isDisposing = false;
    this.isInitialized = false;
  }

  private async initCalling(): Promise<void> {
    this.callClient = new CallClient({ logger: this.logger });
    this.callAgent = await this.callClient.createCallAgent(this.credential);
    this.deviceManager = await this.callClient.getDeviceManager();
  }
}
