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
        v-model:value="search_params.start"
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
        v-model:value="search_params.destination"
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
        v-model="search_params.date"
        :config="config"
        class="form-control"
        placeholder="Datum und Uhrzeit auswählen"
        name="datetime"
      >
      </flat-pickr>
      <toggle-switch
        class="align-self-center"
        style="padding: 6px 12px"
        v-model="search_params.search_for_arrival"
      ></toggle-switch>
    </div>

    <div class="d-flex justify-content-around flex-wrap">
      <!-- Only regional checkbox -->
      <check-box
        class="mb-3"
        v-model="search_params.only_regional"
        id="only_regional"
        label="Nur Nahverkehr"
        :inline="true"
      ></check-box>
      <!-- Bike checkbox -->
      <check-box
        class="mb-3"
        v-model="search_params.bike"
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
const { stations, search_params } = storeToRefs(store)

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
    store.fetch_stations().then(async () => {
      router.push({
        path: '/connections',
        query: convert_values_to_string(search_params.value)
      })
      store.get_connections()
    })
  }
}
function convert_values_to_string(object: any) {
  return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, String(v)]))
}
function swap_stations() {
  ;[search_params.value.start, search_params.value.destination] = [
    search_params.value.destination,
    search_params.value.start
  ]
}

store.fetch_stations()
</script>

<style lang="scss">
.flatpickr-calendar,
.flatpickr-calendar.arrowTop,
.flatpickr-months .flatpickr-month,
.flatpickr-current-month,
span.flatpickr-weekday,
.flatpickr-current-month .flatpickr-monthDropdown-months {
  background: $page_gray;
}

.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange,
.flatpickr-day.selected.inRange,
.flatpickr-day.startRange.inRange,
.flatpickr-day.endRange.inRange,
.flatpickr-day.selected:focus,
.flatpickr-day.startRange:focus,
.flatpickr-day.endRange:focus,
.flatpickr-day.selected:hover,
.flatpickr-day.startRange:hover,
.flatpickr-day.endRange:hover,
.flatpickr-day.selected.prevMonthDay,
.flatpickr-day.startRange.prevMonthDay,
.flatpickr-day.endRange.prevMonthDay,
.flatpickr-day.selected.nextMonthDay,
.flatpickr-day.startRange.nextMonthDay,
.flatpickr-day.endRange.nextMonthDay {
  background: $primary;
  border-color: $primary;
}
</style>
