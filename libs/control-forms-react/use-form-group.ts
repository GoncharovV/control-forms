'use client';

import { useEffect, useState } from 'react';

import { FormGroup, FormGroupOptions, FormGroupValues } from '../control-forms';
import { ControlObserverOptions, TrackResult } from './control-observer';
import { ControlOrFactory } from './types';
import { useControlObserver } from './use-control-observer';


export type UserFormGroupOptions<TControl extends FormGroup> =
  (TControl extends FormGroup<infer TFields> ? FormGroupOptions<FormGroupValues<TFields>> : never)
  & ControlObserverOptions<TControl>;

export type FormGroupTrackResult<TControl extends FormGroup> = TrackResult<TControl>;

export function useFormGroup<TControl extends FormGroup>(
  controlOrFactory: ControlOrFactory<TControl>,
  options?: UserFormGroupOptions<TControl>,
): FormGroupTrackResult<TControl> {
  const [control] = useState(controlOrFactory);

  useEffect(() => {
    if (options) {
      control.setOptions(options);
    }
  }, [control, options]);

  return useControlObserver(control, options);
}
