# Зависимые поля формы

:::warning Обратите внимание
Порядок создания и использования форм был подробно разобран в примере с [Базовой формой](./base-form-example)
:::

Создадим форму из двух поле: `count` и `countX2`.

Подпишемся на `onUpdate` поля `count`. Проверим, если пользователь ещё не трогал `countX2` (`isTouched === false`), то будем менять его значение

```tsx
export const DependentFormExample: FC = () => {
  const { api, fields, instance } = useFormGroup(() => {
    return new FormGroup( // [!code focus:10]
      {
        count: new FormControl('', {
          onUpdate: (value) => {
            if (!fields.countX2.isTouched)
              fields.countX2.setValue((Number(value) * 2).toString());
          },
        }),
        countX2: new FormControl(''),
      },
    );
  });

  return (
    <form onSubmit={api.onSubmit}>
      <FormControlField control={fields.count}>
        {(data) => <Input data={data} description="Count" />}
      </FormControlField>

      <FormControlField control={fields.countX2}>
        {(data) => <Input data={data} description="Count * 2" />}
      </FormControlField>

      <FormGroupState form={instance} />
    </form>
  );
};
```

## Результат

:::tip Совет
Если "потрогать" второй контрол, он перестанет реагировать на изменения первого (`isTouched === true`)

Используйте `reset()` второго контрола, чтобы сбросить его состояние
:::

<div ref="el" />

<script setup>
import { ref, onMounted } from 'vue'
import { renderDependentFormExample } from '../../../examples/examples/dependent-example'

const el = ref()

onMounted(() => renderDependentFormExample(el.value))
</script>
