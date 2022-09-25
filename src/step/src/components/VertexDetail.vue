<script setup="" lang="ts">
import { graphService } from '@/services/graph.service'
import type { IVertex } from '@/utility/vertex.interface'
import VertexTab from './VertexTab.vue'
import VertexList from './VertexList.vue'
import { computed } from 'vue'

const props = defineProps<{ vertex: IVertex }>(),
  store = graphService(),
  tails = computed(() => store.tails(props.vertex.id)),
  heads = computed(() => store.heads(props.vertex.id))
</script>

<template>
  <article>
    <header v-if="tails.length">
      <VertexTab :list="tails" />
    </header>
    {{ vertex }}
    <footer v-if="heads.length">
      <VertexList :list="heads" />
    </footer>
  </article>
</template>

<style scoped="" lang="scss"></style>
