// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Stack, Image, PrimaryButton } from '@fluentui/react';

import heroSVG from '../assets/hero.svg';

export interface EndScreenProps {
  rejoinCallHandler: () => Promise<void>;
}

export function EndScreen(props: EndScreenProps): JSX.Element {
  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center">
      <Image alt={'Welcome to the ACS Calling sample app'} src={heroSVG.toString()} />
      <PrimaryButton onClick={props.rejoinCallHandler}>{'Rejoin Call'}</PrimaryButton>
    </Stack>
  );
}
