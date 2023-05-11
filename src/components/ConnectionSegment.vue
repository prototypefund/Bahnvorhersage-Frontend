<template>
  <div
    v-if="!('walking' in segment) || !segment.walking"
    style="display: contents"
  >
    <div class="leg">
      <div class="time start">
        {{ segment.departure.format("HH:mm") }}
        <del
          v-if="!segment.departure.isSame(segment.plannedDeparture)"
          class="outdated d-block"
        >
          {{ segment.plannedDeparture.format("HH:mm") }}
        </del>
      </div>

      <div class="station_delay_line_container">
        <i
          class="icon icon-record-fill station-marker"
          :style="start_style"
          style="top: 15px"
        ></i>
        <div v-bind:style="gradient_line" class="station_delay_line"></div>
        <i
          class="icon icon-record-fill station-marker"
          :style="destination_style"
          style="bottom: 15px"
        ></i>
      </div>

      <div class="station start">
        {{ segment.origin.name }}
      </div>

      <div class="platform start">
        <span v-if="segment.departurePlatform">
          Gl. {{ segment.departurePlatform }}
          <del
            v-if="
              segment.departurePlatform !== segment.plannedDeparturePlatform
            "
            class="outdated"
            >{{ segment.plannedDeparturePlatform }}</del
          >
        </span>
      </div>

      <time-duration
        :duration="segment.duration"
        :planned-duration="segment.plannedDuration"
      >
      </time-duration>

      <div class="train">
        <img
          v-if="segment.line.productName in train_icons"
          v-bind:src="train_icons[segment.line.productName]"
        />
        {{ segment.line.name }} nach {{ segment.direction }}
      </div>

      <div class="time destination">
        {{ segment.arrival.format("HH:mm") }}
        <del
          v-if="!segment.arrival.isSame(segment.plannedArrival)"
          class="outdated d-block"
        >
          {{ segment.plannedArrival.format("HH:mm") }}
        </del>
      </div>

      <div class="station destination">
        {{ segment.destination.name }}
      </div>

      <div class="platform destination">
        <span v-if="segment.arrivalPlatform">
          Gl. {{ segment.arrivalPlatform }}
          <del
            v-if="segment.arrivalPlatform !== segment.plannedArrivalPlatform"
            class="outdated"
            >{{ segment.plannedArrivalPlatform }}</del
          >
        </span>
      </div>
    </div>

    <div v-if="'transferTime' in segment" class="transfer">
      <time-duration :duration="segment.transferTime"></time-duration>

      <div class="transfer-line-container">
        <div class="transfer-line" :style="transfer_score_color"></div>
      </div>

      <div class="score m-3" v-bind:style="transfer_style">
        Verbindungs-Score:
        <span v-bind:style="transfer_score_color"
          >{{ segment.transferScore }}%</span
        >
      </div>

      <needed-transfer-duration
        v-if="'neededTransferTime' in segment"
        :transfer="segment.neededTransferTime"
      />

      <!-- <div
        v-if="'walking' in next_segment && next_segment.walking"
        class="walk"
        v-bind:style="transfer_style"
      >
        <div class="m-">
          <i class="icon icon-person-walking-solid"></i>
          davon
          <time-duration :duration="walkDuration" style="display: inline" /> und
          {{ next_segment.distance }} m Fußweg
        </div>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
import { rdylgr_colormap } from "../assets/js/colormap";
import TimeDuration from "./TimeDuration.vue";
import NeededTransferDuration from "./NeededTransferDuration.vue";

export default defineComponent({
  name: "ConnectionSegment",
  components: {
    TimeDuration,
    NeededTransferDuration,
  },
  props: ["segment", "next_segment", "con_score"],
  data: function () {
    return {
      show_details: false,
      dp_station_style: {
        "background-color": rdylgr_colormap(
          this.segment.departurePrediction,
          0.2,
          0.8,
          200
        ),
      },
      ar_station_style: {
        "background-color": rdylgr_colormap(
          this.segment.arrivalPrediction,
          0.2,
          0.8,
          200
        ),
      },
      transfer_style: {
        "background-color": "#212529",
      },
      transfer_score_color: {
        color: rdylgr_colormap(this.segment.transferScore, 50, 100, 200),
      },
      gradient_line: {
        "background-image":
          "linear-gradient(" +
          rdylgr_colormap(this.segment.departurePrediction, 0.2, 0.8, 200) +
          " 0%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.9 +
              this.segment.arrivalPrediction * 0.1,
            0.2,
            0.8,
            200
          ) +
          " 10%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.8 +
              this.segment.arrivalPrediction * 0.2,
            0.2,
            0.8,
            200
          ) +
          " 20%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.7 +
              this.segment.arrivalPrediction * 0.3,
            0.2,
            0.8,
            200
          ) +
          " 30%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.6 +
              this.segment.arrivalPrediction * 0.4,
            0.2,
            0.8,
            200
          ) +
          " 40%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.5 +
              this.segment.arrivalPrediction * 0.5,
            0.2,
            0.8,
            200
          ) +
          " 50%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.4 +
              this.segment.arrivalPrediction * 0.6,
            0.2,
            0.8,
            200
          ) +
          " 60%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.3 +
              this.segment.arrivalPrediction * 0.7,
            0.2,
            0.8,
            200
          ) +
          " 70%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.2 +
              this.segment.arrivalPrediction * 0.8,
            0.2,
            0.8,
            200
          ) +
          " 80%, " +
          rdylgr_colormap(
            this.segment.departurePrediction * 0.1 +
              this.segment.arrivalPrediction * 0.9,
            0.2,
            0.8,
            200
          ) +
          " 90%, " +
          rdylgr_colormap(this.segment.arrivalPrediction, 0.2, 0.8, 200) +
          " 100%)",
      },
      start_style: {
        color: rdylgr_colormap(this.segment.departurePrediction, 0.2, 0.8, 200),
      },
      destination_style: {
        color: rdylgr_colormap(this.segment.arrivalPrediction, 0.2, 0.8, 200),
      },
      train_icons: {
        ICE: require("../assets/img/ICE.svg"),
        IC: require("../assets/img/IC.svg"),
        EC: require("../assets/img/IC.svg"),
        RE: require("../assets/img/RE.svg"),
        IRE: require("../assets/img/RE.svg"),
        S: require("../assets/img/S.svg"),
        RB: require("../assets/img/RB.svg"),
      },
    };
  },
  computed: {
    walkDuration: function () {
      return dayjs.duration(
        this.next_segment.arrival.diff(this.next_segment.departure)
      );
    },
  },
});
</script>

<style lang="scss">
$time_col_width: 9ch;
$fancy_line_width: 16px;

.details_grid {
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
    "time-start fancy-line station-start platform-start"
    "duration fancy-line train train"
    "time-destination fancy-line station-destination platform-destination";
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

  .outdated {
    font-size: 0.8em;
  }
}

.duration {
  margin: 15px 5px;
  height: 1.4em;
  text-align: end;
  grid-area: duration;
  align-self: center;

  .outdated {
    font-size: 0.8em;
  }
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
    "duration fancy-line score"
    "duration fancy-line min-transfer-duration"
    "duration fancy-line walk";
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
