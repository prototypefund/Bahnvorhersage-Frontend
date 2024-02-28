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
    <div class="max-width content-container">
      <div class="card mb-3 overflow-hidden">
        <div class="row">
          <div class="col">
            <div class="card-body position-relative h-100 bg-danger">
              <i
                class="icon icon-exclamation-triangle-fill fs-1 position-absolute top-50 start-50 translate-middle"
              ></i>
            </div>
          </div>
          <div class="col-md-10">
            <div class="card-body">
              <h3 class="card-title">Warnung! Alpha-Test</h3>
              <p class="card-text">
                <b
                  >Tldr: Aktuell sollte diese neue Funktion nicht verwendet werden, um Bahnreisen zu
                  planen. Mit Deinem Feedback kann das System schneller einsatzbereit sein.
                </b>
              </p>
              <p class="card-text">
                Seit dem 1. September 2023 arbeiten wir im Rahmen des Prototypefunds an einer neuen
                Funktion: Ziel ist es bei der Verbindungssuche (Routing) Alternativverbindungen mit
                zu beachten. Dafür ersetzen wir die Verbindungssuche der Bahn mit einem eigenen
                System.
              </p>
              <p class="card-text">
                Viele Aspekte funktionieren bereits, viele noch nicht. Folgende Limitationen sind
                uns bekannt:
              </p>
              <ul>
                <li>Verspätungen, Ausfälle etc. werden nicht beachtet</li>
                <li>Verbindungen können maximal zwölf Stunden in der Zukunft liegen</li>
                <li>
                  Züge, die zusammen- oder auseinander-gekuppelt werden, werden teilweise doppelt
                  angezeigt
                </li>
                <li>Busse, Trams, etc. sind nicht enthalten</li>
                <li>
                  Es wird mit einer minimalen Umsteigezeit von 3 Minuten gerechnet, was häufig zu
                  knapp ist
                </li>
                <li>Das Routing ist langsam - Wartezeiten von 1 - 5 Minuten sind normal</li>
                <li>...</li>
              </ul>
              <p class="card-text">
                Die Grundsätze der neuen Verbindungssuche funktionieren schon und können getestet
                werden. Damit das System möglichst nützlich wird, brauchen wir Dein Feedback zu den
                angezeigten Verbindungen und deren Darstellung.
              </p>
              <a
                class="btn btn-primary w-100 mb-3"
                href="https://gitlab.com/bahnvorhersage/bahnvorhersage/-/issues/new?issuable_template=Feedback%20Routensuche"
                target="_blank"
                rel="noopener noreferrer btn btn-primary"
                >Feedback auf GitLab geben</a
              >
            </div>
          </div>
        </div>
      </div>
      <AlphaSearchForm />
    </div>
  </main-layout>
</template>
