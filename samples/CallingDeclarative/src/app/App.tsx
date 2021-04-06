// © Microsoft Corporation. All rights reserved.

import React, { useCallback, useState } from 'react';
import { initializeIcons, Spinner } from '@fluentui/react';
import { HomeScreen } from './HomeScreen';
import { v1 as createGUID } from 'uuid';
import {
  AudioOptions,
  Call,
  CallAgent,
  CallClient,
  DeviceManager,
  LocalVideoStream,
  VideoDeviceInfo,
  VideoOptions
} from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { callClientDeclaratify, CallClientState } from '@azure/acs-calling-declarative';
import { ConfigurationScreen } from './ConfigurationScreen';
import { CallScreen } from './CallScreen';
import { EndScreen } from './EndScreen';

initializeIcons();

const BLANKSCREEN = 0;
const LOADINGSCREEN = 1;
const HOMESCREEN = 2;
const CONFIGURATIONSCREEN = 3;
const CALLSCREEN = 4;
const ENDSCREEN = 5;

export function App(): JSX.Element {
  const [screen, setScreen] = useState<number>(BLANKSCREEN);
  const [groupId, setGroupId] = useState<string>('');

  const [callClient, setCallClient] = useState<CallClient | undefined>();
  const [deviceManager, setDeviceManager] = useState<DeviceManager | undefined>();
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>();
  const [state, setState] = useState<CallClientState | undefined>();

  // Note: CallId can change according to the SDK. How can contoso keep track of which call is active if there are
  // multiple calls and callId can change?
  const [call, setCall] = useState<Call | undefined>();
  const [callId, setCallId] = useState<string | undefined>();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<VideoDeviceInfo | undefined>();
  const [displayName, setDisplayName] = useState<string>('');

  // Bug - there is no state change for changing muted.
  const [muted, setMuted] = useState<boolean | undefined>(true);

  const onInitializeAndGoToConfigurationScreen = useCallback(
    async (groupIdFromUrl: string): Promise<void> => {
      if (callAgent) {
        await callAgent.dispose();
      }

      const newCallClient = new CallClient();
      const declarativeCallClient = callClientDeclaratify(newCallClient);
      declarativeCallClient.onStateChange((state: CallClientState) => {
        setState(state);
      });
      const newDeviceManager = await declarativeCallClient.getDeviceManager();
      newDeviceManager.askDevicePermission({ audio: true, video: true }).then((deviceAccess) => {
        // TODO: There is a bug with Calling SDK. We cannot retrieve device info right after getting device permission
        // as it will return an error. Currently workaround is to wait one second. Calling SDK team has been notified
        // and they will fix in new version.
        setTimeout(() => {
          console.log(deviceAccess);
          newDeviceManager.getCameras().then((cameras) => {
            console.log(cameras);
          });
          newDeviceManager.getMicrophones().then((microphones) => {
            console.log(microphones);
          });
        }, 1000);
      });
      setCallClient(declarativeCallClient);
      setGroupId(groupIdFromUrl);
      setDeviceManager(newDeviceManager);
      setScreen(CONFIGURATIONSCREEN);
    },
    [callAgent]
  );

  const onHomeScreenStartCall = useCallback((): void => {
    if (groupId.length === 0) {
      const newGroupId = createGUID();
      window.history.pushState({}, document.title, window.location.href + '?groupId=' + newGroupId);
      setGroupId(newGroupId);
    }
    setScreen(BLANKSCREEN);
  }, [groupId]);

  const onConfigurationScreenStartCall = useCallback(
    async (
      displayName: string,
      videoOn: boolean,
      microphoneOn: boolean,
      selectedVideoDevice?: VideoDeviceInfo
    ): Promise<void> => {
      setScreen(LOADINGSCREEN);
      setDisplayName(displayName);
      const getTokenResponse = await fetch('/token', { method: 'POST' });
      const token = await getTokenResponse.json().then((_responseJson) => {
        return { token: _responseJson.token, id: _responseJson.user.communicationUserId };
      });
      const credential = new AzureCommunicationTokenCredential(token.token);
      const newCallAgent = await callClient.createCallAgent(credential, { displayName: displayName });

      const audioOptions: AudioOptions = { muted: !microphoneOn };
      const videoOptions: VideoOptions = {
        localVideoStreams: videoOn && selectedVideoDevice ? [new LocalVideoStream(selectedVideoDevice)] : undefined
      };
      const callOptions = {
        videoOptions: videoOptions,
        audioOptions: audioOptions
      };
      const call = newCallAgent.join({ groupId: groupId }, callOptions);

      setMuted(call.isMicrophoneMuted);
      setSelectedVideoDevice(selectedVideoDevice);
      setCall(call);
      setCallId(call.id);
      setCallAgent(newCallAgent);
      setScreen(CALLSCREEN);
    },
    [callClient, groupId]
  );

  const onToggleVideo = useCallback(async () => {
    if (!call) {
      return;
    }
    if (call.localVideoStreams.length > 0) {
      await call.stopVideo(call.localVideoStreams[0]);
    } else {
      await call.startVideo(new LocalVideoStream(selectedVideoDevice));
    }
  }, [call, selectedVideoDevice]);

  const onToggleMute = useCallback(async () => {
    if (!call) {
      return;
    }
    if (call.isMicrophoneMuted) {
      await call.unmute();
      setMuted(call.isMicrophoneMuted);
    } else {
      await call.mute();
      setMuted(call.isMicrophoneMuted);
    }
  }, [call]);

  const onLeaveCall = useCallback(async () => {
    try {
      setScreen(LOADINGSCREEN);
      await call.hangUp({ forEveryone: false });
      setScreen(ENDSCREEN);
    } catch (e) {
      console.error(e);
      setScreen(BLANKSCREEN);
    }
  }, [call]);

  const onRejoinCall = useCallback(async () => {
    setScreen(BLANKSCREEN);
  }, []);

  if (call) {
    if (muted !== call.isMicrophoneMuted) {
      setMuted(call.isMicrophoneMuted);
    }
  }

  /**
   * BLANKSCREEN
   *
   * Check if groupId is in search bar. If not, go to HOMESCREEN. If so, so go to LOADINGSCREEN and async call
   * initialize. After initialize finishes go to CONFIGURATIONSCREEN.
   */
  if (screen === BLANKSCREEN) {
    const urlParams = new URLSearchParams(window.location.search);
    const groupIdFromUrl = urlParams.get('groupId');
    if (groupIdFromUrl) {
      setScreen(LOADINGSCREEN);
      onInitializeAndGoToConfigurationScreen(groupIdFromUrl);
    } else {
      setScreen(HOMESCREEN);
    }
  } else if (screen === LOADINGSCREEN) {
    /**
     * LOADINGSCREEN
     *
     * Show loading spinner. There should be some other async function running that when completed will change screen.
     */
    return <Spinner label={'loading...'} ariaLive="assertive" />;
  } else if (screen === HOMESCREEN) {
    /**
     * HOMESCREEN
     *
     * Only shows start call button. When start call button is clicked sets groupId in window and go to BLANKSCREEN.
     */
    return <HomeScreen startCallHandler={onHomeScreenStartCall} />;
  } else if (screen === CONFIGURATIONSCREEN) {
    return (
      <ConfigurationScreen
        videoDevices={state.deviceManagerState.cameras}
        audioDevices={state.deviceManagerState.microphones}
        selectedAudioDevice={state.deviceManagerState.selectedMicrophone}
        selectMicrophone={deviceManager.selectMicrophone}
        startCallHandler={onConfigurationScreenStartCall}
      />
    );
  } else if (screen === CALLSCREEN) {
    const callState = state.calls.get(callId);
    return (
      <CallScreen
        isVideoOn={callState ? callState.localVideoStreams.length > 0 : false}
        isMuted={muted}
        participants={call ? [...call.remoteParticipants] : []}
        localVideoStream={
          call ? (call.localVideoStreams.length > 0 ? call.localVideoStreams[0] : undefined) : undefined
        }
        displayName={displayName}
        toggleVideo={onToggleVideo}
        toggleMute={onToggleMute}
        leaveCall={onLeaveCall}
      />
    );
  } else if (screen === ENDSCREEN) {
    return <EndScreen rejoinCallHandler={onRejoinCall} />;
  }
  return <></>;
}
