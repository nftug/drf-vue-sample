<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
 export default {
   metaInfo() {
     return {
       titleTemplate: titleChunk =>
         titleChunk ? `${titleChunk} - DRF Sample` : "DRF Sample"
     }
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
