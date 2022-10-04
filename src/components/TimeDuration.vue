<template>
  <div class="duration">
    {{ durationString }}
    <del v-if="showPlannedDuration" class="outdated d-block">
      {{ plannedDurationString }}
    </del>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Duration } from "dayjs/plugin/duration";

export default defineComponent({
  name: "TimeDuration",
  props: {
    duration: {
      type: null as Duration,
      required: true,
    },
    plannedDuration: {
      type: null as Duration,
      required: false,
      default: null,
    },
  },
  computed: {
    durationString: function () {
      if (this.duration.asMinutes() < 60) {
        return this.duration.format("m[min]");
      } else if (this.duration.asMinutes() % 60 !== 0) {
        return this.duration.format("H[h] m[min]");
      }
      else {
        return this.duration.format("H[h]");
      }
    },
    plannedDurationString: function () {
      if (this.plannedDuration == null) {
        return "";
      }
      if (this.plannedDuration.asMinutes() < 60) {
        return this.plannedDuration.format("m[min]");
      } else {
        return this.plannedDuration.format("H[h] m[min]");
      }
    },
    showPlannedDuration: function () {
      return (
        this.plannedDuration != null &&
        this.duration.asSeconds() !== this.plannedDuration.asSeconds()
      );
    },
  },
});
</script>
