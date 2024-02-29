<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import journeysImg from '@/assets/img/routing_funktionsweise.webp'
</script>

<template>
  <main-layout>
    <div class="content-container">
      <div class="text-content">
        <h1>Finden von Alternativverbindungen</h1>
        <p>
          Seit Februar 2024 bietet Bahn-Vorhersage das Suchen nach Alternativverbindungen an. Damit
          soll es vereinfacht werden, robuste Zugverbindungen mit guten Alternativen bei
          Zugverspätungen im Voraus zu finden.
        </p>
        <h2>Wie funktioniert's?</h2>
        <p>
          Nach der Eingabe von Start, Ziel und Uhrzeit werden mögliche Zugverbindungen angezeigt.
          Eine Zugverbindung besteht aus den breiten Rechtecken mit Zugnummern darauf und ist von
          Oben (Abfahrt) nach Unten (Ankunft) zu lesen. Die schmalen Balken rechts neben der
          Zugverbindung deuten die möglichen Alternativen an, wenn ein Anschluss verpasst hat. Sie
          sind mit einer Linie zu dem Punkt in der Zugverbindung verbunden, an dem man aussteigen
          muss, um die Verbindung zu nehmen. Die folgende Abbildung zeigt Beispielhaft das Ergebnis
          einer Verbindungssuche von Tübingen Hbf nach Augsburg Hbf:
        </p>
        <figure class="figure">
          <img
            :src="journeysImg"
            class="figure-img img-fluid rounded"
            alt="Darstellung von Zugverbindungen von Tübingen Hbf nach Augsburg Hbf"
          />
          <figcaption class="figure-caption">
            Beispielhafte Zugverbindungen von Tübingen Hbf nach Augsburg Hbf
          </figcaption>
        </figure>

        <p>
          Bei der echten Darstellung der Verbindungen ließe sich die Ansicht nun mit Maus, Finger
          oder Pfeiltasten verschieben, um weitere Verbindungen zu zeigen. Mit einem Klick auf eine
          Verbindung, werden Details zu dieser angezeigt.
        </p>
        <router-link
          class="btn btn-primary w-100 mb-3"
          :to="{ path: '/routing' }"
          >Jetzt Alternativen finden</router-link
        >

        <h2>Wann werden Alternativen angezeigt?</h2>
        <p>
          Wir gehen davon aus, dass ein Umstieg mit 30 Minuten umsteigezeit sicher funktioniert.
          Daher werden für alle Umstiege mit weniger als 30 Minuten Umsteigezeit alternativen
          Angezeigt. Eine Alternative muss aber nicht an dem Bahnhof starten, an dem der Anschluss
          verpasst wird. Ist im es könnte im Voraus schon bekannt sein, dass ein Umstieg nicht
          funktionieren wird. Für diesen Fall werden teilweise (wenn vorhanden) auch schon
          Alternativen an früheren Bahnhöfen angezeigt.
        </p>
      </div>
    </div>
  </main-layout>
</template>
