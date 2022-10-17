<script setup lang="ts">
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import { computed, onMounted, ref, watch } from 'vue'
import DocNode from '../components/DocNode.vue'

const cursor = ref<HTMLTextAreaElement | undefined>(),
  store = graphService(),
  parent = ref(store.V[0]),
  children = ref<Array<IVertex>>(store.heads(parent.value)),
  focused = ref<number>(
    (children.value[children.value.length - 1] || parent.value).id
  ),
  showHelp = ref(false)

onMounted(() => {
  if (children.value.length === 0) {
    next()
  }
})
watch(
  () => children.value[children.value.length - 1],
  nextLast => (focused.value = nextLast.id)
)
function save(v: IVertex, c: string) {
  console.log('save', v)
  const vIdx = children.value.findIndex(vf => vf.id === v.id)
  children.value[vIdx].value = c

  if (children.value[children.value.length - 1].value) {
    next()
  }
}
function remove(v: IVertex) {
  children.value.splice(
    children.value.findIndex(fv => fv.id === v.id),
    1
  )
  store.removeV(v.id)
}

function next() {
  const newV = store.connect(parent.value.id)
  // focused.value = newV.id
  children.value.push(newV)
}
function focusUp() {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value)
  focused.value = children.value[fVIdx - 1]?.id || parent.value.id
}
function focusDown() {
  const fVIdx = children.value.findIndex(fv => fv.id === focused.value)
  focused.value = children.value[fVIdx + 1]?.id || parent.value.id
}
</script>

<template>
  <main class="host" tabindex="-1">
    <button id="help-toggle" @click="showHelp = !showHelp">(?)</button>
    <article v-show="showHelp" id="help" class="card">
      <p>(Enter) New task</p>
      <p>(Shift+Enter) Line break in same task</p>
      <p>(Ctrl+Enter) Complete</p>
      <p>(Ctrl+Up / Tab) Previous task</p>
      <p>(Ctrl+Down / Shift+Tab) Next task</p>
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
