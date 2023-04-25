<template>
  <div>
    <div>
      <div class="text_content">
        <h1 class="text-center">Stations- / Bahnhofsdaten</h1>
        <p>
          Unsere Stationsdaten kommen in erster Linie vom IRIS (<b>I</b>nternes
          <b>R</b>eisenden<b>i</b>nformations<b>s</b>ystem). Diese werden mit
          Koordinaten aus Hafas und DB OpenData angereichert. Da sich z.B.
          Bahnhofsnamen hin und wieder ändern, hat jeder Datenpunkt einen
          <span class="font-monospace">valid_from</span> und einen
          <span class="font-monospace">valid_to</span> tag.
        </p>
        <p>
          Den vollen Datensatz gibt es hier:
          <a href="api/stations.json" target="_blank">stations.json</a>
        </p>
      </div>
      <div class="text-center">
        <h2 class="text-center">Beispielhafter Auszug aus den Stationsdaten</h2>
        <div v-if="show" class="stationviewer">
          <pre class="header">name</pre>
          <pre class="header">eva</pre>
          <pre class="header">ds100</pre>
          <pre class="header">valid_from</pre>
          <pre class="header">valid_to</pre>
          <pre class="header">lat</pre>
          <pre class="header">lon</pre>
          <pre class="header">meta</pre>
          <pre class="header">platform</pre>
          <pre class="header">db</pre>
          <div
            style="display: contents"
            v-for="station in stations"
            :key="station.index"
          >
            <pre>{{ station.name }}</pre>
            <pre>{{ station.eva }}</pre>
            <pre>{{ station.ds100 }}</pre>
            <pre>{{ new Date(station.valid_from).toISOString() }}</pre>
            <pre>{{ new Date(station.valid_to).toISOString() }}</pre>
            <pre>{{ station.lat }}</pre>
            <pre>{{ station.lon }}</pre>
            <pre>{{ station.meta }}</pre>
            <pre>{{ station.platform }}</pre>
            <pre>{{ station.db }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data: function () {
    return {
      stations: [],
      show: false,
    };
  },
  created() {
    this.$store.commit("start_progress");
    fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/api/stations.json"
    )
      .then((response) => this.$store.dispatch("display_fetch_error", response))
      .then((response) => response.json())
      .then((response) => {
        this.stations = response.slice(0, 100);
        this.show = true;
        this.$store.commit("stop_progress");
      });
  },
  methods: {},
});
</script>

<style lang="scss">
.stationviewer {
  @include border-radius;
  display: grid;
  grid-template-columns: 200px min-content min-content auto auto auto auto min-content auto auto;
  gap: 4px;
  background-color: $page_lighter_gray;
  border: 4px solid $page_lighter_gray;
}

.stationviewer pre {
  @include border-radius;
  white-space: pre-wrap;
  padding: 10px;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: $page_gray;
}
.stationviewer > .header {
  font-weight: bold;
}
</style>
