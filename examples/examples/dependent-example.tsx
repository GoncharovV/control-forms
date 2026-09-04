import { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { FormControl, FormGroup } from '../../libs/control-forms';
import { useFormGroup } from '../../libs/control-forms-react';
import { FormGroupState } from './ui/form-group-state';
import { Input } from './ui/input';

import './styles.css';

// TODO: Example with this
// const asyncValidator = z.string().refine(() => {
//   return new Promise<boolean>((res) => setTimeout(() => res(true), 1_000));
// });

export const DependentFormExample: FC = () => {
  const { onSubmit, fields, instance } = useFormGroup(() => {
    return new FormGroup(
      {
        count: new FormControl('', {
          onUpdate: (value) => {
            if (!fields.countX2.isTouched)
              fields.countX2.setValue((Number(value) * 2).toString());
          },
        }),
        countX2: new FormControl('', { isDisabled: false }),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="example-form">
      {/* <h1>DEPENDENT FORM FIELDS</h1> */}

      {/* TODO: make input[type=number] */}
      <Input control={fields.count} placeholder="Count" description="Count" />

      <Input control={fields.countX2} placeholder="Count * 2" description="Count * 2" />

      <FormGroupState form={instance} />
    </form>
  );
};

export function renderDependentFormExample(element: Element) {
  const root = createRoot(element);

  root.render(<DependentFormExample />);
}
