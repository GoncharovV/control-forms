import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FormControl, FormGroup } from '../../libs/control-forms';
import { FormControlField, useFormGroup } from '../../libs/control-forms-react';
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
  const { api, fields, instance } = useFormGroup(
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
    <form onSubmit={api.onSubmit} className="example-form">
      {/* <h1 style={{ marginBottom: 15 }}>BASE FORM</h1> */}

      <FormControlField control={fields.name}>
        {(data) => <Input data={data} description="max len: 3" />}
      </FormControlField>


      <FormControlField control={fields.lastName}>
        {(data) => <Input data={data} />}
      </FormControlField>

      <FormGroupState form={instance} />
    </form>
  );
};

export function renderBaseExample(element: Element) {
  const root = createRoot(element);

  root.render(<FormExample />);
}
