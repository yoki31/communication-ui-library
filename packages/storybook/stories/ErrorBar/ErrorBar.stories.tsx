// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM @internal/react-compoNENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { ErrorBar as ErrorBarComponent } from '@azure/communication-react';
import { mergeStyles, useTheme } from '@fluentui/react';
import { Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>ErrorBar</Title>
      <Description>
        `ErrorBar` is a wrapper on fluent UI's `MessageBar` with additional features for surfacing Azure Communication
        Services errors on the UI consistently.
      </Description>
      <Description>Set the `showErrorBar` feature for `ChatComposite` to use an `ErrorBar` to show errors.</Description>
      <Subheading>Localization</Subheading>
      <Description>
        Similar to other UI components in this library, `ErrorBarProps` accepts all strings shown on the UI as a
        `strings` field. The `activeErrors` field selects from these strings to show in the `ErrorBar` UI.
      </Description>
      <Subheading>Dismissed messages</Subheading>
      <Description>
        User can dismiss the errors shown via `ErrorBar`. The `ErrorBar` component internally tracks dismissed errors
        and only shows a `MessageBar` for errors that have not been dismissed. When `activeErrors` include a timestamp,
        errors that occur after the latest dismissal are shown on the UI. When `activeErrors` do not include a timestamp
        a dismissed error is only shown on the UI if it is removed from the active errors and then occurs again.
      </Description>
      <Description>
        This way, `ErrorBar` separates the tracking of active errors from the purely UI related state of `ErrorBar`
        dismissals.
      </Description>
      <Subheading>Multiple errors</Subheading>
      <Description>
        More than one error can occur at the same time. The `ErrorBar` component can show multiple active errors. To
        avoid confusing the user, it is important to be mindful to limit the total number of errors that are shown
        together.
      </Description>
      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBarComponent} />
    </>
  );
};

const ErrorBarStory = (args): JSX.Element => {
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      <ErrorBarComponent activeErrors={args.errorTypes.map((t) => ({ type: t, timestamp: new Date(Date.now()) }))} />
    </div>
  );
};

export const ErrorBar = ErrorBarStory.bind({});

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Error Bar`,
  component: ErrorBarComponent,
  argTypes: {
    errorTypes: controlsToAdd.errorTypes,
    // Hiding auto-generated controls
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
