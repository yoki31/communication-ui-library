// © Microsoft Corporation. All rights reserved.

import { LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import {
  audioButtonProps,
  ControlBar,
  hangupButtonProps,
  videoButtonProps,
  GridLayout,
  StreamMedia
} from '@azure/communication-ui';
import { DefaultButton, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { RenderedVideoTile } from './RenderedVideoTile';

export interface CallScreenProps {
  isVideoOn: boolean;
  isMuted: boolean;
  participants: ReadonlyArray<RemoteParticipant>;
  localVideoStream?: LocalVideoStream;
  displayName: string;
  toggleVideo: () => Promise<void>;
  toggleMute: () => Promise<void>;
  leaveCall: () => Promise<void>;
}

export function CallScreen(props: CallScreenProps): JSX.Element {
  const { isVideoOn, isMuted, participants, localVideoStream, displayName, toggleVideo, toggleMute, leaveCall } = props;

  const [videoToggleInProgress, setVideoToggleInProgress] = useState<boolean>(false);
  const [microphoneToggleInProgress, setMicrophoneToggleInProgress] = useState<boolean>(false);

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

  const tiles = useMemo(() => {
    const tiles = [];
    let i = 0;
    tiles.push(
      <RenderedVideoTile displayName={displayName} stream={localVideoStream} key={i}>
        <label>{displayName}</label>
      </RenderedVideoTile>
    );
    participants.forEach((participant) => {
      i++;
      tiles.push(
        <RenderedVideoTile displayName={participant.displayName} stream={participant.videoStreams[0]} key={i}>
          <label>{participant.displayName}</label>
        </RenderedVideoTile>
      );
    });
    return tiles;
  }, [displayName, localVideoStream, participants]);

  return (
    <Stack style={{ width: '100%', height: '100%' }}>
      <GridLayout>{tiles}</GridLayout>
      <RenderedVideoTile displayName={''} />
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
        <DefaultButton {...hangupButtonProps} onClick={leaveCall} />
      </ControlBar>
    </Stack>
  );
}
