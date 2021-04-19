// © Microsoft Corporation. All rights reserved.

import { LocalVideoStream, RemoteParticipant, VideoDeviceInfo } from '@azure/communication-calling';
import {
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier,
  UnknownIdentifier
} from '@azure/communication-common';
import {
  audioButtonProps,
  ControlBar,
  hangupButtonProps,
  videoButtonProps,
  GridLayout,
  screenShareButtonProps,
  optionsButtonProps,
  ParticipantItem
} from '@azure/communication-ui';
import { DefaultButton, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { RenderedVideoTile } from './RenderedVideoTile';

export interface CallScreenProps {
  isVideoOn: boolean;
  isMuted: boolean;
  isScreenSharingOn: boolean;
  participants: RemoteParticipant[];
  localVideoStream?: LocalVideoStream;
  displayName: string;
  videoDeviceInfos: VideoDeviceInfo[];
  switchSource: (videoDeviceInfo: VideoDeviceInfo) => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  removeParticipant(
    identifier: CommunicationUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier
  ): void;
  leaveCall: () => Promise<void>;
}

export function CallScreen(props: CallScreenProps): JSX.Element {
  const {
    isVideoOn,
    isMuted,
    isScreenSharingOn,
    participants,
    localVideoStream,
    displayName,
    videoDeviceInfos,
    switchSource,
    toggleVideo,
    toggleMute,
    toggleScreenShare,
    removeParticipant,
    leaveCall
  } = props;

  const [videoToggleInProgress, setVideoToggleInProgress] = useState<boolean>(false);
  const [microphoneToggleInProgress, setMicrophoneToggleInProgress] = useState<boolean>(false);
  const [screenShareToggleInProgress, setScreenShareToggleInProgress] = useState<boolean>(false);

  const onToggleVideo = useCallback(async () => {
    try {
      setVideoToggleInProgress(true);
      await toggleVideo();
      setVideoToggleInProgress(false);
    } catch (e) {
      console.error(e);
      setVideoToggleInProgress(false);
    }
  }, [toggleVideo]);

  const onToggleMute = useCallback(async () => {
    try {
      setMicrophoneToggleInProgress(true);
      await toggleMute();
      setMicrophoneToggleInProgress(false);
    } catch (e) {
      console.error(e);
      setMicrophoneToggleInProgress(false);
    }
  }, [toggleMute]);

  const onToggleScreenShare = useCallback(async () => {
    try {
      setScreenShareToggleInProgress(true);
      await toggleScreenShare();
      setScreenShareToggleInProgress(false);
    } catch (e) {
      console.error(e);
      setScreenShareToggleInProgress(false);
    }
  }, [toggleScreenShare]);

  console.log('localVideoStream', localVideoStream);

  const tiles = useMemo(() => {
    const tiles = [];
    let i = 0;
    //tiles.push(<VideoTile isVideoReady={false} avatarName={displayName} />);
    tiles.push(
      <RenderedVideoTile displayName={displayName} stream={localVideoStream} key={i}>
        <label>{displayName}</label>
      </RenderedVideoTile>
    );
    participants.forEach((participant) => {
      console.log('participant', participant);
      i++;
      let cameraStream = undefined;
      for (const videoStream of participant.videoStreams) {
        if (videoStream.mediaStreamType === 'Video') {
          cameraStream = videoStream;
          console.log(cameraStream);
          break;
        }
      }
      tiles.push(
        <RenderedVideoTile
          displayName={participant.displayName}
          stream={cameraStream !== undefined && cameraStream.isAvailable ? cameraStream : undefined}
          key={i}
        >
          <label>{participant.displayName}</label>
        </RenderedVideoTile>
      );
      // tiles.push(<VideoTile key={i} isVideoReady={false} avatarName={participant.displayName} />);
    });
    return tiles;
  }, [displayName, localVideoStream, participants]);

  const screenShare = useMemo(() => {
    if (isScreenSharingOn) {
      return (
        <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
          {'Your screen share is on'}
        </MessageBar>
      );
    }
    for (const participant of participants) {
      for (const videoStream of participant.videoStreams) {
        if (videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable) {
          return <RenderedVideoTile displayName={'screenshare'} stream={videoStream} />;
        }
      }
    }

    return null;
  }, [isScreenSharingOn, participants]);

  const switchSourceMenu = useMemo(() => {
    const menuItems = [];
    let i = 0;
    for (const videoDeviceInfo of videoDeviceInfos) {
      menuItems.push({
        key: i.toString(),
        name: 'SwitchSource: ' + videoDeviceInfo.name,
        onClick: () => {
          switchSource(videoDeviceInfo);
        }
      });
      i++;
    }
    return { items: menuItems };
  }, [videoDeviceInfos, switchSource]);

  return (
    <Stack style={{ width: '100%', height: '100%' }} horizontal>
      <Stack style={{ width: '100%', height: '100%' }}>
        <GridLayout>{tiles}</GridLayout>
        {screenShare}
        <ControlBar layout={'floatingBottom'}>
          <DefaultButton
            {...videoButtonProps}
            onClick={onToggleVideo}
            disabled={videoToggleInProgress}
            checked={isVideoOn}
          />
          <DefaultButton
            {...audioButtonProps}
            onClick={onToggleMute}
            disabled={microphoneToggleInProgress}
            checked={!isMuted}
          />
          <DefaultButton
            {...screenShareButtonProps}
            onClick={onToggleScreenShare}
            disabled={screenShareToggleInProgress}
            checked={isScreenSharingOn}
          />
          <DefaultButton {...optionsButtonProps} menuProps={switchSourceMenu} />
          <DefaultButton {...hangupButtonProps} onClick={leaveCall} />
        </ControlBar>
      </Stack>
      <Stack style={{ width: '30%', padding: '10px' }}>
        <ParticipantItem name={displayName + ' (You)'} />
        {participants.map((participant: RemoteParticipant, index: number) => {
          return (
            <ParticipantItem
              key={index}
              name={participant.displayName}
              menuItems={[
                {
                  key: 'Kick Participant',
                  text: 'Kick Participant',
                  onClick: () => {
                    console.log('removeParticipant', removeParticipant);
                    console.log('participant', participant);
                    console.log('participantIdentifier', participant.identifier);
                    removeParticipant(participant.identifier);
                  }
                }
              ]}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
