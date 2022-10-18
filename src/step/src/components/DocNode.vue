<script setup="" lang="ts">
import type { IVertex } from '@/utility/vertex.interface'
import { onMounted, onUpdated, ref } from 'vue'
/**
 * @todo insert new node under previous index (currently only end of child list is supported)
 */
const props = defineProps<{
    focused: {
      id: number
      offset: 'start' | 'end' | number
      direction: 'start' | 'end'
    }
    vertex: IVertex
  }>(),
  emit = defineEmits<{
    (e: 'focus'): void
    (e: 'blur'): void
    (e: 'up', offset: number): void
    (e: 'down', offset: number): void
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
  if (props.focused.id === props.vertex.id) {
    console.log('focused', props.vertex, props.focused)
    focus()
    if (node.value?.hasChildNodes() && props.focused.offset !== 'start') {
      const selection = window.getSelection()
      if (selection) {
        const r = document.createRange()
        const child =
          props.focused.direction === 'start'
            ? node.value.firstChild
            : node.value.lastChild
        if (child instanceof Text) {
          const offset =
            typeof props.focused.offset === 'number'
              ? Math.min(props.focused.offset, child.length)
              : child.length
          r.setStart(child, offset)
          r.setEnd(child, offset)
          selection.removeAllRanges()
          selection.addRange(r)
        }
      }
    }
  }
}

function focus() {
  try {
    if (!node.value) throw new Error('can not focus, no node in dom')
    node.value.focus()
  } catch (e) {
    console.error(e)
  }
}
function send() {
  if (node.value) {
    emit('send', props.vertex, node.value.innerHTML)
  }
}
function remove(e: Event) {
  if (node.value) {
    if (node.value.innerText.replace(/\n/, '') === '') {
      e.preventDefault()
      emit('remove', props.vertex)
    }
  }
}
function toggle() {
  done.value = !done.value
}
function up(e: KeyboardEvent) {
  const selection = window.getSelection()
  if (
    !node.value?.firstChild ||
    selection?.focusNode === node.value?.firstChild
  ) {
    e.preventDefault()
    emit('up', selection?.focusOffset ?? 0)
  }
}
function down(e: KeyboardEvent) {
  const selection = window.getSelection()
  if (
    !node.value?.lastChild ||
    selection?.focusNode === node.value?.lastChild
  ) {
    e.preventDefault()
    emit('down', selection?.focusOffset ?? 0)
  }
}
function left(e: KeyboardEvent) {
  const firstChild = node.value?.firstChild,
    selection = window.getSelection()
  if (
    !firstChild ||
    firstChild instanceof HTMLBRElement ||
    (firstChild instanceof Text &&
      selection?.focusNode === firstChild &&
      selection?.focusOffset === 0)
  ) {
    e.preventDefault()
    emit('up', selection?.focusOffset ?? 0)
  }
}
function right(e: KeyboardEvent) {
  const lastChild = node.value?.lastChild,
    selection = window.getSelection()
  if (
    !lastChild ||
    lastChild instanceof HTMLBRElement ||
    (lastChild instanceof Text &&
      selection?.focusNode === lastChild &&
      lastChild.length === selection?.focusOffset)
  ) {
    e.preventDefault()
    emit('down', selection?.focusOffset ?? 0)
  }
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
      autofocus
      tabindex="0"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @keydown.enter.exact.prevent="send"
      @keydown.delete="remove"
      @keydown.ctrl.enter.exact.prevent="toggle"
      @keydown.up.exact="up"
      @keydown.down.exact="down"
      @keydown.left.exact="left"
      @keydown.right.exact="right"
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

  // transition: background-color 0.1s linear;
  border-radius: 0.25ch;

  &:hover {
    background-color: hsl(0, 0%, 100%, 0.05);

    & > label {
      // opacity: 1;
      & > input {
        display: block;
      }
    }
  }

  & > label {
    display: flex;
    align-self: flex-start;
    gap: 0.25ch;
    // opacity: 0;
    width: 1.6ch;

    // transition: opacity 0.1s linear;

    block-size: 1.2rem * 1.4;

    & > input {
      background-color: transparent;
      width: 1.6ch;
      display: none;
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
