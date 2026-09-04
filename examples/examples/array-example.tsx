import { FC, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FormArray, FormControl, FormGroup } from '../../libs/control-forms';
import { FormArrayField, useFormGroup } from '../../libs/control-forms-react';
import { FormGroupState } from './ui/form-group-state';
import { Input } from './ui/input';

import './styles.css';


function createArrayForm() {
  return new FormGroup(
    {
      name: new FormControl('name', { validators: [z.string().max(5)] }),

      array: new FormArray([new FormControl('0')]),
    },
  );
}


export const FormArrayExample: FC = () => {
  const { fields, instance, onSubmit } = useFormGroup(createArrayForm);

  const onAddControl = useCallback(() => {
    const index = fields.array.size.toString();

    fields.array.addControl(
      new FormControl(index, { validators: z.string().min(3) }),
    );
  }, [fields.array]);

  return (
    <form onSubmit={onSubmit} className="example-form">
      <h1>ARRAY FORM</h1>

      <Input control={fields.name} placeholder="Name" description="Name" />


      <button type="button" onClick={onAddControl}>ADD CONTROL</button>

      <hr />

      <FormArrayField control={fields.array}>
        {({ controls }) => controls.map((control, inx) => (
          <Input control={control} key={inx} placeholder={`Control ${inx + 1}`} />
        ))}
      </FormArrayField>


      <FormGroupState form={instance} />
    </form>
  );
};

export function renderArrayExample(element: Element) {
  const root = createRoot(element);

  root.render(<FormArrayExample />);
}
