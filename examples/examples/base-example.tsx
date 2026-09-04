import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FormControl, FormGroup } from '../../libs/control-forms';
import { useFormGroup } from '../../libs/control-forms-react';
import { FormGroupState } from './ui/form-group-state';
import { Input } from './ui/input';

import './styles.css';


function createBaseForm() {
  return new FormGroup(
    {
      name: new FormControl('123', {
        validators: [z.string().max(3)],
        mode: 'onSubmit',

      }),
      lastName: new FormControl(''),
    },
  );
}


export const FormExample: FC = () => {
  const { onSubmit, fields, instance } = useFormGroup(
    createBaseForm,
    {
      onValidSubmit: (data) => console.log('VALID SUBMIT. DATA:', JSON.stringify(data)),
      onAnySubmit: () => console.log('ANY SUBMIT ATTEMPT'),

      onInvalidSubmit: () => {
        console.log('INVALID SUBMIT');

        // После неудачной отправки, меняем режим валидации
        fields.name.setValidationMode('onChange');
      },
    },
  );

  return (
    <form onSubmit={onSubmit} className="example-form">
      {/* <h1 style={{ marginBottom: 15 }}>BASE FORM</h1> */}

      <Input control={fields.name} placeholder="Name" description="max len: 3" />

      <Input control={fields.lastName} placeholder="Last Name" description="Last Name" />

      <FormGroupState form={instance} />
    </form>
  );
};

export function renderBaseExample(element: Element) {
  const root = createRoot(element);

  root.render(<FormExample />);
}
