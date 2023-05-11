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
import { Duration } from "dayjs/plugin/duration";
import { defineComponent } from "vue";
import { Tooltip } from "bootstrap";

interface TransferDuration {
  duration: Duration | null;
  distance: number | null;
}

interface Transfer {
  identicalPhysicalPlatform: boolean;
  frequentTraveller: TransferDuration;
  mobilityImpaired: TransferDuration;
  occasionalTraveller: TransferDuration;
  source: "RIL420" | "INDOOR_ROUTING" | "EFZ" | "FALLBACK";
}

export default defineComponent({
  name: "NeededTransferDuration",
  props: {
    transfer: {
      type: Object as () => Transfer,
      required: true,
    },
  },
  mounted: function () {
    new Tooltip(this.$refs.tooltip);
  },
  computed: {
    durationString: function () {
      if (this.transfer.frequentTraveller.duration.seconds() == 0) {
        return this.transfer.frequentTraveller.duration.format("m[min]");
      } else {
        return this.transfer.frequentTraveller.duration.format("m[min] s[sec]");
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
