<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import AutoSuggest from './AutoSuggest.vue'

const store = useMainStore()
const { stations, alphaSearchParams } = storeToRefs(store)

const config = ref({
  // Get more from https://flatpickr.js.org/options/
  enableTime: true,
  time_24hr: true,
  dateFormat: 'Z',
  altInput: true,
  altFormat: 'd.m.Y H:i'
})

const originValid = ref(false)
const destinationValid = ref(false)

function routing() {
  if (originValid.value && destinationValid.value) {
    store.fetchStations().then(async () => {
      store.getJourneys()
    })
  }
}

function swapOriginDestination() {
  ;[alphaSearchParams.value.origin, alphaSearchParams.value.destination] = [
    alphaSearchParams.value.destination,
    alphaSearchParams.value.origin
  ]
}

store.fetchStations()
</script>

<template>
  <form @submit.prevent="routing()" class="bg-dark p-3 my-3 rounded">
    <!-- Heading -->
    <h3 style="text-align: center">
      <strong>Verbindungen Suchen</strong>
    </h3>

    <!-- Start Bhf Form-->
    <label for="start" class="form-label visually-hidden">Von</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="start"
        class="form-control p-0"
        v-model:value="alphaSearchParams.origin"
        v-model:is_valid="originValid"
        :values="stations"
        placeholder="Von Bahnhof"
      >
      </auto-suggest>
    </div>

    <!-- End Bhf Form -->
    <label for="destination" class="form-label visually-hidden">Nach</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="destination"
        class="form-control p-0"
        v-model:value="alphaSearchParams.destination"
        v-model:is_valid="destinationValid"
        :values="stations"
        placeholder="Nach Bahnhof"
      >
      </auto-suggest>
      <span class="btn btn-primary" @click="swapOriginDestination"
        ><i class="icon icon-arrow-down-up" style="vertical-align: middle"></i
      ></span>
    </div>

    <!-- Date Form -->
    <label for="datetime" class="form-label visually-hidden">Datum und Uhrzeit</label>
    <div class="input-group mb-3 rounded overflow-hidden">
      <span class="input-group-text"><i class="icon icon-calendar"></i></span>
      <flat-pickr
        v-model="alphaSearchParams.departure"
        :config="config"
        class="form-control"
        placeholder="Datum und Uhrzeit auswählen"
        name="datetime"
      >
      </flat-pickr>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <input class="btn btn-primary" id="" name="submit" type="submit" value="SUCHEN" />
    </div>
  </form>
</template>

<style lang="scss">
@import '../assets/css/flatpickr.scss';
</style>
