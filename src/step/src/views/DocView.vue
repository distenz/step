<script setup lang="ts">
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import { onMounted, ref } from 'vue'
import DocNode from '../components/DocNode.vue'

const cursor = ref<HTMLTextAreaElement | undefined>(),
  focused = ref(false),
  store = graphService(),
  parent = ref(store.V[0]),
  children = ref<Array<IVertex>>(store.heads(parent.value))

onMounted(() => {
  if (children.value.length === 0) {
    next()
  }
})

function focus() {
  if (cursor.value && !focused.value) {
    console.log('next docs cursor focus')
    focused.value = true
  }
}
function blur() {
  console.log('next docs cursor blur')
  focused.value = false
}
function save(v: IVertex, c: string) {
  console.log('save', v)
  const vIdx = children.value.findIndex(v => v.id === v.id)
  children.value[vIdx].value = v.value

  next()
}

function next() {
  const newV = store.connect(parent.value.id)
  children.value.push(newV)
}
</script>

<template>
  <main class="host" @click.exact="focus" tabindex="-1">
    <DocNode
      v-for="v in children"
      :key="v.id"
      ref="cursor"
      :focused="focused"
      :vertex="v"
      @focus="focus"
      @blur="blur"
      @send="save"
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

  // background-color: hsla(0, 0, 0, 0.05);
}
</style>
