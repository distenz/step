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
      <button @click="next(v)">
        {{ v.id }}
      </button>
    </li>
  </ul>
</template>

<style scoped="" lang="scss">
ul {
  padding: 0;
  list-style: none;

  display: flex;

  border-bottom: 1px solid var(--color-accent);

  & > li:not(:last-child) {
    border-right: 1px solid var(--color-accent);
  }
}
</style>
