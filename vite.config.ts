/// <reference types="vitest/config" />
import * as path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

export default defineConfig({
  plugins: [react()],
  root: 'examples',

  test: {
    root: 'tests',
    globals: true,
    typecheck: {
      tsconfig: tsconfigPath,
    },
  },
});
