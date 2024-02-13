<template>
  <form @submit.prevent="get_connections" class="bg-dark">
    <!-- Heading -->
    <h3 style="text-align: center">
      <strong>Verbindungen bewerten</strong>
    </h3>

    <!-- Start Bhf Form-->
    <label for="start" class="form-label">Von</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="start"
        class="form-control p-0"
        v-model:value="searchParams.start"
        v-model:is_valid="start_valid"
        :values="stations"
        placeholder="Bahnhof"
      >
      </auto-suggest>
    </div>

    <!-- End Bhf Form -->
    <label for="destination" class="form-label">Nach</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="destination"
        class="form-control p-0"
        v-model:value="searchParams.destination"
        v-model:is_valid="destination_valid"
        :values="stations"
        placeholder="Bahnhof"
      >
      </auto-suggest>
      <span class="btn btn-primary" @click="swap_stations"
        ><i class="icon icon-arrow-down-up" style="vertical-align: middle"></i
      ></span>
    </div>

    <!-- Date Form -->
    <label for="datetime" class="form-label">Datum und Uhrzeit</label>
    <div class="input-group mb-3">
      <span class="input-group-text"><i class="icon icon-calendar"></i></span>
      <flat-pickr
        v-model="searchParams.date"
        :config="config"
        class="form-control"
        placeholder="Datum und Uhrzeit auswählen"
        name="datetime"
      >
      </flat-pickr>
      <toggle-switch
        class="align-self-center"
        style="padding: 6px 12px"
        v-model="searchParams.search_for_arrival"
      ></toggle-switch>
    </div>

    <div class="d-flex justify-content-around flex-wrap">
      <!-- Only regional checkbox -->
      <check-box
        class="mb-3"
        v-model="searchParams.only_regional"
        id="only_regional"
        label="Nur Nahverkehr"
        :inline="true"
      ></check-box>
      <!-- Bike checkbox -->
      <check-box
        class="mb-3"
        v-model="searchParams.bike"
        id="bike"
        label="Fahrradmitnahme"
        :inline="true"
      ></check-box>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <input class="btn btn-primary" id="" name="submit" type="submit" value="SUCHEN" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import AutoSuggest from './AutoSuggest.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import CheckBox from './CheckBox.vue'

import('flatpickr/dist/themes/dark.css')

const store = useMainStore()
const { stations, searchParams: searchParams } = storeToRefs(store)

const router = useRouter()

const config = ref({
  // Get more from https://flatpickr.js.org/options/
  enableTime: true,
  time_24hr: true,
  dateFormat: 'd.m.Y H:i',
  altFormat: 'd.m.Y H:i'
})

const start_valid = ref(false)
const destination_valid = ref(false)

function get_connections() {
  if (start_valid.value && destination_valid.value) {
    store.fetchStations().then(async () => {
      router.push({
        path: '/connections',
        query: convert_values_to_string(searchParams.value)
      })
      store.get_connections()
    })
  }
}
function convert_values_to_string(object: any) {
  return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, String(v)]))
}
function swap_stations() {
  ;[searchParams.value.start, searchParams.value.destination] = [
    searchParams.value.destination,
    searchParams.value.start
  ]
}

store.fetchStations()
</script>

<style lang="scss">
@import '../assets/css/flatpickr.scss';
</style>
