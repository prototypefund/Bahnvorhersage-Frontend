<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <main-layout>
    <div id="privacy" class="content-container">
      <div class="text-content">
        <h1>Datenschutzerklärung</h1>
        <p>Bei jeder Anfrage an die API werden folgende Daten von den Webservern gespeichert:</p>
        <ul>
          <li>Der User Agent</li>
          <li>Der Zeitpunkt des Aufrufs</li>
          <li>Die verwendete IP-Adresse</li>
          <li>Die Anfrageparameter (z.B. die Suchkriterien einer Zugverbindung)</li>
        </ul>
        <p>
          Die API wird von der Webseite aufgerufen, um die Autovervollständigung bei der
          Bahnhofssuche anzuzeigen, um Zugverbindungen zu finden und um Statistiken und Daten
          anzuzeigen.
        </p>
        <p>
          Die Daten werden verwendet um nachzuvollziehen, wie viel und welche Aspekte der Projekts
          verwendet werden. Es ist für uns nicht möglich, die Daten einzelnen Personen zuzuordnen.
        </p>
      </div>
    </div>
  </main-layout>
</template>
