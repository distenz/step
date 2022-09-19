<script setup lang="ts">
/**
 * @todo Now all nodes are being rendered. We can not differentiate between nodes upon startup.
 * We have to procure a method which reduces the initial network size to a special set of nodes.
 * The reason for this requirement is that the graph is ment to be big by design, so it is unwise
 * in the long run to render the whole graph on load.
 * The other reason is that it goes against the design goal of the application, which is to present
 * the network in a UX friendly way.
 * My initial ideas for the solution is the imp of directional edges, so we can search for nodes who
 * are only pointing and not pointed to. These nodes may be an ideal starting point, and represent
 * top level data.
 */
import { graphService } from '@/services/graph.service'
import GraphNode from './GraphNode.vue'

const store = graphService()

if (0 >= store.nodeCount) {
  store.add('')
}
</script>

<template>
  <article class="graph">
    <button @click="store.add('')">Add top level node</button>
    <section>
      <GraphNode
        v-for="node in store.nodes"
        :key="node.id"
        :id="node.id"
        :path="[node.id]"
      />
    </section>
  </article>
</template>

<style scoped lang="scss">
.graph {
  display: flex;
  flex-direction: column;
  width: 100%;

  section {
    border-radius: 2px;
    border: 1px solid #ccc;
  }
}
</style>
