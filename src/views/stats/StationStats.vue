<template>
  <div id="stats" class="stations shadow-xxxl p-5 bg-black">
    <h1 class="text-center">Verspätungen in Deutschland</h1>
    <div class="stats-picker">
      <Slider
        class="slider"
        v-if="values.length"
        v-model="values"
        :merge="merge"
        :max="dates.length - 1"
        :format="format"
        style="width: 200px"
      />
      <input
        class="btn btn-primary"
        type="button"
        value="Plot generieren"
        v-on:click="updatePlot"
      />
    </div>
    <img
      class="stats-image"
      id="stats_image"
      v-if="plotURL"
      :src="plotURL"
      @error="$root.display_img_load_error"
      @load="loaded_img()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Slider from "@vueform/slider";
import { default as dayjs } from "dayjs";

export default defineComponent({
  components: {
    Slider,
  },
  data: function () {
    return {
      values: [] as number[],
      dates: [] as string[],
      plotURL: (window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/default.webp") as string,
    };
  },
  computed: {
    merge: function () {
      return 400 / (this.dates.length || 1) * 100;
    },
  },
  created() {
    this.$store.commit("start_progress");
    fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/limits",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => this.$root.display_fetch_error(response))
      .then((response) => response.json())
      .then((limits) => {
        limits.min = dayjs(limits.min, "YYYY-MM-DD");
        limits.max = dayjs(limits.max, "YYYY-MM-DD");

        const dates = [limits.min] as dayjs.Dayjs[];
        while (dates[dates.length - 1].isBefore(limits.max)) {
          dates.push(dates[dates.length - 1].add(limits.freq, "hours"));
        }
        this.dates = dates.map((date) => date.format("DD.MM.YYYY"));
        this.values = [0, this.dates.length - 1];
      });
  },
  methods: {
    updatePlot() {
      const new_url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/" +
        this.dates[this.values[0]] +
        "-" +
        this.dates[this.values[1]] +
        ".webp";
      if (new_url !== this.plotURL) {
        this.$store.commit("start_progress");
        this.plotURL = new_url;
      }
    },
    loaded_img() {
      this.$store.commit("stop_progress");
      document
        .getElementById("stats_image")
        ?.scrollIntoView({ behavior: "smooth" });
    },
    replaceByDefault() {
      this.plotURL =
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/default.webp";
      this.$store.commit("start_progress");
    },
    format(index: number) {
      return this.dates[index];
    },
  },
});
</script>

<style>
@import "@vueform/slider/themes/default.css";
</style>
