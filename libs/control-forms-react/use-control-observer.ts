import { useLayoutEffect, useState, useSyncExternalStore } from 'react';

import { AbstractControl } from '../control-forms';
import { ControlObserver, ControlObserverOptions, TrackResult } from './control-observer';
import { getControlApi } from './snapshot';


export function useControlObserver<TControl extends AbstractControl>(control: TControl, options?: ControlObserverOptions<TControl>) {
  const [observer] = useState(() => new ControlObserver(control, options));

  useSyncExternalStore(
    observer.subscribe,
    observer.getCurrentSnapshot,
    observer.getCurrentSnapshot,
  );

  useLayoutEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);


  return observer.trackResult(getControlApi(control) as TrackResult<TControl>);
}
