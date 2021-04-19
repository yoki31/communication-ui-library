// © Microsoft Corporation. All rights reserved.

import {
  RemoteParticipant,
  VideoStream,
  VideoDeviceInfo,
  AudioDeviceInfo,
  PermissionState,
  CallStatus,
  RemoteParticipantStream
} from './CallingModels';

// don't expose types with imperative logic directly: Call, CallClient, CallAgent, DeviceManager
// instead expose that functionality as handlers

export interface DevicesState {
  audioDevicePermission: PermissionState;
  selectedMicrophone: AudioDeviceInfo | undefined;
  microphones: AudioDeviceInfo[];
  videoDevicePermission: PermissionState;
  selectedCamera: VideoDeviceInfo | undefined;
  cameras: VideoDeviceInfo[];
}

export interface CallState {
  callId: string | undefined;
  isInitialized: boolean;
  status: CallStatus;
  participants: RemoteParticipant[];
  screenShareStream: RemoteParticipantStream | undefined;
  displayName: string;
  isMicrophoneEnabled: boolean;
  localScreenShareActive: boolean;
  localVideoStream: VideoStream | undefined;
  remoteVideoStreams: Map<string, VideoStream[]>;
  rawLocalMediaStream: MediaProvider | null;
  localVideoElement: HTMLElement | undefined;
  isLocalVideoOn: boolean;
}
/**

  Declarative Calling state // ACS dep

// compState.callState = useSelector(selectForGroupCallComposite)  // runs against declarative state, selector comes from -selector package
// compState.otherStuff

Does GroupCall need to have the full GroupCallState?

  Composite state // no ACS dep

  useSelector(selector) // no ACS dependency

 */

// TODO: split for adapter, and for composite UI?
export interface CallingState {
  userId: string;
  devices: DevicesState;
  call: CallState;
}

// have hooks instead of properties?
// use = (get, set)
export const emptyCallingState: CallingState = {
  userId: '',
  devices: {
    audioDevicePermission: 'Unknown',
    selectedMicrophone: undefined,
    microphones: [],
    videoDevicePermission: 'Unknown',
    selectedCamera: undefined,
    cameras: []
  },
  call: {
    callId: undefined,
    isInitialized: false,
    status: 'None',
    participants: [],
    screenShareStream: undefined,
    displayName: '',
    isMicrophoneEnabled: false,
    localScreenShareActive: false,
    localVideoStream: undefined,
    localVideoElement: undefined,
    remoteVideoStreams: new Map(),
    rawLocalMediaStream: null,
    isLocalVideoOn: false
  }
};
