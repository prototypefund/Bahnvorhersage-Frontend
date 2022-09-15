<template>
  <div class="text-center">
    <h3>Finde die zuverlässigsten Zugverbindungen zu Top Reisezielen</h3>
    <div class="d-flex gap-3 flex-wrap justify-content-center mt-3">
      <travel-destination
        description="In die Hauptstadt nach"
        title="Berlin"
        :image="require('@/assets/img/berlin.jpg')"
        :url="{
          path: '/',
          hash: '#search',
          query: { destination: 'Berlin Hbf' },
        }"
      ></travel-destination>
      <travel-destination
        description="Zuverlässige Reise nach"
        title="München"
        :image="require('@/assets/img/münchen.jpg')"
        :url="{
          path: '/',
          hash: '#search',
          query: { destination: 'München Hbf' },
        }"
      ></travel-destination>
      <travel-destination
        description="Mit dem Nahverkehr nach"
        title="Sylt"
        :image="require('@/assets/img/sylt.jpg')"
        :url="{
          path: '/',
          hash: '#search',
          query: { destination: 'Westerland(Sylt)', only_regional: true },
        }"
      ></travel-destination>
      <travel-destination
        description="An den Bodensee nach"
        title="Lindau"
        :image="require('@/assets/img/lindau.jpg')"
        :url="{
          path: '/',
          hash: '#search',
          query: { destination: 'Lindau-Reutin' },
        }"
      ></travel-destination>
      <travel-destination
        description="In die Hafenstadt nach"
        title="Hamburg"
        :image="require('@/assets/img/hamburg.jpg')"
        :url="{
          path: '/',
          hash: '#search',
          query: { destination: 'Hamburg Hbf' },
        }"
      ></travel-destination>
      <travel-destination
        description="Zuverlässige Verbindungen:"
        title="Tübingen - Köln"
        :image="require('@/assets/img/köln.jpg')"
        :url="{
          path: '/connections',
          hash: '#search',
          query: { destination: 'Köln Hbf', start: 'Tübingen Hbf' },
        }"
      ></travel-destination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import travelDestination from "../components/TravelDestination.vue";

export default defineComponent({
  name: "TravelDestinationsDisplay",
  components: {
    travelDestination,
  },
});
</script>
