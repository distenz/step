<script setup="" lang="ts">
import type { IVertex } from '@/utility/vertex.interface'
import { onMounted, onUpdated, nextTick, ref, watch, type Ref } from 'vue'

const props = defineProps<{
    focused: number
    vertex: IVertex
  }>(),
  emit = defineEmits<{
    (e: 'focus'): void
    (e: 'blur'): void
    (e: 'up'): void
    (e: 'down'): void
    (e: 'send', v: IVertex, c: string): void
    (e: 'remove', v: IVertex): void
  }>(),
  node = ref<HTMLParagraphElement | undefined>(),
  done = ref<boolean>(false)

onMounted(() => {
  if (node.value) {
    node.value.innerHTML = props.vertex?.value ?? ''
  }
  focusIfNeeded()
})
onUpdated(() => focusIfNeeded())

function focusIfNeeded() {
  if (props.focused === props.vertex.id) {
    focus()
    if (node.value?.hasChildNodes()) {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        const lastChild: Text = <Text>node.value.lastChild
        if (lastChild) {
          range.setStart(lastChild, lastChild.length)
          range.setEnd(lastChild, lastChild.length)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }
  }
}

function focus() {
  node.value?.focus()
}
function send() {
  if (node.value) {
    emit('send', props.vertex, node.value.innerHTML)
  }
}
function remove() {
  if (node.value) {
    if (node.value.innerText === '') {
      emit('remove', props.vertex)
    }
  }
}
function toggle() {
  done.value = !done.value
}
function up() {
  emit('up')
}
function down() {
  emit('down')
}
</script>

<template>
  <article>
    <label :for="`v-${props.vertex.id}`">
      <input :id="`${props.vertex.id}`" type="checkbox" v-model="done" />
    </label>
    <p
      name="node"
      type="text"
      id="node"
      ref="node"
      class="host__node"
      :class="{ 'host__node--done': done }"
      autocomplete="off"
      contentEditable="true"
      placeholder="Typy type"
      tabindex="0"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @keydown.enter.exact.prevent="send"
      @keydown.delete="remove"
      @keydown.ctrl.enter.exact.prevent="toggle"
      @keydown.ctrl.up.exact.prevent="up"
      @keydown.ctrl.down.exact.prevent="down"
    ></p>
  </article>
</template>

<style scoped="" lang="scss">
article {
  display: flex;
  gap: 0.5ch;
  align-items: center;
  justify-content: flex-start;

  font-size: 1.2rem;
  line-height: 1.4;

  padding-inline: 0.5ch;
  padding-block: 0.25ch;

  transition: background-color 0.1s linear;
  border-radius: 0.25ch;

  &:hover {
    background-color: hsl(0, 0%, 100%, 0.05);

    & > label {
      opacity: 1;
    }
  }

  & > label {
    display: flex;
    align-self: flex-start;
    gap: 0.25ch;
    opacity: 0;

    transition: opacity 0.1s linear;

    block-size: 1.2rem * 1.4;

    & > input {
      background-color: transparent;
    }
  }
}
.host__node {
  inline-size: 100%;

  outline: unset;
  border: unset;
  background-color: unset;
  padding: unset;
  margin: unset;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  transition: color 0.1s linear;

  &.host__node--done {
    color: var(--color-border);
  }
}
</style>
