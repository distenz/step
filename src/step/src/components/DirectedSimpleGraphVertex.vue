<script setup="" lang="ts">
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import { computed, onMounted, reactive, ref } from 'vue'

const store = graphService(),
  props = defineProps<{
    id: IVertex['id']
    path: Array<IVertex['id']>
  }>(),
  state = reactive({
    input: '',
    connect: null,
    showHeads: true,
    data: store.getV(props.id),
  }),
  inputElement = ref<HTMLInputElement | undefined>()

if (!state.data) throw new Error()

const heads = computed(() => store.heads(state.data)),
  tails = computed(() => store.tails(state.data)),
  edgeCount = computed(() => state.data.edges.length),
  headCount = computed(() => heads.value.length),
  tailCount = computed(() => tails.value.length),
  showHeads = computed(() => state.showHeads && headCount.value > 0)

onMounted(() => {
  inputElement.value?.focus()
})

function setValue() {
  if (!state.input) return
  if (!state.data) return
  state.data.value = state.input
  state.input = ''
}
function connect() {
  if (!state.connect) return
  store.connect(props.id, +state.connect)
  state.connect = null
}
</script>

<template>
  <section class="vertex">
    <article class="vertex__data">
      <span class="data__id">V#{{ id }} = </span>
      <p class="data__value" v-if="state.data.value">{{ state.data.value }}</p>
      <template v-else>
        <input
          class="data__value"
          type="text"
          placeholder="Vertex value"
          ref="inputElement"
          v-model="state.input"
          @keyup.enter="setValue"
        />
      </template>
      <p>
        (Degree:{{ edgeCount }},Tails:{{ tailCount }},Heads:{{ headCount }})
      </p>
      <button @click="store.connect(props.id)">Extend</button>
      <input
        type="text"
        placeholder="Connect to VID"
        ref="connectElement"
        v-model="state.connect"
        @keyup.enter="connect"
      />
      <label :for="`show-heads-${id}`">
        Heads
        <input
          :id="`show-heads-${id}`"
          type="checkbox"
          v-model="state.showHeads"
        />
      </label>
    </article>

    <span
      class="edge"
      :class="{ '--show-corner': showHeads && heads.length }"
    ></span>
    <span class="edge-connector" v-if="showHeads"></span>

    <section v-if="showHeads" class="vertex__edges">
      <DirectedSimpleGraphVertex
        v-for="v in heads"
        :key="v.id"
        :id="v.id"
        :path="[...path, v.id]"
      />
    </section>
  </section>
</template>

<style scoped="" lang="scss">
.vertex {
  position: relative;

  display: grid;

  grid-template-columns: 0.25rem max-content 1fr;
  grid-template-rows: max-content max-content;

  grid-template-areas:
    'vertex vertex vertex'
    'edge edgeConnector vertexEdge'
    'corner edgeConnector vertexEdge';

  row-gap: 0.25rem;

  .vertex__data {
    grid-area: vertex;

    display: grid;
    grid-template-columns: max-content max-content repeat(4, 1fr);
    column-gap: var(--gap-s);
    justify-items: center;
    align-items: center;
  }
  .vertex__edges {
    grid-area: vertexEdge;
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
