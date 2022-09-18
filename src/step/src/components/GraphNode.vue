<script setup="" lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import GraphEdge from './GraphEdge.vue'

const store = reactive({
    id: 0,
    input: '',
    value: '',
    connections: ref<Array<string>>([]),
  }),
  valueElement = ref<Ref<HTMLInputElement> | null>(null),
  emit = defineEmits(['initialized'])

defineProps(['edgeIds'])

watch(
  () => store.value,
  () => {
    store.input = ''
    emit('initialized')
    if (!store.connections.length)
      store.connections.push(store.connections.length.toString())
  }
)

onMounted(() => valueElement.value?.focus())

function init(input: string) {
  store.value = input
}
</script>

<template>
  <article>
    <p v-if="store.value">Node#{{ store.id }} - {{ store.value }}</p>
    <input
      v-else
      type="text"
      placeholder="New node value"
      ref="valueElement"
      v-model="store.input"
      @keydown.enter="init(store.input)"
    />
    <button v-show="valueElement?.value" @click="init(store.input)">Do</button>
    <GraphEdge
      v-for="edgeId in store.connections"
      :key="edgeId"
      :edgeId="edgeId"
      type="child"
    />
  </article>
</template>

<style scroped=""></style>
