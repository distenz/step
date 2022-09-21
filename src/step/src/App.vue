<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="32"
      height="32"
    />

    <nav>
      <RouterLink to="/">Create Graph #1</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  gap: 1rem;

  background-color: val(--color-background);

  nav {
    display: flex;
    flex-direction: 0.5rem;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;

    a.router-link-exact-active {
      color: var(--color-text);
    }
  }
}
</style>
