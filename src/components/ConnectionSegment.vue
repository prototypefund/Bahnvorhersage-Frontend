<template>
  <div style="display: contents">
    <div
      v-if="'walking' in segment && segment.walking"
      class="walk"
      v-bind:style="transfer_style"
    >
      <div style="display: contents">
        <i class="icon icon-person-walking-solid"></i>
        davon {{ segment.arrival.diff(segment.departure, "m") }} Min und
        {{ segment.distance }} m Fußweg
      </div>
    </div>
    <div v-else style="display: contents">
      <div class="station_delay_line_container">
        <div v-bind:style="gradient_line" class="station_delay_line"></div>
      </div>
      <div class="leg">
        <div class="station">
          {{ segment.origin.name }}
        </div>

        <div class="time">
          {{ segment.departure.format("HH:mm") }}
          <del
            v-if="!segment.departure.isSame(segment.plannedDeparture)"
            class="outdated"
          >
            {{ segment.plannedDeparture.format("HH:mm") }}
          </del>
        </div>

        <div class="platform">
          <span v-if="segment.departurePlatform">
            von Gl. {{ segment.departurePlatform }}
            <del
              v-if="
                segment.departurePlatform !== segment.plannedDeparturePlatform
              "
              class="outdated"
              >{{ segment.plannedDeparturePlatform }}</del
            >
          </span>
        </div>

        <div class="train">
          <img
            v-if="segment.line.productName in train_icons"
            v-bind:src="train_icons[segment.line.productName]"
          />
          {{ segment.line.name }} nach {{ segment.direction }}
        </div>

        <div class="station">
          {{ segment.destination.name }}
        </div>

        <div class="time">
          {{ segment.arrival.format("HH:mm") }}
          <del
            v-if="!segment.arrival.isSame(segment.plannedArrival)"
            class="outdated"
          >
            {{ segment.plannedArrival.format("HH:mm") }}
          </del>
        </div>

        <div class="platform">
          <span v-if="segment.arrivalPlatform">
            an Gl. {{ segment.arrivalPlatform }}
            <del
              v-if="segment.arrivalPlatform !== segment.plannedArrivalPlatform"
              class="outdated"
              >{{ segment.plannedArrivalPlatform }}</del
            >
          </span>
        </div>
      </div>

      <div v-if="'transferTime' in segment" style="display: contents">
        <div class="score" v-bind:style="transfer_style">
          Verbindungs-Score:
          <span v-bind:style="text_color">{{ segment.transferScore }}%</span>
        </div>
        <div class="transfer" v-bind:style="transfer_style">
          Umsteigezeit: {{ segment.transferTime }} Min.
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { rdylgr_colormap } from "../assets/js/colormap";

export default defineComponent({
  name: "ConnectionSegment",
  props: ["segment", "con_score"],
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
      text_color: {
        color: rdylgr_colormap(this.segment.transferScore, 50, 100, 200),
      },
      gradient_line: {
        "background-image":
          "linear-gradient(" +
          rdylgr_colormap(this.segment.departurePrediction, 0.2, 0.8, 200) +
          ", " +
          rdylgr_colormap(this.segment.arrivalPrediction, 0.2, 0.8, 200) +
          ")",
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
});
</script>

<style lang="scss">
.details_grid {
  margin: 20px;
  display: inline-grid;
  grid-template-columns: 15px minmax(max-content, auto);
  width: calc(100% - 40px);
}

.leg {
  @include border-radius;
  display: inline-grid;
  grid-template-columns: minmax(max-content, 1fr) minmax(max-content, 1fr) minmax(
      max-content,
      1fr
    );
  background-color: $page_lighter_gray;
}

.station {
  @include border-radius;
  margin: 10px 10px 10px 10px;
  padding: 5px 10px;
  background-color: $page_gray;
}

.time {
  margin: 15px;
}

.platform {
  margin: 15px;
}

.train {
  margin: 10px;
  grid-column-start: span 3;

  img {
    height: 20px;
  }
}

.score {
  border: solid 10px transparent;
  grid-column-start: span 2;
}

.transfer {
  border: solid 10px transparent;
  grid-column-start: span 2;
}

.walk {
  border: solid 10px transparent;
  grid-column-start: span 2;
}

.station_delay_line_container {
  background-color: $page_gray;
  grid-row-start: span 3;
  display: grid;
}

.station_delay_line {
  @include border-radius;
  width: 5px;
}

@media (max-width: 450px) {
  .details_grid {
    margin: 10px;
    display: inline-grid;
    grid-template-columns: 15px minmax(max-content, auto); // minmax(max-content, auto);
    width: calc(100% - 20px);
  }

  .leg {
    grid-template-columns: minmax(max-content, 1fr) minmax(max-content, 1fr);
  }

  .station {
    border-radius: 0;
    @include border-top-radius;
    margin: 8px 8px 0 8px;
    grid-column-start: span 2;
  }

  .time {
    @include border-bottom-start-radius;
    margin: 0 0 8px 8px;
    padding: 5px 8px;
    background-color: $page_gray;
  }

  .platform {
    @include border-bottom-end-radius;
    margin: 0 8px 8px 0;
    padding: 5px 8px;
    background-color: $page_gray;
  }

  .train {
    margin: 8px;
    grid-column-start: span 2;
  }

  .score {
    grid-column-start: span 2;
  }

  .transfer {
    grid-column-start: span 2;
  }

  .walk {
    grid-column-start: span 2;
    border-top: 0;
  }

  .station_delay_line_container {
    grid-row-start: span 5;
  }
}
</style>
