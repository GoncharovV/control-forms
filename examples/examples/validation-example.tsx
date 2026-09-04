import { FC } from 'react';
import { array, z } from 'zod';

import { FormArray, FormControl, FormGroup } from '../../libs/control-forms';
import { FormArrayField, useFormGroup } from '../../libs/control-forms-react';
import { FormGroupState } from './ui/form-group-state';
import { NumberInput } from './ui/input';

import './styles.css';


const schema = z.object({
  value: z.number(),
  children: z.object({
    valueX2: z.number(),
    children: z.object({
      valueX3: z.number(),
      array: array(z.number()),
    }),
  }),
}).superRefine((data, ctx) => {
  if (data.value * 2 !== data.children.valueX2) {
    ctx.addIssue({
      code: 'custom',
      message: 'Value X2 must be equal to value * 2',
      path: ['children', 'valueX2'],
    });
  }

  if (data.value * 3 !== data.children.children.valueX3) {
    ctx.addIssue({
      code: 'custom',
      message: 'Value X3 must be equal to value * 3',
      path: ['children', 'children', 'valueX3'],
    });
  }
});


function createBaseForm() {
  return new FormGroup(
    {
      value: new FormControl<number | undefined>(undefined),
      children: new FormGroup({
        valueX2: new FormControl<number | undefined>(undefined),
        children: new FormGroup({
          valueX3: new FormControl<number | undefined>(undefined),
          array: new FormArray([
            new FormControl(undefined),
            new FormControl(undefined),
          ]),
        }),
      }),
    },
    {
      validators: [schema],
    },
  );
}


export const ValidationExample: FC = () => {
  const { onSubmit, fields, instance } = useFormGroup(
    createBaseForm,
    {
      onValidSubmit: (data) => console.log('VALID SUBMIT. DATA:', JSON.stringify(data)),
    },
  );

  return (
    <form onSubmit={onSubmit} className="example-form">
      <NumberInput control={fields.value} placeholder="Value" />

      <NumberInput control={fields.children.fields.valueX2} placeholder="Value X2" />

      <NumberInput control={fields.children.fields.children.fields.valueX3} placeholder="Value X3" />

      <FormArrayField control={fields.children.fields.children.fields.array}>
        {({ controls }) => controls.map((control, index) => <NumberInput key={index} control={control} placeholder={`Array (${index})`} />)}
      </FormArrayField>

      <FormGroupState form={instance} />
    </form>
  );
};
