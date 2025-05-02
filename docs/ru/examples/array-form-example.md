# Форма с массивом полей

:::warning Обратите внимание
Порядок создания и использования форм был подробно разобран в примере с [Базовой формой](./base-form-example)
:::

1. Создадим форму с двумя полями `name: FormControl`, `array: FormArray`

В `array` сразу же добавим один `FormControl` со значением по умолчанию `0`

```ts
function createArrayForm() {
  return new FormGroup(
    {
      name: new FormControl('name', { validators: [z.string().max(5)] }),

      array: new FormArray([new FormControl('0')]),
    },
  );
}
```

2. Используем форму в `React`

Для отображения `array` используем компонент `FormArrayField`. Массив контролов можно получить в поле `controls`

:::warning Обратите внимание
`FormArray` состоит из `FormControl`, поэтому для отображения **каждого из дочерних полей** необходимо использовать `FormControlField`
:::

```tsx
export const FormArrayExample: FC = () => {
  const { api, fields } = useFormGroup(createArrayForm);

  return (
    <form onSubmit={api.onSubmit}>
      <FormControlField control={fields.name}>
        {({ register }) => <input {...register()} />}
      </FormControlField>

      <FormArrayField control={fields.array}>
        {({ controls }) => controls.map((control) => (
          <FormControlField key={control.id} control={control}>
            {({ register }) => <input {...register()} />}
          </FormControlField>
        ))}
      </FormArrayField>
    </form>
  );
};
```

3. Добавление нового поля в массив.

Чтобы добавить в `FormArray` новый контрол, используется метод `addControl(control)`

```ts
const { api, fields } = useFormGroup(createArrayForm);

const onAddControl = useCallback(() => { // [!code ++]
    const index = fields.array.size.toString(); // [!code ++]
    fields.array.addControl(// [!code ++]
        new FormControl(index, { validators: z.string().min(3) }),// [!code ++]
    );// [!code ++]
}, [fields.array]);// [!code ++]
```

## Результат

::: tip Styling
Добавим CSS и вывод информации о состоянии контролов и формы на экран. Получаем итоговую форму.
:::



<div ref="el" />

<script setup>
import { ref, onMounted } from 'vue'
import { renderArrayExample } from '../../../examples/examples/array-example'

const el = ref()

onMounted(() => renderArrayExample(el.value))
</script>
