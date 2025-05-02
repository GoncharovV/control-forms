# Мультиязычные ошибки

Обычно требуется не просто найти ошибки в форме, но и вывести сообщение на естественном языке, для объяснения что именно не так.

Валидаторы как правило позволяют самостоятельно задавать такие сообщения, например:

```ts
z.string().min(5, { message: 'Message to Display' })
```

Однако у этого подхода есть ряд недостатков


1. ⛔ Необходимость "возить за собой" переводы

```tsx
function createForm(translations: Translations) {
    return new FormGroup({
        name: new FormControl('', z.string().min(translations.name.min)).max(translations.name.max)),
        age: new FormControl(22, z.number().min(translations.age.min)).max(translations.age.max)),
    })
}

const Example: FC = () => {
    const translations = useTranslations()

    const { ... } = useFormGroup(() => createForm(translations))
}
```




:::warning Совет

**Не храните** сообщения об ошибках в валидаторах.
:::

## Для кого совет

Если смена языка происходит без перезагрузки страницы, это может стать проблемой

Эвристика:
- Приложение умеет перерендериваться при смене языка

Но, обратите внимание:
<div class="danger custom-block" style="padding: 10px">
Форма <b>не будет</b> пересоздана
</div>

- Все уже существующие ошибки никак не изменятся. Их `message` будет на изначальном языке
- 