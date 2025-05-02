'use client';

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { ControlValue, FormControl, FormControlOptions } from '../control-forms';
import { ControlObserver, ControlObserverOptions, TrackResult } from './control-observer';
import { ControlOrFactory } from './types';


type ValueChangeEvent = React.ChangeEvent<HTMLElement & { value: string; }>;


type Register<TValue = any> = () => {
  onChange: (value: ValueChangeEvent) => void;
  onFocus: FormControl<TValue>['onFocus'];
  onBlur: FormControl<TValue>['onBlur'];

  value: FormControl<TValue>['value'];
  disabled: FormControl<TValue>['isDisabled'];

  ref: (el: HTMLElement | null) => void;
};


export type FormControlTrackResult<TControl extends FormControl> = TrackResult<TControl> & { register: Register<ControlValue<TControl>>; };

export type UseFormControlOptions<TControl extends FormControl> =
  (TControl extends FormControl<infer TValue> ? FormControlOptions<TValue> : never)
  & ControlObserverOptions<TControl>;

export function useFormControl<TControl extends FormControl>(
  controlOrFactory: ControlOrFactory<TControl>,
  options?: UseFormControlOptions<TControl>,
): FormControlTrackResult<TControl> {
  const [control] = useState(controlOrFactory);

  useEffect(() => {
    if (options) {
      control.setOptions(options);
    }
  }, [control, options]);


  const [observer] = useState(() => new ControlObserver(control, options));

  useSyncExternalStore(
    observer.subscribe,
    observer.getCurrentSnapshot,
    observer.getCurrentSnapshot,
  );

  const trackedResult = observer.trackResult() as FormControlTrackResult<TControl>;

  const register: Register<ControlValue<TControl>> = useCallback(() => {
    observer.trackProp('value');
    observer.trackProp('isDisabled');

    return {
      onChange: (event: ValueChangeEvent) => control.onChange(event.target.value),
      onFocus: control.onFocus,
      onBlur: control.onBlur,

      value: control.value,
      disabled: control.isDisabled,

      ref: control.setElement,
    };
  }, [control, observer]);


  Object.defineProperty(trackedResult, 'register', {
    configurable: false,
    enumerable: true,
    get: () => register,
  });

  return trackedResult;
}
