<script setup lang="ts">
import type { IDocumentNode, ITraversalData } from '@/global/types'
import { nodeStore } from '@/stores/node.store'

import { computed, ref, watch } from 'vue'
import DocNode from '../components/DocNode.vue'

const nodes = nodeStore(),
  lastChild = computed(() => nodes.order[nodes.order.length - 1]),
  traversal = ref<ITraversalData>({
    offset: 'end',
    direction: 'start',
  }),
  focused = ref<IDocumentNode['id']>(nodes.map[lastChild.value].id),
  showHelp = ref(false)

watch(
  () => nodes.order,
  () => next(0, false)
)

function newLine(v: IDocumentNode) {
  next(nodes._findOrderOffset(v.id) + 1)
}
function removeLine(v: IDocumentNode) {
  const offset = nodes.remove(v.id)

  focused.value = nodes.order[Math.max(offset - 1, 0)]
  traversal.value = {
    offset: 'end',
    direction: 'end',
  }
}
function next(offset?: number, focus = true) {
  const insertion = nodes.create(offset)
  if (focus) {
    focused.value = insertion.node.id
    traversal.value = { offset: 'end', direction: 'end' }
  }
}
function traverse(inlineOffset: number, direction: 'up' | 'down') {
  const order = nodes._findOrderOffset(focused.value),
    nextIdx = direction === 'up' ? order - 1 : order + 1

  if (nextIdx >= 0 && nextIdx < nodes.order.length) {
    focused.value = nodes.order[nextIdx]
    traversal.value = {
      offset: inlineOffset,
      direction: direction === 'up' ? 'end' : 'start',
    }
  }
}
</script>

<template>
  <main class="host">
    <button id="help-toggle" @click="showHelp = !showHelp">(?)</button>
    <article v-show="showHelp" id="help" class="card">
      <h3>
        What's on Your mind? <br />
        Write it down.
      </h3>
      <p>(Enter) New task</p>
      <p>(Shift+Enter) Line break in same task</p>
      <p>(Ctrl+Enter) Complete current task</p>
      <p>(Up / Shift+Tab) Previous task</p>
      <p>(Down / Tab) Next task</p>
      <p>Delete all text in task for removal</p>
    </article>
    <DocNode
      v-for="vId in nodes.order"
      :key="vId"
      :focused="vId === focused"
      :traverse="traversal"
      :nodeId="vId"
      @send="newLine"
      @remove="removeLine"
      @focus="focused = vId"
      @up="traverse($event, 'up')"
      @down="traverse($event, 'down')"
    ></DocNode>
  </main>
</template>

<style scoped lang="scss">
.host {
  inline-size: 100%;
  block-size: 100%;
  max-inline-size: 66ch;
  margin-inline-start: auto;
  margin-inline-end: auto;

  display: flex;
  flex-direction: column;

  justify-content: center;

  position: relative;
  z-index: 1;

  #help-toggle {
    inline-size: auto;
    position: fixed;
    z-index: 2;
    top: 0;
    right: 0;
  }
  #help {
    position: fixed;
    z-index: 2;
    top: 5ch;
    right: 2ch;
  }
}
</style>
