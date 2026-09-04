import React, { FC } from 'react';

import { FormControl } from '../../../libs/control-forms';
import { useFormControl } from '../../../libs/control-forms-react';


interface InputProps {
  control: FormControl<string>;
  placeholder?: string;
  description?: string;
}

export const Input: FC<InputProps> = React.memo((props) => {
  const { control, placeholder, description } = props;

  const data = useFormControl(control);

  const { errors, isValid, isDirty, isTouched, isFocused, isValidating } = data;


  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid black',
        position: 'relative',
        marginBlockEnd: '1rem',
      }}
    >
      <h4
        style={{
          margin: '0',
          padding: '0 5px',
          position: 'absolute',
          top: '-10px',
          background: 'white',
        }}
      >
        Form control
      </h4>

      {description && <p style={{ margin: 0 }}>{description}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <input
            value={data.value}
            onChange={data.onChange}
            onFocus={data.onFocus}
            onBlur={data.onBlur}
            ref={data.ref}
            disabled={data.disabled}
            placeholder={placeholder}
            type="text"
            style={{
              fontSize: '1.5rem',
              padding: '5px 8px',
              borderRadius: '0.5rem',
              outline: 'none',
              marginRight: '10px',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor: !isValid ? 'red' : isFocused ? 'blue' : 'black',
            }}
          />

          <p style={{ marginBottom: 0, maxWidth: 200 }}>
            <span style={{ marginRight: 10 }}>
              Errors: {JSON.stringify(errors)}
            </span>
            {isValidating && <span>validating...</span>}
          </p>
        </div>

        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 5, width: 200 }}>
          <span>isDirty: {String(isDirty)}</span>
          <span>isFocused: {String(isFocused)}</span>
          <span>isTouched: {String(isTouched)}</span>
          <span>isValid: {String(isValid)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '120px' }}>
          <button type="button" onClick={data.focus}>focus</button>
          <button type="button" onClick={data.reset}>reset</button>
          <button type="button" onClick={data.markAllAsDirty}>markAsDirty</button>
          <button type="button" onClick={data.markAllAsTouched}>markAsTouched</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '120px' }}>
          <button type="button" onClick={data.validate}>validate</button>
          <button type="button" onClick={data.disable}>disable</button>
          <button type="button" onClick={data.enable}>enable</button>
        </div>
      </div>


    </div>
  );
});

Input.displayName = 'Input';


export const NumberInput: FC<{
  control: FormControl<number | undefined>;
  placeholder?: string;
  description?: string;
}> = React.memo((props) => {
  const { control, placeholder, description } = props;

  const data = useFormControl(control);

  const { errors, isValid, isDirty, isTouched, isFocused, isValidating } = data;

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid black',
        position: 'relative',
        marginBlockEnd: '1rem',
      }}
    >
      <h4
        style={{
          margin: '0',
          padding: '0 5px',
          position: 'absolute',
          top: '-10px',
          background: 'white',
        }}
      >
        Form control
      </h4>

      {description && <p style={{ margin: 0 }}>{description}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <input
            value={String(data.value || '')}
            onChange={(e) => data.onValueChange(Number(e.target.value))}
            onFocus={data.onFocus}
            onBlur={data.onBlur}
            ref={data.ref}
            disabled={data.disabled}
            placeholder={placeholder}
            type="text"
            style={{
              fontSize: '1.5rem',
              padding: '5px 8px',
              borderRadius: '0.5rem',
              outline: 'none',
              marginRight: '10px',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor: !isValid ? 'red' : isFocused ? 'blue' : 'black',
            }}
          />

          <p style={{ marginBottom: 0, maxWidth: 200 }}>
            <span style={{ marginRight: 10 }}>
              Errors: {JSON.stringify(errors)}
            </span>
            {isValidating && <span>validating...</span>}
          </p>
        </div>

        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 5, width: 200 }}>
          <span>isDirty: {String(isDirty)}</span>
          <span>isFocused: {String(isFocused)}</span>
          <span>isTouched: {String(isTouched)}</span>
          <span>isValid: {String(isValid)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '120px' }}>
          <button type="button" onClick={data.focus}>focus</button>
          <button type="button" onClick={data.reset}>reset</button>
          <button type="button" onClick={data.markAllAsDirty}>markAsDirty</button>
          <button type="button" onClick={data.markAllAsTouched}>markAsTouched</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '120px' }}>
          <button type="button" onClick={data.validate}>validate</button>
          <button type="button" onClick={data.disable}>disable</button>
          <button type="button" onClick={data.enable}>enable</button>
        </div>
      </div>


    </div>
  );
});

Input.displayName = 'Input';
NumberInput.displayName = 'NumberInput';
