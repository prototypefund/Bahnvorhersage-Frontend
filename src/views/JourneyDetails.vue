<script setup lang="ts">
import SingleViewLayout from '@/layouts/SingleViewLayout.vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import JourneyLegs from '@/components/JourneyLegs.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const store = useMainStore()
const route = useRoute()

const { journeysAndAlternatives } = storeToRefs(store)

const index = Number(route.params.index)

const journeyAndAlternatives = ref(journeysAndAlternatives.value[index])
</script>

<template>
  <single-view-layout>
    <div class="journey-card widen-content">
      <journey-legs
        :journeyLegs="journeyAndAlternatives.journey.legs"
        :showLegs="true"
      ></journey-legs>
    </div>
  </single-view-layout>
</template>

<style lang="scss">
.widen-content {
    width: $content-width;
    max-width: 100%;
}
</style>