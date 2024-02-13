<script setup lang="ts">
import AlphaSearchForm from '@/components/AlphaSearchForm.vue'
import JourneyAndAlternativeDisplay from '@/components/JourneyAndAlternativeDisplay.vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import MainLayout from '@/layouts/MainLayout.vue'

const store = useMainStore()

const { journeysAndAlternatives } = storeToRefs(store)
</script>

<template>
  <main-layout>
    <div class="max-width">
      <div class="card mb-3">
        <div class="row">
          <div class="col">
            <div class="card-body position-relative h-100 bg-danger rounded-start">
              <i
                class="icon icon-exclamation-triangle-fill fs-1 position-absolute top-50 start-50 translate-middle"
              ></i>
            </div>
          </div>
          <div class="col-md-10">
            <div class="card-body">
              <h3 class="card-title">Vorsicht! Alpha-Test</h3>
              <p class="card-text">
                <b
                  >Tldr: Aktuell sollte und kann diese neue Funktion nicht verwendet werden, um
                  Bahnreisen zu planen. Wir freuen uns aber über Feedback, damit können wir Probleme
                  lösen und hoffentlich dadurch schneller einsatzbereit sein.</b
                >
              </p>
              <p class="card-text">
                Seit dem 1. September 2023 arbeiten wir im Rahmen des Prototypefunds an einer neuen
                Funktion: Ziel ist es bei der Routensuche (Routing) Alternativverbindungen mit zu
                beachten. Dafür müssen wir die Routensuche der Deutschen Bahn, die wir aktuell
                verwenden, mit einer Eigenlösung ersetzen.
              </p>
              <p class="card-text">
                Viele Aspekte funktionieren bereits, viele noch nicht. Folgende Limitationen sind
                uns bekannt:
              </p>
              <ul>
                <li>Verspätungen, Ausfälle etc. werden nicht beachtet</li>
                <li>
                  Das Datum muss in der Vergangenheit liegen, zwischen Mai 2021 und Oktober 2023
                </li>
                <li>Es können keine Verbindungen über Tagesübergänge gefunden werden</li>
                <li>
                  Fußwege, z.B. von Berlin Hbf (tief) nach Berlin Hbf werden nicht beachtet, was
                  teilweise zu sehr komischen Verbindungen führt
                </li>
                <li>
                  Es gibt einige Fehler mit Zügen, die zusammen- oder auseinander-gekuppelt werden
                </li>
                <li>Busse, Trams, etc. werden grundsätzlich nicht beachtet</li>
                <li>
                  Es wird grundsätzlich mit einer Umsteigezeit von 3 Minuten gerechnet, was häufig
                  unrealistisch ist
                </li>
                <li>Das Routing ist langsam - Wartezeiten von 1 - 2 Minuten sind normal</li>
                <li>...</li>
              </ul>
              <p class="card-text">
                Das neue Routing kann bzw. sollte aktuell noch nicht verwendet werden, um Bahnreisen
                zu planen. Die Grundsätze der neuen Routensuche funktionieren aber schon, und können
                getestet werden. Damit das System möglichst nützlich wird, brauchen wir Dein
                Feedback. Gibt es Routen, die sinnvoll sind, aber nicht angezeigt werden? Werden
                Routen angezeigt, die kompletter Müll sind? Ist die Darstellung verständlich?
              </p>
              <h3 class="card-title">Feedback</h3>
              <a
                class="btn btn-primary w-100 mb-3"
                href="https://gitlab.com/bahnvorhersage/bahnvorhersage/-/issues/new?issuable_template=Feedback%20Routensuche"
                target="_blank"
                rel="noopener noreferrer btn btn-primary"
                >Feedback zur Routensuche geben</a
              >
            </div>
          </div>
        </div>
      </div>
      <AlphaSearchForm />
      <JourneyAndAlternativeDisplay
        :journeys="journeysAndAlternatives"
        v-if="journeysAndAlternatives.length"
      />
    </div>
  </main-layout>
</template>

<style lang="scss">
.max-width {
  max-width: $content-width;
  margin: auto !important;
}
</style>
