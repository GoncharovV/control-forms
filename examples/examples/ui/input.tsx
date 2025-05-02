import React, { FC } from 'react';

import { FormControl } from '../../../libs/control-forms';
import { FormControlTrackResult } from '../../../libs/control-forms-react';


interface InputProps {
  data: FormControlTrackResult<FormControl>;
  description?: string;
}

export const Input: FC<InputProps> = React.memo(({ data: control, description }) => {
  const { api, errors, register, isValid, isDirty, isTouched, isFocused, isValidating } = control;

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
            {...register()}
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
          <button type="button" onClick={api.focus}>focus</button>
          <button type="button" onClick={api.reset}>reset</button>
          <button type="button" onClick={api.markAllAsDirty}>markAsDirty</button>
          <button type="button" onClick={api.markAllAsTouched}>markAsTouched</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '120px' }}>
          <button type="button" onClick={api.validate}>validate</button>
          <button type="button" onClick={api.disable}>disable</button>
          <button type="button" onClick={api.enable}>enable</button>
        </div>
      </div>


    </div>
  );
});

Input.displayName = 'Input';
