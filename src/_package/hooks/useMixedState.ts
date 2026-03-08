'use client';

import { useEffect, useMemo, useState } from 'react';




type StateSetter<S> = React.Dispatch<React.SetStateAction<S>>;
type InitialState<S> = S | (() => S);

export default function useMixedState<S = undefined>(): [S | undefined, StateSetter<S | undefined>];
export default function useMixedState<S>(initialState: InitialState<S>): [S, StateSetter<S>];
export default function useMixedState<S>(state: S, setter?: StateSetter<S>): [S, StateSetter<S>];



/** 
 * Use mixed state hook
 * 
 * @param initialStateOrValue Initial state, can be undefined, value or function. If externalSetter not specified, will return default state
 * @param externalSetter External state setter. If specified will return external state
 */
export default function useMixedState<S>(initialStateOrValue?: InitialState<S>, externalSetter?: StateSetter<S>) {
  const isControlled = useMemo(() => arguments.length === 2 && externalSetter !== undefined, []);

  const [state, setter] = useState<S | undefined>(initialStateOrValue);



  // Propagate state update on external state update even if external setter is not provided
  useEffect(() => {
    if (!isControlled) {
       
      setter(initialStateOrValue);
    }
  }, [initialStateOrValue]);



  if (isControlled) {
    return [
      initialStateOrValue as S,
      externalSetter as StateSetter<S>
    ];
  }

  return [state, setter];
}