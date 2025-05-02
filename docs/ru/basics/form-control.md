# FormControl

## Предназначение

`FormControl` – класс для отслеживания состояния одного поля формы. Спроектирован для связывания с одним HTML-элементом `input`

#### Поддерживает различные типы

Значением `FormControl` можем выступать **любой** тип.

Но, как правило, поле формы является примитивом: строкой или числом. Рекомендуется использовать именно их

```ts
// string
const name = new FormControl('');
// number
const count = new FormControl(0);
// boolean
const isActive = new FormControl(false);

// Явно задаем generic
const control = new FormControl<string | undefined>(undefined);
```

Но, разумеется, можно передать любой более сложный тип

```ts
interface Reward {
  type: string;
  amount: number;
}

const reward = new FormControl<Reward>({ type: '', amount: 0 });

// number[]
const ids = new FormControl([1]);
```

::: warning
Такое использование является **нетипичным**. Для хранения объектов лучше использовать `FormGroup`. Для массивов - `FormArray`
:::

## Состояния

`FormControl` позволяет хранить и управлять состоянием элемента формы

```ts
const control = new FormControl('text');

control.value === 'text'
control.setValue('')

control.disable()
control.isDisabled === true

control.isDirty
control.isFocused

control.isValid

control.ref // HTMLElement
```

## Использование с React

Для синхронизации состояния `FormControl` с React используется


### Хук `useFormControl`

Он позволяет получить доступ к состоянию контрола и его апи. 

Для быстрого связывания контрола с элементом `<input />` используется метод `register()`. Его поведение аналогично _React Hook Form_

Операции над контролом можно осуществлять при помощи объекта `api`

::: warning Обратите внимание
В отличии от _React Hook Form_, где `register` относится к **форме целиком** и принимает имя регистрируемого поля,
в **Event Forms** `register` уже относится к **конкретному полю**
:::

```tsx
const control = new FormControl('');

export const Example: FC = () => {
  const { register, value, isValid, api } = useFormControl(control);

  return (
    <>
      <input {...register()} />

      <button onClick={api.focus}>FOCUS</button>
      <button onClick={api.reset}>RESET</button>
    </>
  );
};
```
Вызов `register()` установит `ref, value, disabled, onChange, onFocus, onBlur`

#### Привязка без `register()`

Если сигнатура компонента не совпадает с обычным `input`, использовать `register()` не получится

Все связи могут быть установлены по отдельности 

```tsx
export const Example: FC = () => {
  const { api, value, isDisabled } = useFormControl(control);

  return (
      <input
        value={value}
        disabled={isDisabled}
        onChange={(event) => api.setValue(event.target.value)}
        onBlur={api.onBlur}
        onFocus={api.onFocus}
        ref={api.setRef}
      />
  );
};
```

::: warning Не используйте без необходимости
Хук `useFormControl` удобен для создания собственных компонентов оберток. Или использования одиночных `FormControl`.

Но как правило `FormControl` является частью формы (`FormGroup`) и используется в связке с `FormControlField`
:::

### Компонент `FormControlField`

`FormControlField` позволяет сделать рендеры формы атомарными.

Принимает рендер-функцию, и объект контрола.

При таком использовании, изменение состояния контрола повлечет за собой ререндер только поддерева `FormControlField`.
Подробнее об этом будет рассказано в разделе про оптимизацию

:::tip Обратите внимание
Это предпочтительный способ использования `FormControl`
:::

Аргумент рендер-функции аналогичен результату вызова `useFormControl`

```tsx
const control = new FormControl('');

export const Example: FC = () => {
  return (
    <FormControlField control={control}>
      {({ register }) => <input {...register()} />}
    </FormControlField>
  );
};
```

## Конфигурирование

```ts

const control = new FormControl(
  '<Значение>',
  {
    onUpdate?(value: TValue): void;
    onFocus?: () => void;
    onBlur?: () => void;
    clearErrorsOnChange?: boolean;
    isDisabled?: boolean;
    validators?: Validator | Validator[];
    mode?: ValidationMode;
  }

```

## Валидация


## Детекция изменений

::: danger Избегайте оператора ...spread
Декструктуризуйте только используемые пропсы
:::

**Event Forms** использует механизм, аналогичный `useQuery` из `@tanstack/react-query`

Компонент будет подписан **только на используемые пропсы**. 

```tsx
// Good ✅
const { value, isDisabled } = useFormControl(control);
// Good ✅
const data = useFormControl(control);
const { value } = data

// Bad ❌❌❌
const { value, ...props } = useFormControl(control);

// Good ✅
<FormControlField control={control}>
    {({ value }) => <input {...register()} />}
</FormControlField>

// Bad ❌❌❌
<FormControlField control={control}>
    {({ value, ...props }) => <input {...register()} />}
</FormControlField>
```


## API

::: danger Секция в разработке
---
:::

#### Поля

- `value: T` – значение `FormControl`


- `isFocused: boolean`

- `isTouched: boolean` - показывает, был ли контрол хоть раз в фокусе

- `isDirty: boolean` - показывает, было ли значение контрола изменено пользователем. 

::: info
Программные изменения через `setValue` не влияют на это поле
:::

- `isDisabled: boolean`
- `isEnabled: boolean`

- `isValid: boolean` - статус валидации
- `isInvalid: boolean`
- `errors: boolean` - массив ошибок валидации

- `ref: HTMLElement | null` - HTML-элемент, которым управляет контрол

::: danger
Поле может быть переименовано. Доступ к нему также является нетипичным. Используйте с большой осторожностью
:::

#### Методы
- `setValue(value: T): void` – установить значение

- `enabled(): void`
- `disabled(): void`

- `setDirty(value: boolean): void`
- `setDisabled(value: boolean): void`

- TODO: