'use client';

import { useState } from 'react';

import { FormArray } from '../control-forms/form';
import { ControlObserverOptions, TrackResult } from './control-observer';
import { ControlOrFactory } from './types';
import { useControlObserver } from './use-control-observer';


export type UseFormArrayOptions<TControl extends FormArray> = ControlObserverOptions<TControl>;

export type FormArrayTrackResult<TControl extends FormArray> = TrackResult<TControl>;

export function useFormArray<TControl extends FormArray>(
  controlOrFactory: ControlOrFactory<TControl>,
  options?: UseFormArrayOptions<TControl>,
): FormArrayTrackResult<TControl> {
  const [control] = useState(controlOrFactory);

  return useControlObserver(control, options);
}
