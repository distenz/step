<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/">
      <img
        alt="Step logo"
        class="logo"
        src="@/assets/step-logo-5-1.svg"
        width="32"
        height="32"
      />
    </RouterLink>

    <nav>
      <RouterLink to="/tree">Tree view</RouterLink>
      <RouterLink to="/cursor">Cursor view</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped lang="scss">
header {
  grid-area: header;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-m);
  height: 3rem;
  padding: 0 var(--gap-s);

  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-m);

    a.router-link-exact-active {
      color: var(--color-button-hover);
    }
  }
  & + * {
    grid-area: main;
    padding: var(--gap-s);
    overflow: auto;
  }
}
</style>
