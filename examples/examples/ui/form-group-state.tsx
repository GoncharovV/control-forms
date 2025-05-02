import { FC, memo } from 'react';

import { FormGroup } from '../../../dist';
import { useFormGroup } from '../../../dist/react';


interface FormStateProps {
  form: FormGroup;
}

export const FormGroupState: FC<FormStateProps> = memo(({ form }) => {
  const { isDirty, isFocused, isValid, isTouched, errors, isValidating, value, isSubmitting, api, isLoading } = useFormGroup(form);

  return (
    <div
      style={{
        padding: '1rem',
        borderTop: '1px solid black',
        position: 'relative',
        marginBlockEnd: '1rem',
        marginTop: '50px',
      }}
    >
      <h3
        style={{
          margin: '0',
          padding: '0 5px',
          position: 'absolute',
          top: '-10px',
          background: 'white',
        }}
      >
        Form state
      </h3>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>isDirty: {String(isDirty)}</span>
          <span>isFocused: {String(isFocused)}</span>
          <span>isTouched: {String(isTouched)}</span>
          <span>isValid: {String(isValid)}</span>
          <span>isSubmitting: {String(isSubmitting)}</span>
          <span>isValidating: {String(isValidating)}</span>
          <span>isLoading: {String(isLoading)}</span>
        </div>

        <div style={{ flex: 1 }}>
          {/* <h4>↓ FORM VALUE ↓</h4> */}
          <pre style={{ border: '1px solid gray', padding: '1rem', fontSize: '1rem' }}>
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>


      <p>Form errors: {JSON.stringify(errors)}; {isLoading && <span>loading..</span>}</p>

      <div style={{ display: 'flex', gap: 20 }}>
        <button style={{ padding: 10, fontSize: 20 }} type="button" onClick={api.reset}>reset</button>

        <button style={{ padding: 10, fontSize: 20 }} type="submit" disabled={isLoading}>→ SUBMIT FORM ←</button>
      </div>
    </div>
  );
});

FormGroupState.displayName = 'FormState';
