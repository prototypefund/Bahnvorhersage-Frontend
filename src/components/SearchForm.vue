<template>
  <form v-on:submit="get_connections" class="bg-dark">
    <!-- Heading -->
    <h3 style="text-align: center">
      <strong>Verbindungen bewerten</strong>
    </h3>

    <!-- Start Bhf Form-->
    <label for="start" class="form-label">Von</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="start"
        class="form-control p-0"
        placeholder="Bahnhof"
        v-model="start"
        :is_invalid="start_invalid"
      >
      </auto-suggest>
    </div>

    <!-- End Bhf Form -->
    <label for="destination" class="form-label">Nach</label>
    <div class="input-group mb-3 flex-nowrap">
      <span class="input-group-text"><i class="icon icon-train"></i></span>
      <auto-suggest
        name="destination"
        class="form-control p-0"
        placeholder="Bahnhof"
        v-model="destination"
        :is_invalid="destination_invalid"
      >
      </auto-suggest>
      <span class="btn btn-primary" @click="swap_stations"
        ><i class="icon icon-arrow-down-up" style="vertical-align: middle"></i
      ></span>
    </div>

    <!-- Date Form -->
    <label for="datetime" class="form-label">Datum und Uhrzeit</label>
    <div class="input-group mb-3">
      <span class="input-group-text"><i class="icon icon-calendar"></i></span>
      <flat-pickr
        v-model="date"
        :config="config"
        class="form-control"
        placeholder="Datum und Uhrzeit auswählen"
        name="datetime"
      >
      </flat-pickr>
      <toggle-switch
        class="align-self-center"
        style="padding: 6px 12px"
        v-model="search_for_arrival"
      ></toggle-switch>
    </div>

    <div class="d-flex justify-content-around flex-wrap">
      <!-- Only regional checkbox -->
      <check-box
        class="mb-3"
        v-model="only_regional"
        id="only_regional"
        label="Nur Nahverkehr"
        :inline="true"
      ></check-box>
      <!-- Bike checkbox -->
      <check-box
        class="mb-3"
        v-model="bike"
        id="bike"
        label="Fahrradmitnahme"
        :inline="true"
      ></check-box>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <input
        class="btn btn-primary"
        id=""
        name="submit"
        type="submit"
        value="SUCHEN"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import flatpickr from "flatpickr";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import AutoSuggest from "./AutoSuggest.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import CheckBox from "./CheckBox.vue";

require("flatpickr/dist/themes/dark.css");

export default defineComponent({
  name: "SearchForm",
  data: function () {
    return {
      start: "",
      start_invalid: false,
      destination: "",
      destination_invalid: false,
      date: flatpickr.formatDate(new Date(), "d.m.Y H:i"),
      // Get more from https://flatpickr.js.org/options/
      config: {
        enableTime: true,
        time_24hr: true,
        dateFormat: "d.m.Y H:i",
        altFormat: "d.m.Y H:i",
      },
      search_for_arrival: false,
      only_regional: false,
      bike: false,
    };
  },
  created() {
    fetch(
      window.location.protocol + "//" + window.location.host + "/api/connect"
    )
      .then((response) => this.$root.display_fetch_error(response))
      .then((response) => response.json())
      .then((data) => {
        this.$store.commit("set_stations", data.stations);
      });
  },
  methods: {
    get_connections: function (event) {
      event.preventDefault(); // prevent page reload

      if (
        this.stations.includes(this.start) &&
        this.stations.includes(this.destination)
      ) {
        this.start_invalid = false;
        this.destination_invalid = false;
        this.$root.get_connections({
          start: this.start,
          destination: this.destination,
          date: this.date, // flatpickr.formatDate(new Date(this.date), "d.m.Y H:i")
          search_for_departure: !this.search_for_arrival,
          only_regional: this.only_regional,
          bike: this.bike,
        });
      } else {
        if (!this.stations.includes(this.start)) {
          this.start_invalid = true;
        }
        if (!this.stations.includes(this.destination)) {
          this.destination_invalid = true;
        }
      }
    },
    update_start(station) {
      this.start = station;
    },
    update_destination(station) {
      this.destination = station;
    },
    swap_stations() {
      [this.start, this.destination] = [this.destination, this.start];
    },
  },
  computed: {
    ...mapState(["stations"]),
  },
  components: {
    flatPickr,
    AutoSuggest,
    ToggleSwitch,
    CheckBox,
  },
});
</script>

<style lang="scss">
.flatpickr-calendar,
.flatpickr-calendar.arrowTop,
.flatpickr-months .flatpickr-month,
.flatpickr-current-month,
span.flatpickr-weekday,
.flatpickr-current-month .flatpickr-monthDropdown-months {
  background: $page_gray;
}

.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange,
.flatpickr-day.selected.inRange,
.flatpickr-day.startRange.inRange,
.flatpickr-day.endRange.inRange,
.flatpickr-day.selected:focus,
.flatpickr-day.startRange:focus,
.flatpickr-day.endRange:focus,
.flatpickr-day.selected:hover,
.flatpickr-day.startRange:hover,
.flatpickr-day.endRange:hover,
.flatpickr-day.selected.prevMonthDay,
.flatpickr-day.startRange.prevMonthDay,
.flatpickr-day.endRange.prevMonthDay,
.flatpickr-day.selected.nextMonthDay,
.flatpickr-day.startRange.nextMonthDay,
.flatpickr-day.endRange.nextMonthDay {
  background: $primary;
  border-color: $primary;
}
</style>
