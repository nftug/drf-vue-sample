<template>
  <div id="app">
    <GlobalHeader />
    <GlobalMessage />

    <b-container class="py-5">
      <router-view />
    </b-container>
  </div>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'

export default {
  metaInfo() {
    return {
      titleTemplate: (titleChunk) =>
        titleChunk ? `${titleChunk} - DRF Sample` : 'DRF Sample',
    }
  },
  components: {
    GlobalHeader,
    GlobalMessage,
  },
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
}
</style>
