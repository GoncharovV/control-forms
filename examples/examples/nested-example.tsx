import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { array, z } from 'zod';

import { FormArray, FormControl, FormGroup } from '../../libs/control-forms';
import { FormControlField, useFormGroup } from '../../libs/control-forms-react';
import { getControlApi } from '../../libs/control-forms-react/snapshot';
import { FormGroupState } from './ui/form-group-state';
import { Input } from './ui/input';

import './styles.css';


function createNestedForm() {
  return new FormGroup(
    {
      name0: new FormControl('', { validators: [z.string().min(3)] }),
      array0: new FormArray([
        new FormGroup({
          name1: new FormControl('', { validators: [z.string().min(3)] }),
          children2: new FormGroup({
            name2: new FormControl('', { validators: [z.string().min(3)] }),
          }),
        }),
        new FormGroup({
          name1: new FormControl('', { validators: [z.string().min(3)] }),
          children2: new FormGroup({
            name2: new FormControl('', { validators: [z.string().min(3)] }),
          }),
        }),
        new FormGroup({
          name1: new FormControl('', { validators: [z.string().min(3)] }),
          children2: new FormGroup({
            name2: new FormControl('', { validators: [z.string().min(3)] }),
          }),
        }),
        new FormGroup({
          name1: new FormControl('', { validators: [z.string().min(3)] }),
          children2: new FormGroup({
            name2: new FormControl('', { validators: [z.string().min(3)] }),
          }),
        }),
      ]),


    //   children1: new FormGroup({
    //     name1: new FormControl('', { validators: [z.string().min(3)] }),
    //     children2: new FormGroup({
    //       name2: new FormControl('', { validators: [z.string().min(3)] }),
    //     }),
    //   }),
    },
  );
}


export const NestedFormExample: FC = () => {
  const api = useFormGroup(createNestedForm);

  const { fields, instance } = api;

  //   const x = 


  window.form = instance;


  return (
    <form onSubmit={api.onSubmit} className="example-form">

      <button
        type="button"
        style={{ padding: 10, fontSize: 20 }}
        onClick={async () => {
          console.log(await instance.fields.name0.validate());
        }}
      >validate name0
      </button>

      <button
        type="button"
        style={{ padding: 10, fontSize: 20 }}
        onClick={async () => {
          console.log(await instance.validate());
        }}
      >validate form
      </button>

      <button
        type="button"
        style={{ padding: 10, fontSize: 20 }}
        onClick={async () => {
          console.log(instance.issues);
        }}
      >log issues
      </button>
      {/* <h1 style={{ marginBottom: 15 }}>BASE FORM</h1> */}

      {/* <FormControlField control={fields.name}>
        {(data) => <Input data={data} description="max len: 3" />}
      </FormControlField>


      <FormControlField control={fields.lastName}>
        {(data) => <Input data={data} />}
      </FormControlField> */}

      <FormGroupState form={instance} />
    </form>
  );
};
