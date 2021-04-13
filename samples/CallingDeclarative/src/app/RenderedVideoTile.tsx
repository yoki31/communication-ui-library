// © Microsoft Corporation. All rights reserved.

import { LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { StreamMedia, VideoTile } from '@azure/communication-ui';
import React, { useCallback, useState } from 'react';

const VIDEO_OFF = 0;
const VIDEO_RENDERING = 1;
const VIDEO_ON = 2;

export interface RenderedVideoTileProps {
  displayName: string;
  stream?: LocalVideoStream | RemoteVideoStream;
  children?: React.ReactNode;
}

export function RenderedVideoTile(props: RenderedVideoTileProps): JSX.Element {
  const { displayName, stream, children } = props;
  const [cachedStream, setCachedStream] = useState<LocalVideoStream | RemoteVideoStream>(stream);
  const [renderer, setRenderer] = useState<VideoStreamRenderer | undefined>(undefined);
  const [videoState, setVideoState] = useState<number>(VIDEO_OFF);
  const [videoView, setVideoView] = useState<HTMLElement | undefined>(undefined);

  const stopRender = useCallback(async () => {
    setVideoState(VIDEO_OFF);
    if (renderer) {
      renderer.dispose();
      setRenderer(undefined);
    }
    setVideoView(undefined);
  }, [renderer]);

  const startRender = useCallback(async () => {
    try {
      setVideoState(VIDEO_RENDERING);
      if (renderer) {
        renderer.dispose();
        setRenderer(undefined);
      }
      const newRenderer = new VideoStreamRenderer(stream);
      setRenderer(newRenderer);
      const renderView = await newRenderer.createView({ scalingMode: 'Crop' });
      setVideoView(renderView.target);
      setVideoState(VIDEO_ON);
    } catch (e) {
      console.error(e);
      stopRender();
    }
  }, [renderer, stream, stopRender]);

  if (cachedStream !== stream) {
    setCachedStream(stream);
    stopRender();
  }

  if (stream && videoState === VIDEO_OFF) {
    startRender();
  }

  if (!stream && videoState === VIDEO_ON) {
    stopRender();
  }

  return (
    <VideoTile
      isVideoReady={videoState === VIDEO_ON}
      videoProvider={<StreamMedia videoStreamElement={videoState === VIDEO_ON && videoView ? videoView : null} />}
      avatarName={displayName}
    >
      {children}
    </VideoTile>
  );
}
