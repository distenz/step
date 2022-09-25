<script setup="" lang="ts">
import { cursorService } from '@/services/cursor.service'
import { graphService } from '@/services/graph.service'
import VertexDetail from '../components/VertexDetail.vue'

const cursor = cursorService()
if (!cursor.current)
  try {
    cursor.start()
  } catch (e) {
    const store = graphService()
    if (!store.V.length) {
      store.addV('')
      cursor.start()
    } else console.error(e)
  }
</script>

<template>
  <main>
    <template v-if="cursor.current !== null">
      <VertexDetail :vertex="cursor.current" />
    </template>
  </main>
</template>

<style scoped="" lang="scss"></style>
