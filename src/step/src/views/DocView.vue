<script setup lang="ts">
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import { computed, onMounted, ref } from 'vue'
import DocNode from '../components/DocNode.vue'

const cursor = ref<HTMLTextAreaElement | undefined>(),
  store = graphService(),
  parent = ref(store.V[0]),
  children = ref<Array<IVertex>>(store.heads(parent.value))
if (!children.value.length) {
  next(0, false)
}
const lastChild = computed(() => children.value[children.value.length - 1]),
  focused = ref<{
    id: number
    offset: 'start' | 'end' | number
    direction: 'start' | 'end'
  }>({
    id: lastChild.value.id,
    offset: 'end',
    direction: 'start',
  }),
  showHelp = ref(false)

onMounted(() => {
  if (children.value.length === 0) {
    next()
  }
})

function save(v: IVertex, c: string) {
  const vIdx = children.value.findIndex(vf => vf.id === v.id)
  children.value[vIdx].value = c

  next(vIdx + 1)
}
function remove(v: IVertex) {
  const cIdx = children.value.findIndex(fv => fv.id === v.id)
  children.value.splice(cIdx, 1)
  store.removeV(v.id)
  focused.value = {
    id: children.value[Math.max(cIdx - 1, 0)].id,
    offset: 'end',
    direction: 'end',
  }
}
function next(offset?: number, focus = true) {
  const newV = store.connect(parent.value.id)
  children.value.splice(offset || children.value.length, 0, newV)
  if (focus) focused.value = { id: newV.id, offset: 'end', direction: 'end' }
}
function focusUp(offset: number) {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value.id)
  if (children.value[fVIdx - 1]?.id) {
    focused.value = {
      id: children.value[fVIdx - 1].id,
      offset,
      direction: 'end',
    }
  }
}
function focusDown(offset: number) {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value.id)
  if (children.value[fVIdx + 1]?.id) {
    focused.value = {
      id: children.value[fVIdx + 1].id,
      offset,
      direction: 'start',
    }
  }
}
</script>

<template>
  <main class="host">
    <button id="help-toggle" @click="showHelp = !showHelp">(?)</button>
    <article v-show="showHelp" id="help" class="card">
      <p>(Enter) New task</p>
      <p>(Shift+Enter) Line break in same task</p>
      <p>(Ctrl+Enter) Complete</p>
      <p>(Up / Tab) Previous task</p>
      <p>(Down / Shift+Tab) Next task</p>
      <p>For removal, delete all text in task</p>
    </article>
    <DocNode
      v-for="v in children"
      :key="v.id"
      ref="cursor"
      :focused="focused"
      :vertex="v"
      @send="save"
      @remove="remove"
      @focus="focused.id = v.id"
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
