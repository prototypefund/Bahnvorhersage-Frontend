<template>
  <div v-if="!('walking' in leg) || !leg.walking" style="display: contents">
    <div class="leg">
      <outdated-info
        class="time start"
        :real="dayjs(leg.departure).format('HH:mm')"
        :planned="leg.plannedDeparture ? dayjs(leg.plannedDeparture).format('HH:mm') : undefined"
      >
      </outdated-info>

      <div class="station_delay_line_container">
        <i class="icon icon-record-fill station-marker" :style="start_style" style="top: 15px"></i>
        <div v-bind:style="gradient_line" class="station_delay_line"></div>
        <i
          class="icon icon-record-fill station-marker"
          :style="destination_style"
          style="bottom: 15px"
        ></i>
      </div>

      <div class="station start">
        {{ leg.origin.name }}
      </div>

      <outdated-info
        class="platform start"
        v-if="leg.departurePlatform"
        :real="'Gl. ' + leg.departurePlatform"
        :planned="leg.plannedDeparturePlatform ? 'Gl. ' + leg.plannedDeparturePlatform : undefined"
      ></outdated-info>

      <time-duration class="duration" :duration="durations.duration" :planned-duration="durations.plannedDuration">
      </time-duration>

      <div class="train">
        <img
          v-if="leg.line.productName in train_icons"
          v-bind:src="train_icons[leg.line.productName as keyof typeof train_icons]"
        />
        {{ leg.line.name }} {{ leg.direction ? 'nach ' + leg.direction : ''}}
      </div>

      <outdated-info
        class="time destination"
        :real="dayjs(leg.arrival).format('HH:mm')"
        :planned="leg.plannedArrival ? dayjs(leg.plannedArrival).format('HH:mm') : undefined"
      >
      </outdated-info>

      <div class="station destination">
        {{ leg.destination.name }}
      </div>

      <outdated-info
        class="platform destination"
        v-if="leg.arrivalPlatform"
        :real="'Gl. ' + leg.arrivalPlatform"
        :planned="leg.plannedArrivalPlatform ? 'Gl. ' + leg.plannedArrivalPlatform : undefined"
      ></outdated-info>
    </div>

    <div v-if="nextLeg" class="transfer">
      <time-duration v-if="transferDuration" class="duration"
        :duration="transferDuration"
      ></time-duration>

      <div class="transfer-line-container">
        <div class="transfer-line"></div>
      </div>

      <div class="score m-3" v-if="leg.transferScore">
        Verbindungs-Score:
        <span v-bind:style="transfer_score_color">{{ Math.trunc(leg.transferScore * 100) }}%</span>
      </div>

      <needed-transfer-duration
        v-if="leg.neededTransferTime"
        :transfer="leg.neededTransferTime"
      />

      <div v-if="'walking' in nextLeg && nextLeg.walking" class="walk">
        <div class="m-3">
          <i class="icon icon-person-walking-solid"></i>
          {{  }} <time-duration class="duration m-0" :duration="walkDuration()" style="display: inline" />
          ({{ nextLeg.distance }} m) Fußweg
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { rdylgrColormap, rdylgrCSSLinearGradient } from '../assets/ts/colormap'
import TimeDuration from './TimeDuration.vue'
import NeededTransferDuration from './NeededTransferDuration.vue'
import OutdatedInfo from './OutdatedInfo.vue'
import { type Leg } from '../assets/ts/fptfTypes'
import { getDurationsOfLeg } from '../assets/ts/fptfHelpers'

import iceUrl from '../assets/img/ICE.svg'
import icUrl from '../assets/img/IC.svg'
import reUrl from '../assets/img/RE.svg'
import sUrl from '../assets/img/S.svg'
import rbUrl from '../assets/img/RB.svg'

const props = defineProps<{
  leg: Leg
  nextLeg?: Leg
  secondNextLeg?: Leg
}>()

const durations = ref(getDurationsOfLeg(props.leg))

const transferDuration = computed(() => {
  if (!props.nextLeg) {
    return undefined
  }
  if ('walking' in props.nextLeg && props.nextLeg.walking) {
    if (!props.secondNextLeg) {
      return undefined
    } else {
      return dayjs.duration(dayjs(props.secondNextLeg.departure).diff(props.leg.arrival))
    }
  } else {
    return dayjs.duration(dayjs(props.nextLeg.departure).diff(props.leg.arrival))
  }
})

