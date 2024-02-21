<template>
  <div id="about" class="content-container">
    <div class="text-content">
      <h1 class="text-center">Bahn-Vorhersage</h1>
      <p>
        Bahn-Vorhersage ist ein Rankingsystem für Zugverbindungen. Es kann für
        alle Zugverbindung innerhalb von Deutschland einen sogenannten
        Verbindungsscore ermitteln. Dieser sagt aus, wie sicher die Anschlüsse
        einer Zugverbindung sind. Ein hoher Score heißt, dass vermutlich alle
        Anschlusszüge erreicht werden, ein niedriger Score bedeutet, dass
        eventuell nicht alle Anschlusszüge erreicht werden können.
      </p>
      <p>
        Ein hoher Verbindungsscore ist aber keine Garantie dafür, dass eine
        Verbindung funktioniert!
      </p>
      <p>
        Der Verbindungsscore wird mithilfe einer auf historischen Zugdaten
        trainierten KI ermittelt. Einige Details dazu können in unserem
        Git-Repository gefunden werden.
      </p>
    </div>
    <div class="text-center container-xl">
      <h3>Finde die zuverlässigsten Zugverbindungen zu Top Reisezielen</h3>
      <div class="d-flex gap-3 flex-wrap justify-content-center mt-3">
        <travel-destination
          description="In die Hauptstadt nach"
          title="Berlin"
          :image="berlinImg"
          :url="{
            path: '/',
            hash: '#search',
            query: { destination: 'Berlin Hbf' },
          }"
        ></travel-destination>
        <travel-destination
          description="Zuverlässige Reise nach"
          title="München"
          :image="münchenImg"
          :url="{
            path: '/',
            hash: '#search',
            query: { destination: 'München Hbf' },
          }"
        ></travel-destination>
        <travel-destination
          description="Mit dem Nahverkehr nach"
          title="Sylt"
          :image="syltImg"
          :url="{
            path: '/',
            hash: '#search',
            query: { destination: 'Westerland(Sylt)', only_regional: true },
          }"
        ></travel-destination>
        <travel-destination
          description="An den Bodensee nach"
          title="Lindau"
          :image="lindauImg"
          :url="{
            path: '/',
            hash: '#search',
            query: { destination: 'Lindau-Reutin' },
          }"
        ></travel-destination>
        <travel-destination
          description="In die Hafenstadt nach"
          title="Hamburg"
          :image="hamburgImg"
          :url="{
            path: '/',
            hash: '#search',
            query: { destination: 'Hamburg Hbf' },
          }"
        ></travel-destination>
        <travel-destination
          description="Zuverlässige Verbindungen:"
          title="Tübingen - Köln"
          :image="kölnImg"
          :url="{
            path: '/connections',
            hash: '#search',
            query: { destination: 'Köln Hbf', start: 'Tübingen Hbf' },
          }"
        ></travel-destination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import travelDestination from "../components/TravelDestination.vue";

import berlinImg from "@/assets/img/berlin.jpg";
import münchenImg from "@/assets/img/münchen.jpg";
import syltImg from "@/assets/img/sylt.jpg";
import lindauImg from "@/assets/img/lindau.jpg";
import hamburgImg from "@/assets/img/hamburg.jpg";
import kölnImg from "@/assets/img/köln.jpg";


</script>
