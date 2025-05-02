# FormGroup

## Предназначение

`FormGroup` – класс для создания форм. Агрегирует объекты `FormControl`, `FormArray` (или любые другие `AbstractControl`)

Форма состоит из полей - других контролов

```ts
const form = new FormGroup({
  name: new FormControl(''),
  age: new FormControl(18),

  hobbies: new FormArray<FormControl<string>>([]),
});

form.fields.name // <- FormControl
form.fields.hobbies // <- FormArray
```


## Использование с React

Для синхронизации состояния `FormGroup` с React используется


### Хук `useForGroup`

```tsx
function createForm() {
  return new FormGroup({
    name: new FormControl(''),
  });
}

export const Example: FC = () => {
  const { fields, api } = useFormGroup(
    createForm,
    {
      onValidSubmit: (data) => {},
      onInvalidSubmit: (validationResult) => {},
      onAnySubmit: () => {},
    },
  );

  ...
```

