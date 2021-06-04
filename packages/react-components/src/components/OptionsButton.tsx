// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import {
  ContextualMenuItemType,
  DefaultButton,
  IButtonProps,
  Label,
  concatStyleSets,
  mergeStyles,
  IContextualMenuItem
} from '@fluentui/react';
import { MoreIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Props for OptionsButton component
 */
export interface OptionsButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility props for stateful props.
   */
  microphones?: [{ id: string; name: string }];
  speakers?: [{ id: string; name: string }];
  cameras?: [{ id: string; name: string }];
  selectedMicrophone?: { id: string; name: string };
  selectedSpeaker?: { id: string; name: string };
  selectedCamera?: { id: string; name: string };
  onSelectCamera?: (device: any) => Promise<void>;
  onSelectMicrophone?: (device: any) => Promise<void>;
  onSelectSpeaker?: (device: any) => Promise<void>;
}

/**
 * Generates default menuprops for an OptionsButton if the props contain device
 * information and device change handlers.
 * @param props OptionsButtonProps
 * @returns MenuProps
 */
const generateDefaultMenuProps = (props: OptionsButtonProps): { items: Array<any> } => {
  const {
    microphones,
    speakers,
    cameras,
    selectedMicrophone,
    selectedSpeaker,
    selectedCamera,
    onSelectCamera,
    onSelectMicrophone,
    onSelectSpeaker
  } = props;

  const defaultMenuProps: { items: Array<IContextualMenuItem> } = { items: [] };

  if (cameras && selectedCamera && onSelectCamera) {
    defaultMenuProps.items.push({
      key: 'sectionCamera',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        items: cameras.map((camera) => ({
          key: `camera${camera.id}`,
          text: camera.name,
          title: camera.name,
          iconProps: { iconName: 'Camera' },
          canCheck: true,
          isChecked: camera.id === selectedCamera?.id,
          onClick: () => {
            !(camera.id === selectedCamera?.id) && onSelectCamera(camera);
          }
        })),
        title: 'Camera'
      }
    });
  }

  if (microphones && selectedMicrophone && onSelectMicrophone) {
    defaultMenuProps.items.push({
      key: 'sectionMicrophone',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        items: microphones.map((microphone) => ({
          key: `microphone${microphone.id}`,
          text: microphone.name,
          title: microphone.name,
          iconProps: { iconName: 'Microphone' },
          canCheck: true,
          isChecked: microphone.id === selectedMicrophone?.id,
          onClick: () => {
            !(microphone.id === selectedMicrophone?.id) && onSelectMicrophone(microphone);
          }
        })),
        title: 'Microphone'
      }
    });
  }

  if (speakers && selectedSpeaker && onSelectSpeaker) {
    defaultMenuProps.items.push({
      key: 'sectionSpeaker',
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        items: speakers.map((speaker) => ({
          key: `speaker${speaker.id}`,
          text: speaker.name,
          title: speaker.name,
          iconProps: { iconName: 'Volume2' },
          canCheck: true,
          isChecked: speaker.id === selectedSpeaker?.id,
          onClick: () => {
            !(speaker.id === selectedSpeaker?.id) && onSelectSpeaker(speaker);
          }
        })),
        title: 'Speaker'
      }
    });
  }

  return defaultMenuProps;
};

/**
 * `OptionsButton` allows you to easily create a component for rendering an options button. It can be used in your ControlBar component for example.
 * This button should contain dropdown menu items you can define through its property `menuProps`.
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type OptionsButtonProps
 */
export const OptionsButton = (props: OptionsButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultMenuProps = generateDefaultMenuProps(props);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <MoreIcon key={'optionsIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'optionsLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {'Settings'}
      </Label>
    );
  };

  return (
    <DefaultButton
      {...props}
      menuProps={props.menuProps ?? defaultMenuProps}
      menuIconProps={{ hidden: true }}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
