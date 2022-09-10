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
import { SearchParams } from "../store";

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
    this.$store.dispatch("fetch_stations");
  },
  methods: {
    get_connections() {
      this.check_form_validity = true;
      this.$store.dispatch("fetch_stations").then(() => {
        if (this.start_valid && this.destination_valid) {
          const query = Object.fromEntries(
            Object.entries(new SearchParams()).map(([key]) => [key, this[key]])
          );
          this.$store.dispatch("get_connections", query);
          this.$router.push({
            ...this.$route,
            query: this.convert_values_to_string(query),
          });
        }
      });
    },
    convert_values_to_string(object: any) {
      return Object.fromEntries(
        Object.entries(object).map(([k, v]) => [k, String(v)])
      );
    },
    swap_stations() {
      [this.start, this.destination] = [this.destination, this.start];
    },
  },
  watch: {
    "$route.query"() {
      let changed = false;
      const query = this.$route.query;
      Object.entries(new SearchParams()).map(([key, value]) => {
        if (query[key]) {
          if (typeof value == "boolean") {
            // Booleans need to be parsed seperatly
            if (this[key] !== (query[key] === "true")) {
              changed = true;
              this[key] = query[key] === "true";
            }
          } else {
            if (this[key] !== value.constructor(query[key])) {
              changed = true;
              this[key] = value.constructor(query[key]);
            }
          }
        }
      });

      if (this["start"] && this["destination"] && changed) {
        this.get_connections();
      }
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
    ...Object.keys(new SearchParams()).reduce((result, key) => {
      result[key] = {
        get() {
          return this.$store.state.search_params[key];
        },
        set(value: any) {
          this.$store.commit("set_search_param", {
            key: key,
            value: value,
          });
        },
      };
      return result;
    }, {}),
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
