// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Stack, Image, PrimaryButton } from '@fluentui/react';

import heroSVG from '../assets/hero.svg';

export interface HomeScreenProps {
  startCallHandler: () => void;
}

export function HomeScreen(props: HomeScreenProps): JSX.Element {
  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center">
      <Image alt={'Welcome to the ACS Calling sample app'} src={heroSVG.toString()} />
      <PrimaryButton onClick={props.startCallHandler}>{'Start a Call'}</PrimaryButton>
    </Stack>
  );
}
