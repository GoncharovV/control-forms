'use client';

import React, { ReactNode } from 'react';

import { FormArray } from '../../control-forms';
import { TrackResult } from '../control-observer';
import { useFormArray } from '../use-form-array';


export interface FormArrayFieldProps<TControl extends FormArray> {
  control: TControl;

  children: (data: TrackResult<TControl>) => ReactNode;
}

function _FormArrayField<TControl extends FormArray>(props: FormArrayFieldProps<TControl>): ReactNode {
  const { control, children } = props;

  const data = useFormArray(control);

  return children(data);
}

(_FormArrayField as React.FC).displayName = 'FormArrayField';

export const FormArrayField = React.memo(_FormArrayField) as typeof _FormArrayField;
