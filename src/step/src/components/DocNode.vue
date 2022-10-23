<script setup="" lang="ts">
import type { IDocumentNode, ITraversalData } from '@/global/types'
import { nodeStore } from '@/stores/node.store'
import { onMounted, ref, watch } from 'vue'
const props = defineProps<{
    traverse: ITraversalData
    focused: boolean
    nodeId: IDocumentNode['id']
  }>(),
  emit = defineEmits<{
    (e: 'focus'): void
    (e: 'blur'): void
    (e: 'up', offset: number): void
    (e: 'down', offset: number): void
    (e: 'send', node: IDocumentNode): void
    (e: 'remove', node: IDocumentNode): void
  }>(),
  nodes = nodeStore(),
  data = ref(nodes.map[props.nodeId]),
  node = ref<HTMLParagraphElement | undefined>()

onMounted(() => {
  if (node.value) {
    node.value.innerHTML = data.value.value
    if (props.focused) {
      focus()
    }
  }
})
watch(
  () => props.focused,
  () => {
    focus()
  }
)
function focus() {
  if (node.value && props.focused) {
    node.value.focus()
    if (node.value?.hasChildNodes() && props.traverse.offset !== 'start') {
      const selection = window.getSelection()
      if (selection) {
        const r = document.createRange()
        const child =
          props.traverse.direction === 'start'
            ? node.value.firstChild
            : node.value.lastChild
        if (child instanceof Text) {
          const offset =
            typeof props.traverse.offset === 'number'
              ? Math.min(props.traverse.offset, child.length)
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
function send() {
  if (node.value) {
    data.value.value = node.value.innerHTML
    emit('send', data.value)
  }
}
function remove(e: Event) {
  if (node.value) {
    if (node.value.innerText.replace(/\n/, '') === '') {
      e.preventDefault()
      emit('remove', data.value)
    }
  }
}
function complete() {
  data.value.complete = !data.value.complete
}
function traverse(e: KeyboardEvent, direction: 'start' | 'end') {
  const selection = window.getSelection(),
    child =
      direction === 'start' ? node.value?.firstChild : node.value?.lastChild
  if (!child || selection?.focusNode === child) {
    e.preventDefault()
    if (direction === 'start') emit('up', selection?.focusOffset ?? 0)
    else emit('down', selection?.focusOffset ?? 0)
  }
}
function move(e: KeyboardEvent, direction: 'start' | 'end') {
  const child =
      direction === 'start' ? node.value?.firstChild : node.value?.lastChild,
    selection = window.getSelection()
  if (
    !child ||
    child instanceof HTMLBRElement ||
    (child instanceof Text &&
      selection?.focusNode === child &&
      child.length === (direction === 'start' ? 0 : selection?.focusOffset))
  ) {
    e.preventDefault()
    if (direction === 'start') emit('up', selection?.focusOffset ?? 0)
    else emit('down', selection?.focusOffset ?? 0)
  }
}
</script>

<template>
  <article :id="props.nodeId">
    <label :for="`v-${props.nodeId}`">
      <input :id="`${props.nodeId}`" type="checkbox" v-model="data.complete" />
    </label>
    <p
      name="node"
      type="text"
      id="node"
      ref="node"
      class="host__node"
      :class="{
        'host__node--done': data.complete,
        'host__node--focused': props.focused,
      }"
      autocomplete="off"
      contentEditable="true"
      placeholder="Typy type"
      autofocus
      tabindex="0"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @keydown.enter.exact.prevent="send"
      @keydown.delete="remove"
      @keydown.ctrl.enter.exact.prevent="complete"
      @keydown.up.exact="traverse($event, 'start')"
      @keydown.down.exact="traverse($event, 'end')"
      @keydown.left.exact="move($event, 'start')"
      @keydown.right.exact="move($event, 'end')"
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

    & > .host__node::before {
      display: none;
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

  &.host__node--focused {
    &::before {
      content: '$';
      position: absolute;
      margin-inline-start: -2ch;
    }
  }
}
</style>
