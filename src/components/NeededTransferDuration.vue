<template>
  <div class="min-transfer-duration m-3">
    Minimale Umsteigezeit: {{ durationString }}{{ distanceString }}
  </div>
</template>

<script lang="ts">
import { Duration } from "dayjs/plugin/duration";
import { defineComponent } from "vue";

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
  },
});
</script>

<style>
.min-transfer-duration {
  grid-area: min-transfer-duration;
}
</style>
