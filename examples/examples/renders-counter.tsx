/* eslint-disable @stylistic/jsx-one-expression-per-line */
import { FC, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { FormControl } from '../../libs/control-forms';
import { useFormControl } from '../../libs/control-forms-react';

import './styles.css';


interface Props {
  control: FormControl<string>;
}

const Input: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { register, api } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>Register input</h5>
      <p>renders: {ref.current}</p>
      <input {...register()} placeholder="text..." />

      <button type="button" onClick={api.reset}>reset</button>
      <button type="button" onClick={api.markAllAsDirty}>markAsDirty</button>
    </div>
  );
};

const ValueMonitor: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { value } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>Only value</h5>
      <p>renders: {ref.current}</p>
      value: {JSON.stringify(value)}
    </div>
  );
};

const FocusMonitor: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { isFocused } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>Focused state</h5>
      <p>renders: {ref.current}</p>
      isFocused: {JSON.stringify(isFocused)}
    </div>
  );
};

const TouchedMonitor: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { isTouched } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>Touched state</h5>
      <p>renders: {ref.current}</p>
      isTouched: {JSON.stringify(isTouched)}
    </div>
  );
};

const AllMonitor: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { api: _, instance: __, ...all } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>All state</h5>
      <p>renders: {ref.current}</p>

      <pre>
        {JSON.stringify(all, null, 2)}
      </pre>
    </div>
  );
};

const DirtyMonitor: FC<Props> = ({ control }) => {
  const ref = useRef(0);

  ref.current++;

  const { isDirty } = useFormControl(control);

  return (
    <div className="wrapper">
      <h5>Dirty state</h5>
      <p>renders: {ref.current}</p>
      isDirty: {JSON.stringify(isDirty)}
    </div>
  );
};

export const RendersCounterExample: FC = () => {
  const [control] = useState(() => new FormControl(''));

  return (
    <div className="renders">
      <Input control={control} />
      <ValueMonitor control={control} />
      <FocusMonitor control={control} />
      <DirtyMonitor control={control} />
      <TouchedMonitor control={control} />
      <AllMonitor control={control} />
    </div>
  );
};


export function renderRenderCounterExample(element: Element) {
  const root = createRoot(element);

  root.render(<RendersCounterExample />);
}
