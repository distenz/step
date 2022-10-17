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
  )

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

  // .host__node {
  //   &:not(:last-of-type) {
  //     border-bottom: 1px solid var(--color-border);
  //   }
  // }
}
</style>
