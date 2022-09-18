<script setup lang="ts">
import GraphNode from './GraphNode.vue'
defineProps(['edgeId', 'type'])
</script>

<template>
  <p>Edge#{{ edgeId }} - {{ type }}</p>
  <GraphNode />
</template>

<stype scoped=""></stype>
