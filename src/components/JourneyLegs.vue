<script setup lang="ts">
import { type Leg } from '@/assets/ts/fptfTypes'
import JourneyLeg from "./JourneyLeg.vue";

const props = defineProps<{
  journeyLegs: Leg[],
  showLegs: boolean
}>()

</script>

<template>
    <transition name="open">
      <div v-show="showLegs" class="journey-card-contents">
        <div>
          <div class="details-grid">
            <journey-leg
              v-for="(leg, index) in journeyLegs"
              :key="index"
              :leg="leg"
              :next-leg="journeyLegs[index + 1]"
              :second-next-leg="journeyLegs[index + 2]"
            ></journey-leg>
          </div>
        </div>
      </div>
    </transition>
</template>