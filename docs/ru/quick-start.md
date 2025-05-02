# Начало работы


## Основные компоненты

- `FormControl`
- `FormGroup`
- `FormArray`

Каждый из них является `контролом` (и наследником `AbstractControl`)

::: info
**Контрол** - общее название
:::


## Создание контролов

Любой контрол создается как инстанс его класса

```ts
const control = new FormControl('')

const array = new FormArray([])

const group = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
})
```

::: tip
`FormGroup` - по сути является формой
:::

## Состояние контролов

Являясь объектом, контрол содержит всё своё состояние и методы для управления им

```ts
const control = new FormControl('')

control.value
control.setValue

control.isValid
control.isDirty
control.isFocused
control.isDisabled

control.enable()
control.disable()

control.errors

control.addValidators([z.string().max(30)])

// etc
```

## Интеграция с React

`React` по умолчанию не умеет реагировать на изменения состояния контролов. 
Поэтому использовать инстансы напрямую – нельзя.

Для интеграции с `React` используются

#### Хуки:
- `useFormGroup`
- `useFormControl`
- `useFormArray`

Каждый хук принимает контрол (или фабрику), и возвращает его состояние и api и ссылку на инстанс

#### Пример

```tsx
const { value, isDisabled, api, register, instance } = useFormControl(() => new FormControl(''))

// value, isDisabled и тд – отслеживаются реактом

// Объект `api` используется для выполнения любых операций над контролом

api.setValue('')
api.setDirty(true)
api.disable()
api.clearErrors()

instance // <- объект `FormControl`

// Чтобы связать инпут и контрол, нужно сделать спред вызова register()
// Как в React Hook Form
<input {...register()} />

/**
 * Подпишет ref, value, disabled, onChange, onFocus, onBlur
 */

// Можно использовать отдельно
<input 
    value={value}
    onChange={event => api.setValue(event.target.value)}
    // не будет работать isFocused, ведь хендлеры onFocus, onBlur - не переданы
/>
```

- Хук `useFormGroup` обеспечивает основную работу с формой

```tsx{9}
// Создали статичную форму
const [form] = useState(() => {
    return new FormGroup({
      name: new FormControl('')
    })
})

// используем форму
const { fields, api } = useFormGroup(form, {
    // подписываемся на отправку формы
    onValidSubmit: (data) => { data.name },
    onInvalidSubmit: () => {},
    onAnySubmit: () => {},

    onUpdate: (newValue) => { newValue.name },
    // режим валидации
    mode: 'onSubmit',
});

// fields содержит все поля формы
fields.name // <- FormControl

// программно отправляем форму
api.submit() 
```

### Компоненты
- `FormControlField`
- `FormArrayField`

#### Пример
`FormControlField` принимает готовый FormControl. Обычно используется внутри формы.

Компоненты помогают оптимизировать ререндеры

```tsx
const [control] = useState(() => new FormControl(''))

return (
    <FormControlField control={control}>
        {({ register }) => <input {...register()} />}
    </FormControlField>
)
```

## Полный пример работы с формой

```tsx
function createBaseForm() {
    // Описываем структуру полей формы
    return new FormGroup({
        name: new FormControl(''),
        lastName: new FormControl(''),
    });
}

// Удобно выносить создание формы в отдельную функцию, чтобы получить её тип
type BaseForm = ReturnType<typeof createBaseForm>;

export const FormExample: FC = () => {
    const { fields, api } = useFormGroup(createBaseForm, {
      // Подписываемся на отправку формы 
      onValidSubmit: (data) => console.log(data)
    });

    return (
        // onSubmit вызовет event.preventDefault();
        <form onSubmit={api.onSubmit}>
            <FormControlField control={fields.name}>
                /* Доступно полное состояние `FormControl`, и его `api` */
                {({ register, isValid, isDirty, api }) => <input {...register()} /* isValid, isDirty */ />}
            </FormControlField>

            <FormControlField control={fields.lastName}>
                /* Произвольный компонент, который сам умеет регистрировать контрол */
                {(data) => <Input data={data} />}
            </FormControlField>

            <button
                type="submit"
                // Доступен так же обычный submit
                onClick={api.submit}
            >
                SUBMIT
            </button>
        </form>
    );
};

```

## Как работает оптимизация

Рассмотрим пример неправильного использования. Состояния контролов читаются на **уровне формы**

```tsx
// ❌❌❌ WRONG!!! ❌❌❌

export const FormExample: FC = () => {
    const { value: NAME, isDisabled } = useFormControl(control1)

    const { value: LAST_NAME, } = useFormControl(control2)

    return (
        <form>
            <input value={NAME} />
            <input value={LAST_NAME} />
        </form>        
    );
};
```

::: danger
При таком использовании, изменение состояния **ЛЮБОГО** дочернего контрола приведет к ререндеру **ВСЕЙ** формы
:::

---

Вместо этого, состояние контрола должно быть считано на уровне отображающего его компонента.
Тогда при изменении состояния этого контрола, рендериться будет **ТОЛЬКО** его поддерево, а не вся форма

```tsx
// ✅✅✅ CORRECT ✅✅✅

export const FormExample: FC = () => {
    // Нет вызова хуков. 
    // Компонент формы не подписывается на состояния контролов 
    // (если в этом нет необходимости) 

    return (
        <form>
            <FormControlField control={control1}>
                /* Читаем состояние внутри рендер-функции */
                {({ value, register }) => <input {...register()} />}
            </FormControlField>

            <FormControlField control={control2}>
                {...}
            </FormControlField>
        </form>        
    );
};
```