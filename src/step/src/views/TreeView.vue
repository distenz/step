<script setup lang="ts">
import { graphService } from '@/services/graph.service'
import { computed, reactive } from 'vue'
import DirectedSimpleGraphVertex from '../components/DirectedSimpleGraphVertex.vue'

const store = graphService(),
  logVertices = () => console.log(store.V),
  logEdges = () => console.log(store.E),
  orientation = computed(() =>
    state.orientation === 'tailless' ? store.onlyHeadV : [store.topDegreeV]
  ),
  state = reactive({
    orientation: 'hottest',
  })
</script>

<template>
  <section class="graph">
    <header class="graph__actions">
      <button @click="logVertices">Log Vertices</button>
      <button @click="logEdges">Log Edges</button>
      <button a-btn="raised" @click="store.addV('')">Add vertex</button>
      <span> Orientation: </span>
      <label>
        Tailless
        <input
          type="radio"
          name="orientation"
          v-model="state.orientation"
          value="tailless"
        />
      </label>
      <label>
        Most degrees
        <input
          type="radio"
          name="orientation"
          v-model="state.orientation"
          value="hottest"
        />
      </label>
    </header>
    <section class="graph__list">
      <DirectedSimpleGraphVertex
        v-for="v in orientation"
        :key="v.id"
        :id="v.id"
        :path="[v.id]"
      />
    </section>
  </section>
</template>

<style scoped lang="scss">
.graph {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;

  & > button {
    width: auto;
    flex: 0 1 auto;
  }

  .graph__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-s);
  }

  .graph__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
