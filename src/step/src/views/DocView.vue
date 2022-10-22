<script setup lang="ts">
import type { IDocumentNode, ITraversalData } from '@/global/types'
import { nanoid } from 'nanoid'

import { computed, onMounted, ref } from 'vue'
import DocNode from '../components/DocNode.vue'

const cursor = ref<HTMLTextAreaElement | undefined>(),
  children = ref<Array<IDocumentNode>>([])
if (!children.value.length) {
  next(0, false)
}
const lastChild = computed(() => children.value[children.value.length - 1]),
  traversal = ref<ITraversalData>({
    offset: 'end',
    direction: 'start',
  }),
  focused = ref<IDocumentNode['id']>(lastChild.value.id),
  showHelp = ref(false)

onMounted(() => {
  if (children.value.length === 0) {
    next()
  }
})

function save(v: IDocumentNode, c: string) {
  const vIdx = children.value.findIndex(vf => vf.id === v.id)
  children.value[vIdx].value = c

  next(vIdx + 1)
}
function remove(v: IDocumentNode) {
  const cIdx = children.value.findIndex(fv => fv.id === v.id)
  children.value.splice(cIdx, 1)
  focused.value = children.value[Math.max(cIdx - 1, 0)].id
  traversal.value = {
    offset: 'end',
    direction: 'end',
  }
}
function next(offset?: number, focus = true) {
  const newV = { id: nanoid(), value: '' }
  children.value.splice(offset || children.value.length, 0, newV)
  if (focus) {
    focused.value = newV.id
    traversal.value = { offset: 'end', direction: 'end' }
  }
}
function focusUp(offset: number) {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value)
  if (children.value[fVIdx - 1]?.id) {
    focused.value = children.value[fVIdx - 1].id
    traversal.value = {
      offset,
      direction: 'end',
    }
  }
}
function focusDown(offset: number) {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value)
  if (children.value[fVIdx + 1]?.id) {
    focused.value = children.value[fVIdx + 1].id
    traversal.value = {
      offset,
      direction: 'start',
    }
  }
}
</script>

<template>
  <main class="host">
    {{ focused }}
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
      v-for="v in children"
      :key="v.id"
      ref="cursor"
      :focused="v.id === focused"
      :traverse="traversal"
      :node="v"
      @send="save"
      @remove="remove"
      @focus="focused = v.id"
      @up="focusUp"
      @down="focusDown"
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
