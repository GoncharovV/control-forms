# Base Form Example


1. Создадим простую форму из двух полей: `name` и `lastName`. Сразу вынесем это действие в функцию-фабрику


```ts
function createBaseForm() {
  return new FormGroup(
    {
      name: new FormControl(''),
      lastName: new FormControl(''),
    },
  );
}
```

2. Добавим для `name` **валидацию минимальной длины строки**

```ts
function createBaseForm() {
  return new FormGroup(
    {
      name: new FormControl('123', {
        validators: [z.string().max(3)], // [!code ++]
        mode: 'onSubmit', // [!code ++]
      }),
      lastName: new FormControl(''),
    },
  );
}
```

::: info
`mode: 'onSubmit'` – поведение по умолчанию для любого `FormControl` внутри `FormGroup`, его можно не указывать 
:::

3. Используем форму в `React`-компоненте при помощи хука `useFormGroup`.
Оборачиваем `<input />` в `FormControlField` и регистрируем

```tsx
export const FormExample: FC = () => {
  const { fields } = useFormGroup(createBaseForm);

  return (
    <form>
      <FormControlField control={fields.name}>
        {({ register }) => <input {...register()} />}
      </FormControlField>


      <FormControlField control={fields.lastName}>
        {({ register }) => <input {...register()} />}
      </FormControlField>
    </form>
  );
};
```

4. Подпишемся на отправку формы

```tsx
export const FormExample: FC = () => {
  const { fields } = useFormGroup(
    createBaseForm,
    {
      onValidSubmit: (data) => console.log('VALID SUBMIT. DATA:', JSON.stringify(data)), // [!code ++]
      onAnySubmit: () => console.log('ANY SUBMIT ATTEMPT'), // [!code ++]
    },
  );

  ...
```

5. Добавим обработчик `onSubmit` на `<form />`, воспользовавшись `api`

```tsx{10}
const { fields } = useFormGroup(...) // [!code --]
const { fields, api } = useFormGroup(...) // [!code ++]

...

<form> {/* [!code --] */}
<form onSubmit={api.onSubmit}> {/* [!code ++] */}

  <button
    onClick={api.submit}
  >
    Manual submit
  </button>
</form>
```

:::tip Обратите внимание
`api.submit()` - просто вызовет отправку формы

`api.onSubmit(event)` - ожидает `event`, и автоматически вызовет `preventDefault()`
:::

6. Добавим обратной связи. Если пользователь отправил форму и получил ошибку валидации,
переключим поле `name` из режима валидации `onSubmit` на `onChange`. Сделать это крайне просто

```tsx
const { fields, api } = useFormGroup(
  createBaseForm,
  {
    onValidSubmit: (data) => console.log('VALID SUBMIT. DATA:', JSON.stringify(data)),
    onAnySubmit: () => console.log('ANY SUBMIT ATTEMPT'),

    onInvalidSubmit: () => { // [!code ++]
      console.log('INVALID SUBMIT'); // [!code ++]

      // После неудачной отправки, меняем режим валидации
      fields.name.setValidationMode('onChange'); // [!code ++]
    },
  },
);
```

## Результат

::: tip Styling
Добавим CSS и вывод информации о состоянии контролов и формы на экран. Получаем итоговую форму.
:::



<div ref="el" />

<script setup>
import { ref, onMounted } from 'vue'
import { renderBaseExample } from '../../../examples/examples/base-example'

const el = ref()

onMounted(() => renderBaseExample(el.value))
</script>

## Код примера

```tsx
function createBaseForm() {
  return new FormGroup(
    {
      name: new FormControl('123', {
        validators: [z.string().max(3)],
        mode: 'onSubmit',
      }),
      lastName: new FormControl(''),
    },
  );
}

export const FormExample: FC = () => {
  const { fields, api } = useFormGroup(
    createBaseForm,
    {
      onValidSubmit: (data) => console.log('VALID SUBMIT. DATA:', JSON.stringify(data)),
      onAnySubmit: () => console.log('ANY SUBMIT ATTEMPT'),

      onInvalidSubmit: () => {
        console.log('INVALID SUBMIT');

        // После неудачной отправки, меняем режим валидации
        fields.name.setValidationMode('onChange');
      },
    },
  );

  return (
    <form onSubmit={api.onSubmit}>
      <FormControlField control={fields.name}>
        {({ register }) => <input {...register()} />}
      </FormControlField>


      <FormControlField control={fields.lastName}>
        {({ register }) => <input {...register()} />}
      </FormControlField>

      <button type="submit">submit</button>
    </form>
  );
};
```
