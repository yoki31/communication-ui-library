// © Microsoft Corporation. All rights reserved.
import { CommunicationUserKind, PhoneNumberKind, UnknownIdentifierKind } from '@azure/communication-common';

// all models stolen from @azure/communication-calling and removed functions on them
// todo: define a sensible abstraction

export interface RemoteParticipant {
  /**
   * Get the identifier for this remote participant.
   * Same as the one used to provision token for another user
   */
  readonly identifier: CommunicationUserKind | PhoneNumberKind | UnknownIdentifierKind;
  /**
   * Optional display name, if it was set by the endpoint of
   * that remote participant
   */
  readonly displayName?: string;
  /**
   * Collection of video streams this participants has.
   */
  readonly videoStreams: VideoStream[];
  /**
   * Whether this remote participant is muted or not
   */
  readonly isMuted: boolean;
  readonly isSpeaking: boolean;
}

export interface VideoStream {}

export type RemoteParticipantStream = {
  user: RemoteParticipant;
  stream: VideoStream | undefined;
};

export interface VideoDeviceInfo {
  readonly name: string;
  /**
   * Get Id of this video device.
   */
  readonly id: string;
  /**
   * Get this video device type
   */
  readonly deviceType: VideoDeviceType;
}

export type VideoDeviceType = 'Unknown' | 'UsbCamera' | 'CaptureAdapter' | 'Virtual';

export declare interface AudioDeviceInfo {
  /**
   * Get the name of this video device.
   */
  readonly name: string;
  /**
   * Get Id of this video device.
   */
  readonly id: string;
  /**
   * Is this the systems default audio device
   */
  readonly isSystemDefault: boolean;
  /**
   * Get this audio device type
   */
  readonly deviceType: AudioDeviceType;
}

export type AudioDeviceType = 'Microphone' | 'Speaker' | 'CompositeAudioDevice';
export type PermissionState = 'Granted' | 'Denied' | 'Prompt' | 'Unknown';
export type CallStatus =
  | 'None'
  | 'Incoming'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'Hold'
  | 'InLobby'
  | 'Disconnecting'
  | 'Disconnected'
  | 'EarlyMedia';
