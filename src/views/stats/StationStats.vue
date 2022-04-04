<template>
  <div id="stats" class="stations shadow-xxxl p-5 bg-black">
    <h1 class="text-center">Verspätungen in Deutschland</h1>
    <div class="stats-picker">
      <vue-slider
        v-model="values"
        :data="dates"
        :tooltipPlacement="['top', 'bottom']"
        :lazy="true"
        :tooltip="'always'"
      ></vue-slider>
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
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { default as dayjs } from "dayjs";

export default defineComponent({
  components: {
    VueSlider,
  },
  data: function () {
    return {
      values: [] as any,
      dates: [] as any,
      plotURL:
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/default.webp",
    };
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

        const dates = [limits.min];
        while (dates[dates.length - 1].isBefore(limits.max)) {
          dates.push(dates[dates.length - 1].add(limits.freq, "hours"));
        }
        for (let i = 0; i < dates.length; i++) {
          dates[i] = dates[i].format("DD.MM.YYYY");
        }
        this.dates = dates;
        this.values = [dates[0], dates[dates.length - 1]];
      });
  },
  methods: {
    updatePlot() {
      const new_url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/stationplot/" +
        this.values[0].replace(/,/g, "") +
        "-" +
        this.values[1].replace(/,/g, "") +
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
  },
});
</script>