import { useEffect, useState, useSyncExternalStore } from 'react';

import { AbstractControl } from '../control-forms';
import { ControlObserver, ControlObserverOptions } from './control-observer';


export function useControlObserver<TControl extends AbstractControl>(control: TControl, options?: ControlObserverOptions<TControl>) {
  const [observer] = useState(() => new ControlObserver(control, options));

  useSyncExternalStore(
    observer.subscribe,
    observer.getCurrentSnapshot,
    observer.getCurrentSnapshot,
  );

  useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);

  return observer.trackResult();
}
