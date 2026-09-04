'use client';

import React, { useLayoutEffect, useState } from 'react';

import { FormGroup, FormGroupOptions, FormGroupValues } from '../control-forms';
import { ControlObserverOptions, TrackResult } from './control-observer';
import { ControlOrFactory } from './types';
import { useControlObserver } from './use-control-observer';


export type UserFormGroupOptions<TControl extends FormGroup> =
  (TControl extends FormGroup<infer TFields> ? FormGroupOptions<FormGroupValues<TFields>> : never)
  & ControlObserverOptions<TControl>;

export type FormGroupTrackResult<TControl extends FormGroup> = TrackResult<TControl> & {
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
};

export function useFormGroup<TControl extends FormGroup>(
  controlOrFactory: ControlOrFactory<TControl>,
  options?: UserFormGroupOptions<TControl>,
): FormGroupTrackResult<TControl> {
  const [control] = useState(controlOrFactory);

  const [additionalProps] = useState(() => {
    return {
      onSubmit: (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        event?.stopPropagation();

        control.submit();
      },
    } as const;
  });

  useLayoutEffect(() => {
    if (options) {
      control.setOptions(options);
    }
  }, [control, options]);

  const trackResult = useControlObserver(control, options);

  for (const key in additionalProps) {
    Object.defineProperty(trackResult, key, {
      configurable: false,
      enumerable: true,
      value: additionalProps[key as keyof typeof additionalProps],
    });
  }

  return trackResult as FormGroupTrackResult<TControl>;
}
