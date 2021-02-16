// © Microsoft Corporation. All rights reserved.
import { renderHook } from '@testing-library/react-hooks';
import { useMicrophone } from './useMicrophone';
import { CallAgent, PermissionState } from '@azure/communication-calling';
import { defaultMockCallProps, mockCallAgent } from '../mocks';

type MockCallingContextType = {
  callAgent: CallAgent;
  audioDevicePermission: PermissionState;
};

type MockCallContextType = {
  isMicrophoneEnabled: boolean;
  setIsMicrophoneEnabled: jest.Mock<any, any>;
};

let muteExecuted = jest.fn();
let unmuteExecuted = jest.fn();
let setIsMicrophoneEnabledMock = jest.fn();
let microphoneMutedInitialState = false;
let microphonePermissionInitialState: PermissionState = 'Granted';

let mockCallingContext: () => MockCallingContextType;
let mockCallContext: () => MockCallContextType;

jest.mock('../providers', () => {
  return {
    useCallingContext: jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return mockCallingContext();
      }
    ),
    useCallContext: jest.fn().mockImplementation(
      (): MockCallContextType => {
        return mockCallContext();
      }
    )
  };
});

describe('useMicrophone tests', () => {
  const consoleErrorMockInitialValue = console.error;

  beforeEach(() => {
    muteExecuted = jest.fn();
    unmuteExecuted = jest.fn();
    setIsMicrophoneEnabledMock = jest.fn();
    microphoneMutedInitialState = false;
    microphonePermissionInitialState = 'Granted';
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          muteExecutedCallback: muteExecuted,
          unmuteExecutedCallback: unmuteExecuted,
          isMicrophoneMuted: microphoneMutedInitialState
        }) as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
  });

  afterEach(() => {
    // reset any console error mocking
    console.error = consoleErrorMockInitialValue;
  });

  test('if microphone is muted, unmute mic should unmute the microphone', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(unmuteExecuted).toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted in sdk, when calling unmute from hook, unmute should not be called again in sdk', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].isMicrophoneMuted = false;
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted, unmute mic should mute the microphone', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.mute();

    // Assert
    expect(muteExecuted).toHaveBeenCalled();
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is muted in sdk, when calling mute from hook, mute should not be called again in sdk', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].isMicrophoneMuted = true;
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.mute();

    // Assert
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is muted, microphone should be unmuted by calling toggle', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.toggle();

    // Assert
    expect(unmuteExecuted).toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted, microphone should be muted by calling toggle', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.toggle();

    // Assert
    expect(muteExecuted).toHaveBeenCalledTimes(1);
    expect(unmuteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone unmute is called without microphone permission, an error should be logged and sdk unmute call should not be made', async () => {
    // Arrange
    console.error = jest.fn();
    microphoneMutedInitialState = false;
    microphonePermissionInitialState = 'Denied';
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(muteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).not.toHaveBeenLastCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      'Cannot unmute microphone - microphone permission has not been granted.'
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('if call unmute throws an error, useMicrophone is expected to console error when calling unmute', async () => {
    // Arrange
    console.error = jest.fn();
    microphoneMutedInitialState = true;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].unmute = () => {
      return Promise.reject(new Error('unmute failed'));
    };
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('if call mute throws an error, useMicrophone is expected to console error when calling mute', async () => {
    // Arrange
    console.error = jest.fn();
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].mute = () => {
      return Promise.reject(new Error('mute failed'));
    };
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.mute();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
