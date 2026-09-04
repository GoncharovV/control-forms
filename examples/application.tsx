import { useState } from 'react';

import { FormArrayExample } from './examples/array-example';
import { FormExample } from './examples/base-example';
import { DependentFormExample } from './examples/dependent-example';
import { NestedFormExample } from './examples/nested-example';
import { ValidationExample } from './examples/validation-example';

import './index.css';


export const Application = () => {
  const [page, setPage] = useState(localStorage.getItem('page') ?? 'base');

  localStorage.setItem('page', page);

  return (
    <>
      <aside>
        <p onClick={() => setPage('base')}>Base Form</p>
        <p onClick={() => setPage('dependent')}>Dependent Fields</p>
        <p onClick={() => setPage('array')}>Form Array</p>
        <p onClick={() => setPage('nested')}>Nested Form</p>
        <p onClick={() => setPage('validation')}>Validation Form</p>
      </aside>

      <main>
        {page === 'base' && <FormExample />}
        {page === 'dependent' && <DependentFormExample />}
        {page === 'array' && <FormArrayExample />}
        {page === 'nested' && <NestedFormExample />}
        {page === 'validation' && <ValidationExample />}
      </main>
    </>
  );
};
