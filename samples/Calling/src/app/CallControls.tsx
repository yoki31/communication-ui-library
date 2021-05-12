// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBar, MicrophoneButton, CameraButton, ScreenShareButton, EndCallButton } from 'react-components';
import { useHandlers } from './hooks/useHandlers';
import { usePropsFor } from './hooks/usePropsFor';
import {
  controlBarStyle,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle
} from './styles/CallControls.styles';

export type CallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { compressedMode, onEndCallClick } = props;
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);

  // We want to modify onHangUp however we cannot directly change the return value of useHandlers as it is mutable and
  // if we change it, subsequent calls will return the modified version so we spread it to create a copy and modify the
  // copy.
  const hangUpButtonHandlers = useHandlers(EndCallButton);
  const hangUpButtonHandlersModified = { ...hangUpButtonHandlers };
  hangUpButtonHandlersModified.onHangUp = async () => {
    await hangUpButtonHandlers.onHangUp();
    onEndCallClick();
  };

  return (
    <ControlBar styles={controlBarStyle}>
      <MicrophoneButton {...microphoneButtonProps} />
      <CameraButton {...cameraButtonProps} />
      <ScreenShareButton {...screenShareButtonProps} />
      <EndCallButton
        {...hangUpButtonHandlersModified}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        text={!compressedMode ? 'Leave' : ''}
      />
    </ControlBar>
  );
};
