// © Microsoft Corporation. All rights reserved.

import { AudioDeviceInfo, LocalVideoStream, Renderer, VideoDeviceInfo } from '@azure/communication-calling';
import { StreamMedia, VideoTile } from '@azure/communication-ui';
import { Stack, TextField, Image, ImageFit, Dropdown, IDropdownOption, Toggle, PrimaryButton } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import staticMediaSVG from '../assets/staticmedia.svg';

const imageProps = {
  src: staticMediaSVG.toString(),
  imageFit: ImageFit.contain,
  maximizeFrame: true
};

const defaultPlaceHolder = 'Select an option';
const cameraLabel = 'Camera';
const micLabel = 'Microphone';

const VIDEO_OFF = 0;
const VIDEO_RENDERING = 1;
const VIDEO_ON = 2;

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
  const [renderer, setRenderer] = useState<Renderer | undefined>(undefined);
  const [videoState, setVideoState] = useState<number>(VIDEO_OFF);
  const [videoView, setVideoView] = useState<HTMLElement | undefined>(undefined);
  const [microphoneOn, setMicrophoneOn] = useState<boolean>(false);

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
    },
    [videoDevices]
  );

  const onAudioDeviceChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
      selectMicrophone(audioDevices[index ?? 0]);
    },
    [selectMicrophone, audioDevices]
  );

  const onStartCall = useCallback(() => {
    startCallHandler(displayName, videoState === VIDEO_ON, microphoneOn, selectedVideoDevice);
  }, [startCallHandler, displayName, videoState, microphoneOn, selectedVideoDevice]);

  const stopLocalPreview = useCallback(async () => {
    setVideoState(VIDEO_OFF);
    if (renderer) {
      renderer.dispose();
      setRenderer(undefined);
    }
    setVideoView(undefined);
  }, [renderer]);

  const startLocalPreview = useCallback(async () => {
    try {
      setVideoState(VIDEO_RENDERING);
      if (renderer) {
        renderer.dispose();
        setRenderer(undefined);
      }
      const newRenderer = new Renderer(new LocalVideoStream(selectedVideoDevice));
      setRenderer(newRenderer);
      const renderView = await newRenderer.createView({ scalingMode: 'Crop' });
      setVideoView(renderView.target);
      setVideoState(VIDEO_ON);
    } catch (e) {
      console.error(e);
      stopLocalPreview();
    }
  }, [renderer, selectedVideoDevice, stopLocalPreview]);

  const onToggleVideo = useCallback(() => {
    if (videoState === VIDEO_OFF && selectedVideoDevice) {
      startLocalPreview();
    } else {
      stopLocalPreview();
    }
  }, [videoState, selectedVideoDevice, startLocalPreview, stopLocalPreview]);

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
        <VideoTile
          isVideoReady={videoState === VIDEO_ON}
          videoProvider={<StreamMedia videoStreamElement={videoState === VIDEO_ON && videoView ? videoView : null} />}
          placeholderProvider={<Image aria-label="Local video preview image" {...imageProps} />}
        />
        <Stack horizontal>
          {'Toggle Video'}
          <Toggle
            checked={videoState === VIDEO_ON}
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
          defaultSelectedKey={videoDevices.length > 0 ? videoDevices[0].id : ''}
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
