<template>
  <main-layout>
    <div id="stats" class="stations p-5 bg-black">
      <h1 class="text-center">Verspätungen in Deutschland</h1>
      <div v-if="sliderDates.length" class="stats-picker">
        <Slider
          class="slider"
          v-if="values.length"
          v-model="values"
          :merge="merge"
          :max="sliderDates.length - 1"
          :format="format"
          style="width: 200px"
        />
        <input
          class="btn btn-primary"
          type="button"
          value="Plot generieren"
          v-on:click="updatePlot"
        />
      </div>
      <img
        class="stats-image"
        id="stats_image"
        v-if="plotURL"
        :src="plotURL"
        @error="on_error"
        @load="loaded_img()"
      />
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import Slider from '@vueform/slider'
import { default as dayjs } from 'dayjs'
import MainLayout from '@/layouts/MainLayout.vue'

const store = useMainStore()
const { progressing } = storeToRefs(store)

const values = ref<number[]>([])
const sliderDates = ref<string[]>([])
const plotURL = ref(
  window.location.protocol + '//' + window.location.host + '/api/stationplot/default.webp'
)

const merge = computed(() => {
  /*
   * When the slider ends are this many ticks apart, merge their labels
   */
  const default_slider_length = 400
  const distance_to_merge = 120
  const n_ticks = sliderDates.value.length || 1
  return Math.ceil((distance_to_merge * n_ticks) / default_slider_length)
})

function initialize() {
  progressing.value = true
  fetch(window.location.protocol + '//' + window.location.host + '/api/stationplot/limits', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => store.display_fetch_error(response))
    .then((response) => response.json())
    .then((limits) => {
      limits.min = dayjs(limits.min, 'YYYY-MM-DD')
      limits.max = dayjs(limits.max, 'YYYY-MM-DD')

      const dates = [limits.min] as dayjs.Dayjs[]
      while (dates[dates.length - 1].isBefore(limits.max)) {
        dates.push(dates[dates.length - 1].add(limits.freq, 'hours'))
      }
      sliderDates.value = dates.map((date) => date.format('DD.MM.YYYY'))
      values.value = [0, sliderDates.value.length - 1]
    })
}

function updatePlot() {
  const new_url =
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/stationplot/' +
    sliderDates.value[values.value[0]] +
    '-' +
    sliderDates.value[values.value[1]] +
    '.webp'
  if (new_url !== plotURL.value) {
    progressing.value = true
    plotURL.value = new_url
  }
}
function loaded_img() {
  progressing.value = false
  document.getElementById('stats_image')?.scrollIntoView({ behavior: 'smooth' })
}
function format(index: number) {
  return sliderDates.value[index]
}
function on_error(event: Event) {
  store.display_img_load_error(event)
}

onMounted(() => {
  initialize()
})
</script>

<style>
@import '@vueform/slider/themes/default.css';
</style>
