<template>
  <button v-if="showInstallButton" @click="install" class="btn btn-primary">
    App installieren
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showInstallButton = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent>();

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallButton.value = true;
  });
});

const install = () => {
  showInstallButton.value = false;
  deferredPrompt.value?.prompt();
};

</script>