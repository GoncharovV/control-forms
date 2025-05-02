
# Валидация

Каждый контрол может иметь собственную валидацию. 

Валидаторы передаются массивом в поле `validators`. Могут быть как синхронными, так и **асинхронными**.
`Zod` поддерживается из коробки

### `FormControl`

```ts
import { z } from 'zod';

const control = new FormControl('', { validators: [z.string().min(1)] })

const result = await control.validate()
console.log(control.errors)
// [{code: "too_small", message: "String must contain at least 1 character(s)"}]
```

По умолчанию, `FormControl` удаляет ошибки после изменения значения.
Это поведение можно изменить установив `clearErrorsOnChange: false`

```ts{3,12}
const control = new FormControl('', {
    validators: [...],
    clearErrorsOnChange: true,
});

await control.validate();

// Есть ошибки
control.errors.length === 1;
control.isValid === false;

control.setValue('');

// Ошибки очищены
control.errors.length === 0;
control.isValid === true;
```


### `FormGroup`

::: warning
Валидировать форму целиком – **нетипичный сценарий**. Как правило, достаточно отдельно провалидировать каждое её поле.
:::

```ts{7-11}
const form = new FormGroup(
    {
        // У поля формы есть собственная валидация
        name: new FormControl('', { validators: [z.string().min(1)] }),
    },
    {
        validators: [
            z.object({
                name: z.string().max(30),
            }),
        ],
    },
);
```

По умолчанию, `FormGroup` валидируется при отправке. Но можно указать и другие варианты

```ts{5}
const form = new FormGroup(
    { ... },
    {
        validators: [...],
        mode: 'onSubmit', // 'onChange' | 'onBlur' | 'onSubmit' | 'none'
    },
);

form.submit()

const result = await form.validate()
```

При этом, будут вызваны валидаторы не только на самой форме, но и на **каждом дочернем контроле**
