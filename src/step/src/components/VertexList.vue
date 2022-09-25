<script setup="" lang="ts">
import { cursorService } from '@/services/cursor.service'
import type { IVertex } from '@/utility/vertex.interface'

defineProps<{ list: Array<IVertex> }>()
const cursor = cursorService()

function next(v: IVertex) {
  cursor.next(v)
}
</script>

<template>
  <ul>
    <li v-for="v in list" :key="v.id">
      #{{ v.id }}: {{ v.value }}
      <button @click="next(v)">Select</button>
    </li>
  </ul>
</template>

<style scoped="" lang="scss">
ul {
  padding: 0;
  list-style: none;

  display: flex;
  flex-direction: column;

  border-top: 1px solid var(--color-accent);

  & > li:not(:last-child) {
    border-bottom: 1px solid var(--color-accent);
  }
}
</style>
