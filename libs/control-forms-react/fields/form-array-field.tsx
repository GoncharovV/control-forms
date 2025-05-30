'use client';

import React, { ReactNode } from 'react';

import { FormArray } from '../../control-forms';
import { TrackResult } from '../control-observer';
import { useFormArray } from '../use-form-array';


export interface FormArrayFieldProps<TControl extends FormArray> {
  control: TControl;

  render?: (data: TrackResult<TControl>) => ReactNode;
  children?: (data: TrackResult<TControl>) => ReactNode;
}

function _FormArrayField<TControl extends FormArray>(props: FormArrayFieldProps<TControl>): ReactNode {
  const { control, children, render } = props;

  const data = useFormArray(control);

  const renderer = children ?? render;

  return renderer?.(data);
}

(_FormArrayField as React.FC).displayName = 'FormArrayField';

export const FormArrayField = React.memo(_FormArrayField) as typeof _FormArrayField;
