<template>
  <form @submit.prevent="get_connections" class="bg-dark">
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
        :is_invalid="!start_valid"
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
        :is_invalid="!destination_valid"
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
      // Get more from https://flatpickr.js.org/options/
      config: {
        enableTime: true,
        time_24hr: true,
        dateFormat: "d.m.Y H:i",
        altFormat: "d.m.Y H:i",
      },
      check_form_validity: false,
    };
  },
  created() {
    this.$router.isReady().then(() => {
      this.read_settings_from_query();
    });

    this.$store.dispatch("fetch_stations").then(() => {
      if (this.start && this.destination) {
        this.get_connections();
      }
    });
  },
  methods: {
    read_settings_from_query() {
      const query = Object.assign({}, this.$route.query);
      this.start = "start" in query ? query.start : this.start;
      this.destination =
        "destination" in query ? query.destination : this.destination;
      this.date = "date" in query ? query.date : this.date;
      this.search_for_arrival =
        "search_for_arrival" in query
          ? query.search_for_arrival === "true"
          : this.search_for_arrival;
      this.only_regional =
        "only_regional" in query
          ? query.only_regional === "true"
          : this.only_regional;
      this.bike = "bike" in query ? query.bike === "true" : this.bike;
      this.$store.dispatch("fetch_stations").then(() => {
        if (this.start && this.destination) {
          this.get_connections();
        }
      });
    },

    get_connections: function () {
      this.check_form_validity = true;
      if (this.start_valid && this.destination_valid) {
        this.$store
          .dispatch("get_connections", {
            start: this.start,
            destination: this.destination,
            date: this.date,
            search_for_arrival: this.search_for_arrival,
            only_regional: this.only_regional,
            bike: this.bike,
          })
          .then(() => {
            if (this.$route.path !== "/") {
              this.$router.push({ path: "/", hash: "#content" });
            }
            this.$router.push({ hash: "#content" });
          });
      }
    },
    swap_stations() {
      [this.start, this.destination] = [this.destination, this.start];
    },
  },
  watch: {
    "$route.query": {
      handler() {
        this.read_settings_from_query();
      },
    },
  },
  computed: {
    ...mapState(["stations"]),
    start_valid() {
      return !this.check_form_validity || this.stations.includes(this.start);
    },
    destination_valid() {
      return (
        !this.check_form_validity || this.stations.includes(this.destination)
      );
    },
    start: {
      get() {
        return this.$store.state.search_params.start;
      },
      set(value) {
        this.$store.commit("set_search_param", { key: "start", value: value });
      },
    },
    destination: {
      get() {
        return this.$store.state.search_params.destination;
      },
      set(value) {
        this.$store.commit("set_search_param", {
          key: "destination",
          value: value,
        });
      },
    },
    date: {
      get() {
        return this.$store.state.search_params.date;
      },
      set(value) {
        this.$store.commit("set_search_param", { key: "date", value: value });
      },
    },
    search_for_arrival: {
      get() {
        return this.$store.state.search_params.search_for_arrival;
      },
      set(value) {
        this.$store.commit("set_search_param", {
          key: "search_for_arrival",
          value: value,
        });
      },
    },
    only_regional: {
      get() {
        return this.$store.state.search_params.only_regional;
      },
      set(value) {
        this.$store.commit("set_search_param", {
          key: "only_regional",
          value: value,
        });
      },
    },
    bike: {
      get() {
        return this.$store.state.search_params.bike;
      },
      set(value) {
        this.$store.commit("set_search_param", { key: "bike", value: value });
      },
    },
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
