<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <main-layout>
    <div id="open-data" class="content-container">
      <div class="text-content">
        <h1>Open Data</h1>
        <p>
          Für dieses Projekt haben wir viele Daten gesammelt und kombiniert. Damit auch andere etwas
          von unserer Arbeit haben, stellen wir einige dieser Daten öffentlich zur Verfügung. Dies
          beinhaltet bislang:
        </p>
        <router-link
          class="btn btn-primary w-100 mb-3"
          :to="{ path: '/stationviewer', hash: '#content' }"
          >Stationsdaten</router-link
        >
        <p>
          Wir dürfen keine historischen Verspätungsinformationen veröffentlichen. Falls du Interesse
          an diesen Daten hast, kannst du:
        </p>

        <ol>
          <li>Bei den Eisenbahnverkehrsunternehmen (EVU) nach den Daten fragen</li>
          <li>
            Bei einem Verkehrsministerium oder einer Servicegesellschaft eines Verkehrsministeriums
            nachfragen. Ggf. kann hier das
            <a href="https://fragdenstaat.de">Informationsfreiheitsgesetz</a>
            helfen
          </li>
          <li>Politisch aktiv werden, um EVUs dazu zu zwingen, diese Daten öffentlich zu machen</li>
          <li>Selber die Daten sammeln</li>
        </ol>
        <em class="fst-italic disclaimer">
          Disclaimer: Wir garantieren nicht, dass die Daten richtig sind. Und wir wissen, dass
          einige unserer Datenquellen kleinere oder größere Fehler haben. Wenn dir ein Fehler
          auffällt, dann mache doch bitte ein Issue auf
          <a href="https://gitlab.com/bahnvorhersage/bahnvorhersage/-/issues" target="_blank"
            >GitLab</a
          >
          auf.
        </em>
      </div>
    </div>
  </main-layout>
</template>
