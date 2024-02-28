<script setup lang="ts">
import SingleViewLayout from '@/layouts/SingleViewLayout.vue'
import JourneyAndAlternativeDisplay from '@/components/JourneyAndAlternativeDisplay.vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

const store = useMainStore()

const { journeysAndAlternatives, alphaSearchParams } = storeToRefs(store)
</script>

<template>
  <single-view-layout>
    <template v-slot:nav-body>
      <div>
        <div class="row">
          <b class="col-3 text-end">Start:</b>
          <div class="col">{{ alphaSearchParams.origin }}</div>
        </div>
        <div class="row">
          <b class="col-3 text-end">Ziel:</b>
          <div class="col">{{ alphaSearchParams.destination }}</div>
        </div>
      </div>
    </template>
    <div class="max-width">
      <JourneyAndAlternativeDisplay
        :journeys="journeysAndAlternatives"
        v-if="journeysAndAlternatives.length"
      />
      <div v-else class="d-flex justify-content-center">

        <div  class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </single-view-layout>
</template>
