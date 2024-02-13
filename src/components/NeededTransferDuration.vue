<template>
  <div class="min-transfer-duration m-3">
    Minimale Umsteigezeit:
    <a
      class="link-light"
      data-bs-toggle="tooltip"
      :data-bs-title="tooltipString"
      ref="tooltip"
      >{{ durationString }}</a
    >
    {{ distanceString }}
    {{ platformString }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tooltip } from "bootstrap";
import dayjs from 'dayjs'

import { type TransferInfo } from '../assets/ts/fptfTypes'

export default defineComponent({
  name: "NeededTransferDuration",
  props: {
    transfer: {
      type: Object as () => TransferInfo,
      required: true,
    },
  },
  mounted: function () {
    new Tooltip(this.$refs.tooltip);
  },
  computed: {
    durationString: function () {
      let transferDuration = dayjs.duration(this.transfer.frequentTraveller.duration)
      if (transferDuration.seconds() == 0) {
        return transferDuration.format("m[min]");
      } else {
        return transferDuration.format("m[min] s[sec]");
      }
    },
    distanceString: function () {
      if (this.transfer.frequentTraveller.distance == null) {
        return "";
      } else {
        return (
          ", " +
          Math.round(this.transfer.frequentTraveller.distance) +
          " m Fußweg"
        );
      }
    },
    platformString: function () {
      if (this.transfer.identicalPhysicalPlatform) {
        return " (gleicher Bahnsteig)";
      } else {
        return "";
      }
    },
    tooltipString: function () {
      switch (this.transfer.source) {
        case "RIL420":
          return (
            "Laut interner Richtlinie 420 der DB werden an diesem Bahnhof " +
            this.durationString +
            " Umsteigezeit angenommen. In der Regel ist diese Zeit ziemlich großzügig bemessen."
          );
        case "INDOOR_ROUTING":
          return (
            "Laut Wegberechnung werden an diesem Bahnhof " +
            this.durationString +
            " Umsteigezeit angenommen. In der Regel ist diese Zeit sehr knapp bemessen."
          );
        case "EFZ":
          return (
            "Laut Europäischem Fahrplanzentrum werden an diesem Bahnhof " +
            this.durationString +
            " Umsteigezeit angenommen. In der Regel ist diese Zeit ziemlich großzügig bemessen."
          );
        case "FALLBACK":
          return (
            "Für diesen Bahnhof sind uns leider keine Umsteigezeiten bekannt. Wir nehmen daher eine Mindestumsteigezeit von " +
            this.durationString +
            " an."
          );
        default:
          return "bla";
      }
    },
  },
});
</script>

<style>
.min-transfer-duration {
  grid-area: min-transfer-duration;
}
</style>
