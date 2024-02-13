<template>
  <outdated-info :real="durationString()" :planned="plannedDurationString()"></outdated-info>
</template>

<script setup lang="ts">
import OutdatedInfo from './OutdatedInfo.vue'
import type { Duration } from 'dayjs/plugin/duration'

const props = defineProps<{
  duration: Duration
  plannedDuration?: Duration
}>()

function durationString() {
  if (props.duration.asMinutes() < 0) {
    return '0 min'
  } else if (props.duration.asMinutes() < 60) {
    return props.duration.format('m[min]')
  } else if (props.duration.asMinutes() % 60 !== 0) {
    return props.duration.format('H[h] m[min]')
  } else {
    return props.duration.format('H[h]')
  }
}

function plannedDurationString() {
  if (props.plannedDuration) {
    if (props.plannedDuration.asMinutes() < 60) {
      return props.plannedDuration.format('m[min]')
    } else if (props.plannedDuration.asMinutes() % 60 !== 0) {
      return props.plannedDuration.format('H[h] m[min]')
    } else {
      return props.duration.format('H[h]')
    }
  } else {
    return ''
  }
}
</script>
