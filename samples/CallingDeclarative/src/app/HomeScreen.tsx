// © Microsoft Corporation. All rights reserved.

import React, { useCallback, useState } from 'react';
import { Stack, Image, PrimaryButton, TextField } from '@fluentui/react';

import heroSVG from '../assets/hero.svg';

export interface HomeScreenProps {
  startCallHandler: (meetingLink: string) => void;
}

export function HomeScreen(props: HomeScreenProps): JSX.Element {
  const [meetingLink, setMeetingLink] = useState('');

  const onMeetingLinkChanged = useCallback((event: any): void => {
    setMeetingLink(event.target.value);
  }, []);

  const onStartCall = useCallback(() => {
    props.startCallHandler(meetingLink);
  }, [props, meetingLink]);

  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center">
      <Image alt={'Welcome to the ACS Calling sample app'} src={heroSVG.toString()} />
      <PrimaryButton onClick={onStartCall}>{'Start a Call'}</PrimaryButton>
      <TextField
        autoComplete="off"
        ariaLabel="MeetingLink"
        onChange={onMeetingLinkChanged}
        id="meetingLink"
        placeholder="Enter meeting link if joining meeting"
      />
    </Stack>
  );
}
