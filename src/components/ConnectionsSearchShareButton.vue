<template>
  <button @click="copy_link_to_clipboard" class="btn btn-primary">
    <i class="icon-share-fill"></i> Verbindungen teilen
  </button>
  <SnackBar v-if="link_copied"> Link in Zwischenablage kopiert </SnackBar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SnackBar from './SnackBar.vue'

const link_copied = ref(false)

async function copy_link_to_clipboard() {
  navigator.clipboard.writeText(window.location)
  link_copied.value = true
  setTimeout(() => {
    link_copied.value = false
  }, 3000)
}
</script>
