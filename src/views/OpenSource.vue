<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <main-layout>
    <div id="open-source" class="content-container">
      <div class="text-content">
        <h1 class="text-center"><i class="icon icon-gitlab"></i> Open Source</h1>
        <p>
          Dieses Projekt ist Open Source. Der gesammte Quellcode ist auf GitLab zu finden. Die
          meisten Daten, die wir für dieses Projekt benötigen, dürfen wir nicht veröffentlichen.
        </p>
        <a
          class="btn btn-primary w-100 mb-3"
          href="https://gitlab.com/bahnvorhersage/bahnvorhersage"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="icon icon-gitlab"></i> Backend / Main Repo</a
        >
        <a
          class="btn btn-primary w-100 mb-3"
          href="https://gitlab.com/bahnvorhersage/bahnvorhersage_frontend"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="icon icon-gitlab"></i> Frontend</a
        >
        <h2>Docs</h2>
        <p>
          Mit diesem Projekt haben wir drei mal bei Jugend Forscht teilgenommen. Die schriftlichen
          Ausarbeitungen für Jugend Forscht beinhalten viele Details zu dem Projekt.
        </p>
        <a
          class="btn btn-primary w-100 mb-3"
          href="https://gitlab.com/bahnvorhersage/docs/-/blob/main/Langfassung_Bahnvorhersage_2023.pdf"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="icon icon-gitlab"></i> Langfassung 2023</a
        >
        <a
          class="btn btn-primary w-100 mb-3"
          href="https://gitlab.com/bahnvorhersage/docs/-/blob/main/Old%20Docs/JuFo%202021.pdf"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="icon icon-gitlab"></i> Langfassung 2021</a
        >
        <a
          class="btn btn-primary w-100 mb-3"
          href="https://gitlab.com/bahnvorhersage/docs/-/blob/main/Old%20Docs/JuFo%202020.pdf"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="icon icon-gitlab"></i> Langfassung 2020</a
        >
      </div>
    </div>
  </main-layout>
</template>
