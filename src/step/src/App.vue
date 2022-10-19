<script setup lang="ts">
import { RouterView } from 'vue-router'
import { tripleStore } from '@/stores/triple'
import { useAsyncState } from '@vueuse/core'
/*global __APP_VERSION__*/
const version = __APP_VERSION__
const store = tripleStore(),
  { state } = useAsyncState(store.get(), [])
</script>

<template>
  <header>
    <figure to="/" id="hero">
      <img
        alt="Step logo"
        class="logo"
        src="@/assets/step-logo-5-1.svg"
        width="32"
        height="32"
      />
      <h1 id="title">STEP</h1>
      <small id="version"> v{{ version }} </small>
    </figure>
  </header>

  {{ state }}

  <RouterView />
</template>

<style scoped lang="scss">
header {
  box-sizing: border-box;
  grid-area: header;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-m);
  padding: var(--gap-s);

  #hero {
    display: grid;
    grid-template-areas: ' logo title version';

    gap: 1ch;
    box-sizing: border-box;

    & > .logo {
      grid-area: logo;
    }
    & > #title {
      font-size: 2rem;
      line-height: 1;
      grid-area: title;
    }
    & > #version {
      grid-area: version;
      align-self: start;
      line-height: 1.4;
      font-size: 1rem;
    }
  }

  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-m);

    a {
      &.router-link-exact-active {
        color: var(--color-button-hover);
      }
      & > .logo {
        object-fit: contain;
        object-position: center;
      }
    }
  }
  & + * {
    grid-area: main;
    padding: var(--gap-s);
    overflow: auto;
  }
}
</style>
