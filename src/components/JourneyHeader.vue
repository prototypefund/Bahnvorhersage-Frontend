<template>
  <div class="journey-card-header">
    <div class="p-3 col1">
      <div>
        <outdated-info
          :real="dayjs(journey.legs[0].departure).format('HH:mm')"
          :planned="dayjs(journey.legs[0].plannedDeparture).format('HH:mm')"
        ></outdated-info>
      </div>

      <div>
        <outdated-info
          :real="dayjs(journey.legs[journey.legs.length - 1].arrival).format('HH:mm')"
          :planned="dayjs(journey.legs.at(-1).plannedArrival).format('HH:mm')"
        ></outdated-info>
      </div>
    </div>
    <div class="p-3 col2">
      <time-duration
        :duration="summary.duration"
        :plannedDuration="summary.plannedDuration"
      ></time-duration>
    </div>
    <div class="p-3 col3">{{ summary.transfers }}</div>
    <div class="p-3 col4">
      {{ summary.categories.join(', ') }}
    </div>
    <div class="p-3 col5" v-bind:style="[text_color]">{{ summary.connectionScore }}%</div>
    <AffiliateLink
      class="col6"
      :date="dayjs(journey.legs[0].departure)"
      :time="dayjs(journey.legs[0].departure)"
      :price="('price' in journey) ? journey.price : undefined"
      :start="journey.legs[0].origin.name"
      :destination="journey.legs.at(-1).destination.name"
    ></AffiliateLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { rdylgrColormap } from '../assets/ts/colormap'
import AffiliateLink from './AffiliateLink.vue'
import { type Journey } from '@/assets/ts/fptfTypes'
import OutdatedInfo from './OutdatedInfo.vue'
import { getJourneySummary } from '@/assets/ts/fptfHelpers'
import TimeDuration from './TimeDuration.vue'

const props = defineProps<{
  journey: Journey
}>()

const summary = ref(getJourneySummary(props.journey))

const text_color = ref({
  color: rdylgrColormap(summary.value.connectionScore, 50, 100, 200)
})
</script>
