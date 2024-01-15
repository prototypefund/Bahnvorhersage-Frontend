<template>
  <div class="content-container">
    <div class="text-content">
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
    <div v-if="stations.length" class="text-center m-5">
      <h2 class="text-center">Beispielhafter Auszug aus den Stationsdaten</h2>
      <div class="stationviewer">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

type Station = {
  name: string;
  eva: string;
  ds100: string;
  valid_from: string;
  valid_to: string;
  lat: number;
  lon: number;
  meta: string;
  platform: string;
  db: string;
};

const store = useMainStore()
const { progressing } = storeToRefs(store)

const stations = ref<Station[]>([]);

function fetchStations() {
  progressing.value = true
  fetch(
    window.location.protocol +
      "//" +
      window.location.host +
      "/api/stations.json"
  )
    .then((response) => store.display_fetch_error(response))
    .then((response) => response.json())
    .then((response) => {
      stations.value = response.slice(0, 100);
      progressing.value = false
    });
}

onMounted(() => {
  fetchStations()
})

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
