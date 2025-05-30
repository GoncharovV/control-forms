'use client';

import React, { ReactNode } from 'react';

import { FormControl } from '../../control-forms';
import { FormControlTrackResult, useFormControl } from '../use-form-control';


// TODO: add notifyOnChangeProps
export interface FormControlFieldProps<TControl extends FormControl> {
  control: TControl;

  children: (data: FormControlTrackResult<TControl>) => ReactNode;
}

function _FormControlField<TControl extends FormControl>(props: FormControlFieldProps<TControl>): ReactNode {
  const { control, children } = props;

  const data = useFormControl(control);

  return children(data);
}

(_FormControlField as React.FC).displayName = 'FormControlField';

export const FormControlField = React.memo(_FormControlField) as typeof _FormControlField;
