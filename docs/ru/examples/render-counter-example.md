# Счетчиков рендеров

:::warning Strict Mode
В этом примере Strict Mode – **выключен**, иначе каждый компонент рендерился бы дважды
:::

<div ref="el" />

<script setup>
import { ref, onMounted } from 'vue'
import { renderRenderCounterExample } from '../../../examples/examples/renders-counter'

const el = ref()

onMounted(() => renderRenderCounterExample(el.value))
</script>
