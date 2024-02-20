<script setup lang="ts">
import { ref } from 'vue'
import { type Journey } from '@/assets/ts/fptfTypes'
import JourneyLegs from './JourneyLegs.vue'
import JourneyHeader from './JourneyHeader.vue'
import { rdylgrColormap } from '@/assets/ts/colormap'
import { getJourneySummary } from '@/assets/ts/fptfHelpers'


const props = defineProps<{
  journey: Journey
}>()

const summary = ref(getJourneySummary(props.journey))
const showLegs = ref(false)

const borderColor = ref({
  ...(summary.value.connectionScore && {
    'border-left-color': rdylgrColormap(summary.value.connectionScore, 50, 100, 200)
  })
})
</script>

<template>
  <div :style="borderColor" class="journey-card pointer-cursor">
    <journey-header @click="showLegs = !showLegs" :journey="journey"></journey-header>
    <journey-legs :journeyLegs="journey.legs" :showLegs="showLegs"></journey-legs>
  </div>
</template>