// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { useCall, useCallClient, useDisplayName, useIdentifier } from 'react-composites';

import { useState, useEffect, useRef, useMemo } from 'react';

export const useSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const callClient: DeclarativeCallClient = useCallClient() as any;
  const callId = useCall()?.id;
  const displayName = useDisplayName();
  const identifier = useIdentifier();

  // Keeps track of whether the current component is mounted or not. If it has unmounted, make sure we do not modify the
  // state or it will cause React warnings in the console.
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  const callIdConfigProps = useMemo(
    () => ({
      callId,
      displayName,
      identifier
    }),
    [callId, displayName, identifier]
  );

  const [props, setProps] = useState(selector(callClient.state, selectorProps ?? callIdConfigProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    const onStateChange = (state: CallClientState): void => {
      if (!mounted.current) {
        return;
      }
      const newProps = selector(state, selectorProps ?? callIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps, callIdConfigProps, mounted]);

  return props;
};
