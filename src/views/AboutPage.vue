<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <main-layout>
    <div class="content-container">
      <div id="about" class="text-content">
        <h1>Bahn-Vorhersage</h1>
        <p>
          Bahn-Vorhersage ist ein Rankingsystem für Zugverbindungen. Es kann für alle Zugverbindung
          innerhalb von Deutschland einen sogenannten Verbindungsscore ermitteln. Dieser sagt aus,
          wie sicher die Anschlüsse einer Zugverbindung sind. Ein hoher Score heißt, dass vermutlich
          alle Anschlusszüge erreicht werden, ein niedriger Score bedeutet, dass eventuell nicht
          alle Anschlusszüge erreicht werden können.
        </p>
        <p>
          Ein hoher Verbindungsscore ist aber keine Garantie dafür, dass eine Verbindung
          funktioniert!
        </p>
        <h2>Funktionsweise</h2>
        <p>
          Die Webseite zeigt die gleichen Zugverbindungen wie die Seite der Bahn oder wie der DB
          Navigator. Der Verbindungsscore, den diese Seite zusätzlich zu den Informationen der
          Deutschen Bahn anzeigt, wird aus Zugverspätungsvorhersagen eines Machine Learning Modells
          und der Umsteigezeit berechnet.
        </p>
        <p>
          Um die Machine Learning Modelle zu trainieren, sammeln wir seit Oktober 2020 in Echtzeit
          Abfahrtszeiten von Zügen. Die von heute aus letzten sechs Wochen an historischen
          Verspätungsdaten werden für das Training verwendet. Die Modelle werden täglich neu
          trainiert. Weitere Details finden sich in den Langfassungen für Jugend-Forscht.
        </p>
        <router-link class="btn btn-primary w-100" :to="{ path: '/opensource', hash: '#content' }"
          ><i class="icon icon-gitlab"></i> Docs / Langfassungen</router-link
        >
      </div>
    </div>
  </main-layout>
</template>
