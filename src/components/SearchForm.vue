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
        v-model:value="search_params.start"
        v-model:is_valid="start_valid"
        :values="stations"
        placeholder="Bahnhof"
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
        v-model:value="search_params.destination"
        v-model:is_valid="destination_valid"
        :values="stations"
        placeholder="Bahnhof"
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
        v-model="search_params.date"
        :config="config"
        class="form-control"
        placeholder="Datum und Uhrzeit auswählen"
        name="datetime"
      >
      </flat-pickr>
      <toggle-switch
        class="align-self-center"
        style="padding: 6px 12px"
        v-model="search_params.search_for_arrival"
      ></toggle-switch>
    </div>

    <div class="d-flex justify-content-around flex-wrap">
      <!-- Only regional checkbox -->
      <check-box
        class="mb-3"
        v-model="search_params.only_regional"
        id="only_regional"
        label="Nur Nahverkehr"
        :inline="true"
      ></check-box>
      <!-- Bike checkbox -->
      <check-box
        class="mb-3"
        v-model="search_params.bike"
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
      start_valid: false,
      destination_valid: false,
    };
  },
  created() {
    this.$store.dispatch("fetch_stations");
  },
  methods: {
    get_connections() {
      if (this.start_valid && this.destination_valid) {
        this.$store.dispatch("fetch_stations").then(async () => {
          this.$router.push({
            path: "/connections",
            query: this.convert_values_to_string(this.search_params),
            // hash: "#content",
          });
          this.$store.dispatch("get_connections");
        });
      }
    },
    convert_values_to_string(object: any) {
      return Object.fromEntries(
        Object.entries(object).map(([k, v]) => [k, String(v)])
      );
    },
    swap_stations() {
      [this.search_params.start, this.search_params.destination] = [
        this.search_params.destination,
        this.search_params.start,
      ];
    },
  },
  computed: {
    ...mapState(["stations", "search_params"]),
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
