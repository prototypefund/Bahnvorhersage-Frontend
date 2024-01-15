<template>
  <body>
    <NavBar></NavBar>

    <main>
      <router-view id="content" />
    </main>

    <PageFooter></PageFooter>

    <!-- Update Service worker -->
    <SnackBar v-if="updateExists">
      Ein Update ist verfügbar
      <template v-slot:action>
        <div @click="refreshApp" class="click_text">UPDATE</div>
      </template>
    </SnackBar>
    <ErrorDisplay></ErrorDisplay>
  </body>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import PageFooter from './components/PageFooter.vue'
import SnackBar from './components/SnackBar.vue'
import ErrorDisplay from './components/ErrorDisplay.vue'
import update from './assets/js/update' // TODO: add this as mixin
import printLogo from './assets/js/bahnvorhersageLogo'

const refreshing = ref(false)
const registration = ref(null)
const updateExists = ref(false)

function updateAvailable(event: CustomEvent) {
  registration.value = event.detail
  updateExists.value = true
}

function refreshApp() {
  updateExists.value = false
  // Make sure we only send a 'skip waiting' message if the SW is waiting
  if (!registration.value || !registration.value.waiting) return
  // send message to SW to skip the waiting and activate the new SW
  registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
}

onMounted(() => {
  printLogo()
  document.addEventListener('sw_updated', updateAvailable);

  // Prevent multiple refreshes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing.value) return
    refreshing.value = true
    // Here the actual reload of the page occurs
    window.location.reload()
  })
})
</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap';
@import 'src/assets/fonts/icons/icons.scss';

.input-group-text {
  font-size: 2rem;
}

i {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icons' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
}

.content-container {
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 2em 4em rgba(0, 0, 0, 0.8);
  padding-top: $spacer * 5;
  padding-bottom: $spacer * 5;
  min-height: 85vh;
}

html,
body,
#intro {
  height: 100%;
}

body {
  background-image: url(./assets/img/background_bold_blur.webp);
  background-position-x: center;
  background-position-y: 70px;
  background-repeat: no-repeat;
  background-size: contain;
  background-attachment: fixed;
  background-color: $page_background;
  overflow: auto;
  color: $text_color;
}

.text-content {
  max-width: calc(75ch + $spacer * 1.5);
  margin: auto !important;
  padding: 0 $spacer * 1.5;
}

.stats {
  height: 100%;
  margin: 20px;
}

.stats-picker {
  display: flex;
  justify-content: space-around;
  margin: auto;
  width: 100%;
  gap: 60px;
  align-items: center;
  height: max-content;
  margin-top: 3em;

  .slider {
    width: max-content;
    flex-grow: 1;
  }
}

.stats-image {
  max-height: 70vh;
  max-width: 100%;
  margin: auto;
  display: block;
}

@media (max-width: 1000px) {
  .stats-picker {
    flex-wrap: wrap;
  }
}

.disclaimer {
  color: $gray-500;
}

@include media-breakpoint-up(sm) {
  .search {
    padding: 3em;
  }
}

.form-check-label {
  text-shadow: 0px 0px 1px $text_color;
  transition: color 0.1s;
}

.form-check-label.inactive {
  text-shadow: none;
}
</style>
