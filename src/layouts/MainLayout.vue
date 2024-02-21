<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
</script>

<template>
  <NavBar></NavBar>

  <main>
    <slot />
  </main>

  <PageFooter></PageFooter>
</template>
