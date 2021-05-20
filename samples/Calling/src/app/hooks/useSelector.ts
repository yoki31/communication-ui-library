// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, StatefulCallClient } from 'calling-stateful-client';
import { useCall, useCallClient } from 'react-composites';

import { useState, useEffect, useRef, useMemo } from 'react';

export const useSelector = <
  SelectorT extends (state: CallClientState, props: any) => any,
  ParamT extends SelectorT | undefined
>(
  selector: ParamT,
  selectorProps?: Parameters<SelectorT>[1]
): ParamT extends SelectorT ? ReturnType<SelectorT> : undefined => {
  const callClient: StatefulCallClient = useCallClient() as any;
  const callId = useCall()?.id;

  const callIdConfigProps = useMemo(
    () => ({
      callId
    }),
    [callId]
  );

  const [props, setProps] = useState(
    selector && callClient ? selector(callClient.getState(), selectorProps ?? callIdConfigProps) : undefined
  );
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    if (!selector || !callClient) return;
    const onStateChange = (state: CallClientState): void => {
      const newProps = selector(state, selectorProps ?? callIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps, callIdConfigProps, callId]);
  return selector ? props : undefined;
};