// function transferDuration() {
//   if (!props.nextLeg) {
//     return undefined
//   }
//   if ('walking' in props.nextLeg && props.nextLeg.walking) {
//     if (!props.secondNextLeg) {
//       return undefined
//     } else {
//       return dayjs.duration(dayjs(props.secondNextLeg.departure).diff(props.leg.arrival))
//     }
//   } else {
//     return dayjs.duration(dayjs(props.nextLeg.departure).diff(props.leg.arrival))
//   }
// }

const train_icons = {
  ICE: iceUrl,
  IC: icUrl,
  EC: icUrl,
  RE: reUrl,
  IRE: reUrl,
  S: sUrl,
  RB: rbUrl
}

const transfer_score_color = ref({
  ...(props.leg.transferScore && {
    color: rdylgrColormap(props.leg.transferScore, 0.5, 1, 200)
  })
})

const gradient_line = ref({
  ...(props.leg.departurePrediction &&
    props.leg.arrivalPrediction && {
      'background-image': rdylgrCSSLinearGradient(
        props.leg.departurePrediction,
        props.leg.arrivalPrediction,
        10
      )
    })
})

const start_style = ref({
  ...(props.leg.departurePrediction && {
    color: rdylgrColormap(props.leg.departurePrediction, 0.2, 0.8, 200)
  })
})

const destination_style = ref({
  ...(props.leg.arrivalPrediction && {
    color: rdylgrColormap(props.leg.arrivalPrediction, 0.2, 0.8, 200)
  })
})

function walkDuration() {
  if (!props.nextLeg) {
    return dayjs.duration(0)
  }
  return dayjs.duration(dayjs(props.nextLeg.arrival).diff(props.nextLeg.departure))
}
</script>

<style lang="scss">
$time_col_width: 9ch;
$fancy_line_width: 16px;

.details-grid {
  margin: 10px;
  display: inline-grid;
  grid-template-columns: 1fr;
  width: calc(100% - 20px);
  max-width: calc(100% - 20px);
}

.leg {
  @include border-radius;
  display: inline-grid;
  padding: 15px 0;
  grid-template-columns:
    $time_col_width $fancy_line_width 1fr
    max-content;
  grid-template-areas:
    'time-start fancy-line station-start platform-start'
    'duration fancy-line train train'
    'time-destination fancy-line station-destination platform-destination';
  background-color: $page_lighter_gray;
}

.station {
  @include border-radius;
  margin: 10px 0;
  padding: 5px;
  font-weight: bold;

  overflow-wrap: anywhere;
  hyphens: auto;

  &.start {
    grid-area: station-start;
  }

  &.destination {
    grid-area: station-destination;
  }
}

.time {
  margin: 15px 5px 15px 15px;
  height: 24px;
  text-align: end;
  font-weight: bold;

  &.start {
    grid-area: time-start;
    align-self: start;
  }

  &.destination {
    grid-area: time-destination;
    align-self: end;
  }
}

.duration {
  margin: 15px 5px;
  height: 1.4em;
  text-align: end;
  grid-area: duration;
  align-self: center;
}

.platform {
  margin: 15px;
  text-align: end;

  &.start {
    grid-area: platform-start;
    align-self: start;
  }

  &.destination {
    grid-area: platform-destination;
    align-self: end;
  }
}

.train {
  margin: 15px 5px;
  grid-area: train;
  overflow-wrap: anywhere;
  hyphens: auto;

  img {
    height: 20px;
  }
}

.score {
  grid-area: score;
}

.transfer {
  display: grid;
  grid-template-columns: $time_col_width $fancy_line_width 1fr;
  grid-template-areas:
    'duration fancy-line score'
    'duration fancy-line min-transfer-duration'
    'duration fancy-line walk';
}

.walk {
  grid-area: walk;
}

.station_delay_line_container {
  grid-area: fancy-line;
  display: grid;
  position: relative;
}

.station_delay_line {
  width: 2px;
  margin: 28px auto;
  z-index: 2;
  background-color: $text_color;
}

.station-marker {
  z-index: 3;
  position: absolute;
  line-height: 24px;
}

.transfer-line-container {
  grid-area: fancy-line;
  display: flex;
  justify-content: center;
}

.transfer-line {
  border: 1px dashed $page_outdated_text;
  align-self: center;
  z-index: 1;
  height: calc(100% + 16ch);
}
</style>
