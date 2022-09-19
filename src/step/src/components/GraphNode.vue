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
  otherDirectionEdgeCount = computed(() => connections.value.length)

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
  <article class="graph__node">
    <section class="node__data">
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
      <button @click="store.connect(props.id)">Expand</button>
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
    </section>

    <section
      class="node__connections"
      v-if="state.showConnections && otherDirectionEdgeCount > 0"
    >
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
  display: flex;
  flex-direction: column;
  gap: 1rem;

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
  .node__connections {
    border-radius: 2px;
    border: 1px solid #ccc;
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
