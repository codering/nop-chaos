<script setup lang="ts">
import { onMounted } from 'vue'
import {AmisToast} from '@nop-chaos/plugin-amis';

onMounted(() => {
  console.log(`the component is now mounted.`)
})

</script>

<template>
  <AmisToast theme="cxd"/>
  <main>
    <RouterView />
  </main>
<!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
