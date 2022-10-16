<script setup="" lang="ts">
import type { IVertex } from '@/utility/vertex.interface'
import { onMounted, ref, watch, type Ref } from 'vue'

const props = defineProps<{
    focused: boolean
    vertex: IVertex
  }>(),
  emit = defineEmits<{
    (e: 'focus'): void
    (e: 'blur'): void
    (e: 'send', v: IVertex, c: string): void
  }>(),
  node = ref<HTMLParagraphElement | undefined>(),
  rows = ref<number>(1)

watch(
  () => props.focused,
  focused => {
    if (focused) focus()
  }
)

onMounted(() => {
  if (node.value) {
    node.value.innerHTML = props.vertex?.value.value ?? ''
  }
})

function focus() {
  node.value?.focus()
}
function send() {
  if (node.value) {
    emit('send', props.vertex, node.value.innerHTML)
    node.value.innerHTML = ''
  }
}
</script>

<template>
  <p
    name="node"
    type="text"
    id="node"
    ref="node"
    class="host__node"
    cols="auto"
    :rows="rows"
    autofocus
    autocomplete="off"
    contentEditable="true"
    placeholder="Typy type"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keyup.enter="send"
  ></p>
</template>

<style scoped="" lang="scss">
.host__node {
  inline-size: 100%;

  outline: unset;
  border: unset;
  background-color: unset;
  padding: unset;
  margin: unset;
  font-family: inherit;

  font-size: 1.2rem;
  line-height: 1.5;
}
</style>
