import { defineConfig } from 'vitepress';
import react from '@vitejs/plugin-react';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Event Forms',
  description: 'Event Forms library',
  base: '/forms-docs-demo/',

  vite: {
    plugins: [react()],
  },


  locales: {
    root: {
      label: 'Russian',
      lang: 'ru',
    },

    ru: {
      label: 'Russian',
      lang: 'ru',
      dir: 'ru',
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Quick Start', link: '/ru/quick-start' },
      { text: 'Examples', link: '/ru/examples/base-form-example' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Quick start 🦺', link: '/ru/quick-start' },
          { text: 'Валидация 🦺', link: '/ru/validation' },
        ],
      },
      {
        text: 'Основы',
        items: [
          { text: 'FormControl', link: '/ru/basics/form-control' },
          { text: 'FormGroup 🏗️', link: '/ru/basics/form-group' },
          { text: 'FormArray 🚧 🏗️', link: '/ru/basics/form-array' },

          { text: 'Валидаторы 🚧 🏗️', link: '' },
        ],
      },

      {
        text: 'Danger Zone 🚧 🏗️',
        items: [
          { text: 'Архитектура 🚧 🏗️', link: '' },
          { text: 'AbstractControl 🚧 🏗️', link: '' },
          { text: 'AbstractControlGroup 🚧 🏗️', link: '' },
        ],
      },

      {
        text: 'Рекомендации 🏗️',
        items: [
          { text: 'Мультиязычные ошибки', link: '/ru/tips/work-with-errors' },
        ],
      },

      {
        text: 'Примеры',
        items: [
          { text: 'Базовая форма', link: '/ru/examples/base-form-example' },
          { text: 'Зависимые поля', link: '/ru/examples/dependent-fields-example' },
          { text: 'Массив полей', link: '/ru/examples/array-form-example' },
          { text: 'Счетчик рендеров', link: '/ru/examples/render-counter-example' },
        ],
      },
    ],

    // TODO:
    socialLinks: [{ icon: 'github', link: 'https://shikimori.one/MolodoyJeGhoul' }],
  },
});
