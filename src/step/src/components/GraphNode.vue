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
    connect: '',
    showConnections: true,
    data: store.nodes[props.id],
  }),
  inputElement = ref<HTMLInputElement | undefined>()

const connections = computed(() => {
    return state.data.edges
      .map(edgeId => {
        return store.edges[edgeId]
      })
      .map(({ fromId, toId }) => {
        return store.nodes[props.id === fromId ? toId : fromId]
      })
      .filter(({ id }) => !props.path.includes(id))
  }),
  edgeCount = computed(() => state.data.edges.length),
  otherDirectionEdgeCount = computed(() => connections.value.length),
  showEdges = computed(
    () => state.showConnections && otherDirectionEdgeCount.value > 0
  ),
  showEdgeCorner = computed(
    () =>
      props.path.length > 1 &&
      props.id.toString() === props.path[props.path.length - 1].toString()
  )

onMounted(() => {
  inputElement.value?.focus()
})

function setValue() {
  if (!state.input) return
  state.data.value = state.input
  state.input = ''
}
function connect() {
  if (!state.connect) return
  store.connect(props.id, state.connect)
  state.connect = ''
}
</script>

<template>
  <section class="vertice">
    <article class="vertice__data">
      <span>N#{{ id }}</span>
      <span> = </span>
      <p v-if="state.data.value">{{ state.data.value }}</p>
      <template v-else>
        <input
          type="text"
          placeholder="Node value"
          ref="inputElement"
          v-model="state.input"
          @keyup.enter="setValue"
        />
      </template>
      <p>(E:{{ edgeCount }})</p>
      <button @click="store.connect(props.id)">Extend</button>
      <input
        type="text"
        placeholder="Connect to NID"
        ref="connectElement"
        v-model="state.connect"
        @keyup.enter="connect"
      />
      <label for="node__show-connections">
        Edges
        <input
          id="node__show-connections"
          type="checkbox"
          v-model="state.showConnections"
        />
      </label>
    </article>
    <span class="edge" :class="{ '--show-corner': showEdgeCorner }"></span>
    <span class="edge-connector" v-if="showEdges"></span>
    <section v-if="showEdges" class="vertice__edges">
      <GraphNode
        v-for="node in connections"
        :key="node.id"
        :id="node.id"
        :path="[...path, node.id]"
      />
    </section>
  </section>
</template>

<style scoped="" lang="scss">
.vertice {
  position: relative;

  display: grid;

  grid-template-columns: 0.25rem min-content 1fr;
  grid-template-rows: max-content max-content;

  grid-template-areas:
    'edge vertice vertice'
    'edge edgeConnector verticeEdge'
    'corner edgeConnector verticeEdge';

  .vertice__data {
    grid-area: vertice;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
  }
  .vertice__edges {
    grid-area: verticeEdge;
  }
  .edge {
    grid-area: edge;
    height: 100%;

    background-color: var(--color-accent);

    &.--show-corner {
      grid-row-start: edge;
      grid-column-start: edge;
      grid-row-end: corner;
      grid-column-end: corner;
    }
  }
  .edge-connector {
    grid-area: edgeConnector;

    width: 1rem;
    height: 0.25rem;
    align-self: center;
    background-color: var(--color-accent);
  }
}
</style>
