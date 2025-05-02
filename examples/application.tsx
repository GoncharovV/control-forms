import { useState } from 'react';

import { FormArrayExample } from './examples/array-example';
import { FormExample } from './examples/base-example';
import { DependentFormExample } from './examples/dependent-example';

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
      </aside>

      <main>
        {page === 'base' && <FormExample />}
        {page === 'dependent' && <DependentFormExample />}
        {page === 'array' && <FormArrayExample />}
      </main>
    </>
  );
};
