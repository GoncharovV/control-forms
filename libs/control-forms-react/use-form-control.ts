'use client';

import React, { useState } from 'react';

import { FormControl, FormControlOptions } from '../control-forms';
import { ControlObserverOptions, TrackResult } from './control-observer';
import { ControlOrFactory } from './types';
import { useControlObserver } from './use-control-observer';


type ValueChangeEvent = React.ChangeEvent<HTMLElement & { value: string; }>;

export type FormControlTrackResult<TControl extends FormControl> = TrackResult<TControl> & {
  ref: (el: HTMLElement | null) => void;
  disabled: boolean;

  onChange: (value: ValueChangeEvent) => void;
  onValueChange: (value: TControl extends FormControl<infer TValue> ? TValue : never) => void;
};

export type UseFormControlOptions<TControl extends FormControl> =
  (TControl extends FormControl<infer TValue> ? FormControlOptions<TValue> : never)
  & ControlObserverOptions<TControl>;

export function useFormControl<TControl extends FormControl>(
  controlOrFactory: ControlOrFactory<TControl>,
  options?: UseFormControlOptions<TControl>,
): FormControlTrackResult<TControl> {
  const [control] = useState(controlOrFactory);

  const [additionalProps] = useState(() => {
    return {
      onValueChange: (value: TControl extends FormControl<infer TValue> ? TValue : never) => control.onChange(value),
      ref: (el: HTMLElement | null) => control.setElement(el),
      // @ts-expect-error redefine onChange to be suitable for event
      onChange: (event: ValueChangeEvent) => control.onChange(event.target.value),
    } as const satisfies Record<keyof Omit<FormControlTrackResult<FormControl>, keyof TrackResult<FormControl>>, any>;
  });

  const trackedResult = useControlObserver(control, options);

  Object.defineProperty(trackedResult, 'disabled', {
    configurable: false,
    enumerable: true,
    get: () => control.isDisabled,
  });

  for (const key in additionalProps) {
    Object.defineProperty(trackedResult, key, {
      configurable: false,
      enumerable: true,
      value: additionalProps[key as keyof typeof additionalProps],
    });
  }

  return trackedResult as FormControlTrackResult<TControl>;
}
