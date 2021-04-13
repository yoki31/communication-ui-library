// © Microsoft Corporation. All rights reserved.

import { AudioDeviceInfo, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { VideoTile } from '@azure/communication-ui';
import { Stack, TextField, Image, ImageFit, Dropdown, IDropdownOption, Toggle, PrimaryButton } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import staticMediaSVG from '../assets/staticmedia.svg';
import { RenderedVideoTile } from './RenderedVideoTile';

const imageProps = {
  src: staticMediaSVG.toString(),
  imageFit: ImageFit.contain,
  maximizeFrame: true
};

const defaultPlaceHolder = 'Select an option';
const cameraLabel = 'Camera';
const micLabel = 'Microphone';

const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
  return list.map((item) => ({
    val: item,
    key: item.id,
    text: item.name === '' ? item.deviceType : item.name
  }));
};

export interface ConfigurationScreenProps {
  videoDevices: VideoDeviceInfo[];
  audioDevices: AudioDeviceInfo[];
  selectedAudioDevice: AudioDeviceInfo;
  selectMicrophone: (microphoneDevice: AudioDeviceInfo) => Promise<void>;
  startCallHandler: (
    displayName: string,
    videoOn: boolean,
    microphoneOn: boolean,
    selectedVideoDevice?: VideoDeviceInfo
  ) => Promise<void>;
}

export function ConfigurationScreen(props: ConfigurationScreenProps): JSX.Element {
  const { videoDevices, audioDevices, selectedAudioDevice, selectMicrophone, startCallHandler } = props;
  const [displayName, setDisplayName] = useState();
  const [invalidDisplayName, setInvalidDisplayName] = useState(false);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<VideoDeviceInfo>();
  const [microphoneOn, setMicrophoneOn] = useState<boolean>(false);
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream>(undefined);
  const [localPreviewOn, setLocalPreviewOn] = useState<boolean>(false);

  const onNameTextChange = useCallback((event: any): void => {
    setDisplayName(event.target.value);
    if (!event.target.value) {
      setInvalidDisplayName(true);
    } else if (event.target.value.length > 10) {
      setInvalidDisplayName(true);
    } else {
      setInvalidDisplayName(false);
    }
  }, []);

  const onVideoDeviceChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
      setSelectedVideoDevice(videoDevices[index ?? 0]);
      setLocalVideoStream(new LocalVideoStream(videoDevices[index ?? 0]));
      if (localPreviewOn) {
        setLocalPreviewOn(false);
        setLocalPreviewOn(true);
      }
    },
    [localPreviewOn, videoDevices]
  );

  const onAudioDeviceChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
      selectMicrophone(audioDevices[index ?? 0]);
    },
    [selectMicrophone, audioDevices]
  );

  const onStartCall = useCallback(() => {
    startCallHandler(displayName, localPreviewOn, microphoneOn, selectedVideoDevice);
  }, [startCallHandler, displayName, localPreviewOn, microphoneOn, selectedVideoDevice]);

  const stopLocalPreview = useCallback(async () => {
    setLocalPreviewOn(false);
  }, []);

  const startLocalPreview = useCallback(async () => {
    setLocalPreviewOn(true);
  }, []);

  const onToggleVideo = useCallback(() => {
    if (localPreviewOn) {
      stopLocalPreview();
    } else {
      startLocalPreview();
    }
  }, [localPreviewOn, startLocalPreview, stopLocalPreview]);

  const onToggleMicrophone = useCallback(() => {
    setMicrophoneOn(!microphoneOn);
  }, [microphoneOn]);

  if (!selectedVideoDevice && videoDevices.length > 0) {
    setSelectedVideoDevice(videoDevices[0]);
  }

  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center" style={{ width: '100%', height: '100%' }}>
      <Stack
        style={{
          maxWidth: '25rem',
          minWidth: '12.5rem',
          width: '100%',
          height: '100%',
          maxHeight: '18.75rem',
          minHeight: '16.875rem'
        }}
      >
        {localPreviewOn ? (
          <RenderedVideoTile displayName={''} stream={localVideoStream} />
        ) : (
          <VideoTile
            isVideoReady={false}
            placeholderProvider={<Image aria-label="Local video preview image" {...imageProps} />}
          />
        )}
        <Stack horizontal>
          {'Toggle Video'}
          <Toggle
            checked={localPreviewOn}
            disabled={!selectedVideoDevice}
            onChange={onToggleVideo}
            ariaLabel="Video Icon"
          />
        </Stack>
        <Stack horizontal>
          {'Toggle Microphone'}
          <Toggle
            checked={microphoneOn}
            disabled={!selectedAudioDevice}
            onChange={onToggleMicrophone}
            ariaLabel="Microphone Icon"
          />
        </Stack>
      </Stack>
      <Stack>
        <TextField
          autoComplete="off"
          ariaLabel="Choose your name"
          onChange={onNameTextChange}
          id="name"
          placeholder="Enter your name"
          errorMessage={invalidDisplayName ? <div role="alert"> DisplayName empty or too long </div> : undefined}
        />
        <Dropdown
          placeholder={defaultPlaceHolder}
          label={cameraLabel}
          options={getDropDownList(videoDevices)}
          disabled={videoDevices.length === 0}
          defaultSelectedKey={
            selectedVideoDevice ? selectedVideoDevice.id : videoDevices.length > 0 ? videoDevices[0].id : ''
          }
          onChange={onVideoDeviceChange}
        />
        <Dropdown
          placeholder={defaultPlaceHolder}
          label={micLabel}
          disabled={audioDevices.length === 0}
          options={getDropDownList(audioDevices)}
          defaultSelectedKey={selectedAudioDevice ? selectedAudioDevice.id : ''}
          onChange={onAudioDeviceChange}
        />
        <PrimaryButton disabled={invalidDisplayName || !displayName} onClick={onStartCall}>
          {'Start call'}
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
