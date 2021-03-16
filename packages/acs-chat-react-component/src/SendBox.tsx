// © Microsoft Corporation. All rights reserved.

import { EMPTY_MESSAGE_REGEX, MAXIMUM_LENGTH_OF_MESSAGE, TEXT_EXCEEDS_LIMIT } from './constants/constants';
import React, { useState } from 'react';
import { ITextField, Stack, TextField } from '@fluentui/react';
import {
  TextFieldStyleProps,
  sendBoxStyle,
  textFieldStyle,
  sendBoxWrapperStyle,
  sendButtonStyle,
  sendIconDiv
} from './styles/SendBox.styles';
import classNames from 'classnames';
import { Alert } from '@fluentui/react-northstar/dist/commonjs/components/Alert/Alert';

type SendBoxProps = {
  onRenderSystemMessage?: (systemMessage: string | undefined) => React.ReactElement;
  supportNewline?: boolean;
  disabled: boolean;
  systemMessage?: string;
  displayName: string;
  userId: string;
  onSendMessage: (messageContent: string) => Promise<void>;
  onTyping: () => Promise<void>;
};

const defaultOnRenderSystemMessage = (systemMessage: string | undefined): JSX.Element | undefined =>
  systemMessage ? <Alert attached="bottom" content={systemMessage} /> : undefined;

export const SendBoxComponent = (props: SendBoxProps): JSX.Element => {
  const {
    disabled,
    systemMessage,
    supportNewline: supportMultiline,
    onSendMessage,
    onTyping: onSendTypingNotification
  } = props;

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  const onRenderSystemMessage = props.onRenderSystemMessage ?? defaultOnRenderSystemMessage;

  const sendMessageOnClick = (): void => {
    // don't send a message when disabled
    if (disabled || textValueOverflow) {
      return;
    }
    // we dont want to send empty messages including spaces, newlines, tabs
    if (!EMPTY_MESSAGE_REGEX.test(textValue)) {
      onSendMessage(textValue).catch((error) => {
        console.log(error);
      });
      setTextValue('');
    }
    sendTextFieldRef.current?.focus();
  };

  const setText = (e: any): void => {
    if (e.target.value.length > MAXIMUM_LENGTH_OF_MESSAGE) {
      setTextValueOverflow(true);
    } else {
      setTextValueOverflow(false);
    }
    setTextValue(e.target.value);
  };

  const textTooLongMessage = textValueOverflow ? TEXT_EXCEEDS_LIMIT : undefined;

  return (
    <>
      <Stack horizontal={true} className={sendBoxWrapperStyle}>
        <TextField
          multiline
          autoAdjustHeight
          multiple={false}
          resizable={false}
          componentRef={sendTextFieldRef}
          className={textFieldStyle}
          id="sendbox"
          borderless={true}
          ariaLabel={'Type'}
          inputClassName={sendBoxStyle}
          placeholder="Type a new message"
          value={textValue}
          onChange={setText}
          autoComplete="off"
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' && (ev.shiftKey === false || !supportMultiline) && !textValueOverflow) {
              ev.preventDefault();
              sendMessageOnClick();
            }
            onSendTypingNotification().catch((error) => {
              console.log(error);
            });
          }}
          styles={TextFieldStyleProps}
        />

        <div
          className={classNames(sendButtonStyle, 'sendIconWrapper')}
          onClick={(e) => {
            if (!textValueOverflow) {
              sendMessageOnClick();
            }
            e.stopPropagation();
          }}
        >
          <div className={sendIconDiv} />
        </div>
      </Stack>
      {onRenderSystemMessage(systemMessage ? systemMessage : textTooLongMessage)}
    </>
  );
};
