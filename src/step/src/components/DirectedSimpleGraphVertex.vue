<script setup="" lang="ts">
import { cursorService } from '@/services/cursor.service'
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import { computed, onMounted, reactive, ref } from 'vue'

const store = graphService(),
  cursor = cursorService(),
  props = defineProps<{
    id: IVertex['id']
    path: Array<IVertex['id']>
  }>(),
  state = reactive({
    input: '',
    connect: null,
    showHeads: cursor.path.includes(props.id),
    data: store.getV(props.id),
  }),
  inputElement = ref<HTMLInputElement | undefined>()

if (!state.data) throw new Error()

const heads = computed(() => store.heads(state.data)),
  tails = computed(() => store.tails(state.data)),
  edgeCount = computed(() => state.data.edges.length),
  headCount = computed(() => heads.value.length),
  tailCount = computed(() => tails.value.length),
  showHeads = computed(
    () =>
      (state.showHeads || cursor.current?.id === props.id) &&
      headCount.value > 0
  ),
  active = computed(() => props.id === cursor.current?.id)

if (!cursor.current) {
  cursor.start()
}

onMounted(() => {
  inputElement.value?.focus()
})

function setValue() {
  if (!state.input) return
  if (!state.data) return
  state.data.value = state.input
  state.input = ''
}
function extend() {
  store.connect(props.id)
  state.showHeads = true
}
function connect() {
  if (!state.connect) return
  store.connect(props.id, +state.connect)
  state.connect = null
  state.showHeads = true
}
function setCurrent() {
  cursor.next(props.id, props.path)
}
function remove() {
  store.removeV(props.id)
}
</script>

<template>
  <section class="vertex" @click.ctrl.exact="setCurrent" tabindex="0">
    <article class="vertex__data" :class="{ active }" :tabindex="id">
      <span class="data__id">#{{ id }}</span>
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
      <label :for="`show-heads-${id}`">
        <span v-show="!active && headCount > 0">
          More
          <input
            :id="`show-heads-${id}`"
            type="checkbox"
            v-model="state.showHeads"
          />
        </span>
      </label>
      <p>(D:{{ edgeCount }},T:{{ tailCount }},H:{{ headCount }})</p>
      <button @click="extend" title="Add to this">+</button>
      <button @click="setCurrent" title="Select this">o</button>
      <button @click="remove" title="Select this">d</button>
      <input
        type="text"
        placeholder="Connect"
        ref="connectElement"
        v-model="state.connect"
        @keyup.enter="connect"
      />
    </article>
    <template v-if="showHeads">
      <span class="edge"></span>
      <span class="edge-connector"></span>

      <section class="vertex__edges">
        <DirectedSimpleGraphVertex
          v-for="v in heads"
          :key="v.id"
          :id="v.id"
          :path="[...path, v.id]"
        />
      </section>
    </template>
  </section>
</template>

<style scoped="" lang="scss">
.vertex {
  position: relative;

  display: grid;

  grid-template-columns: 0.25rem max-content 1fr;
  grid-auto-rows: min-content;

  grid-template-areas:
    'vertex vertex vertex'
    'edge spacer vertexEdge';

  row-gap: 0.25rem;

  .vertex__data {
    grid-area: vertex;

    display: grid;
    grid-template-columns: max-content 1fr repeat(6, max-content);
    column-gap: var(--gap-s);
    justify-items: end;
    align-items: center;

    &.active {
      border: 1px solid var(--color-accent);
    }

    & > .data__id,
    & > .data__value {
      justify-self: start;
    }
    & > .data__value {
      font-weight: bold;
    }
  }
  .vertex__edges {
    grid-area: vertexEdge;
  }
  .edge {
    grid-area: edge;
    height: 100%;

    background-color: var(--color-accent);

    // &.--show-corner {
    //   grid-row-start: edge;
    //   grid-column-start: edge;
    //   grid-row-end: corner;
    //   grid-column-end: corner;
    // }
  }
  .edge-connector {
    grid-area: spacer;

    width: 0.5rem;
    height: 0.25rem;
    align-self: center;
    // background-color: var(--color-accent);
  }
}
</style>
