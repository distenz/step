<script setup="" lang="ts">
import { graphService, type INodeData } from '@/services/graph.service'
import { computed, onMounted, reactive, ref } from 'vue'

const store = graphService(),
  props = defineProps<{
    id: INodeData<any>['id']
    path: Array<INodeData<any>['id']>
  }>(),
  state = reactive({
    input: '',
    showConnections: false,
    data: store.nodes[props.id],
  }),
  element = ref<HTMLInputElement | undefined>()

const edgeCount = computed(() => state.data.edges.length),
  connections = computed(() => {
    return state.data.edges
      .map(edgeId => {
        return store.edges[edgeId]
      })
      .map(({ fromId, toId }) => {
        return store.nodes[props.id === fromId ? toId : fromId]
      })
      .filter(({ id }) => !props.path.includes(id))
  })

onMounted(() => {
  element.value?.focus()
})

function setValue(input: string) {
  if (!input) return
  state.data.value = input
}
</script>

<template>
  <article class="graph__node">
    <section class="node__data">
      <span>N#{{ id }} = </span>
      <p v-if="state.data.value">{{ state.data.value }}</p>
      <template v-else>
        <input
          type="text"
          ref="element"
          v-model="state.input"
          @keyup.enter="setValue(state.input)"
        />
        <button @click="setValue(state.input)">Add</button>
      </template>
      <p>(E:{{ edgeCount }})</p>
      <button @click="store.connect(props.id)">Expand</button>
      <button @click="state.showConnections = !state.showConnections">
        {{ state.showConnections ? 'Hide Connections' : 'Show Connections' }}
      </button>
    </section>

    <section class="node__connections" v-if="state.showConnections">
      <GraphNode
        v-for="node in connections"
        :key="node.id"
        :id="node.id"
        :path="[...path, node.id]"
      />
    </section>
  </article>
</template>

<style scoped="" lang="scss">
.graph__node {
  background-color: #212121ff;
  padding: 0.5rem;

  &:not(:last-of-type) {
    border-bottom: 1px solid #ccc;
  }
  .node__data {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    gap: 0.5rem;
  }
  p {
    margin-bottom: 0;
    line-height: 1.5rem;
  }
  input {
    line-height: 1.5rem;
    padding: 0 0.25rem;
    margin: 0;
    border: 0;
  }
}
</style>
