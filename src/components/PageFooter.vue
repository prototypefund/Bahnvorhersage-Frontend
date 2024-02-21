<template>
  <footer class="text-center text-info p-3 shadow bg-dark">
    <div class="sponsors text-light text-start mx-auto">
      <h4>Gefördert von:</h4>
      <div class="logo-container my-4">
        <a href="https://www.bmbf.de/" target="_blank" rel="noopener noreferrer"
          ><img
            class="logo"
            loading="lazy"
            width="198.45px"
            :src="bmbfLogo"
            alt="Logo des Bundesministeriums für Bildung und Forschung"
        /></a>
        <a
          href="https://prototypefund.de/"
          target="_blank"
          rel="noopener noreferrer"
          ><img
            class="logo"
            loading="lazy"
            width="56.6167px"
            :src="prototypefundLogo"
            alt="Logo des Prototypefunds"
        /></a>
        <a href="https://sfz-bw.de/" target="_blank" rel="noopener noreferrer"
          ><img
            class="logo"
            loading="lazy"
            width="139.183px"
            :src="sfzLogo"
            alt="Logo des Schülerforschungszentrums Südwürttemberg"
        /></a>
      </div>
    </div>
    <div class="fw-bold mt-5 mb-3">
      <router-link class="link-info" to="/imprint">Impressum</router-link> /
      <router-link class="link-info" to="/privacy">Datenschutz</router-link>
    </div>
    <span class="py-3"
      >© 2024 Bahn-Vorhersage ist ein unabhängiger Service. Dieser steht in
      keiner Verbindung mit der Deutschen Bahn und ihren Tochter-Unternehmen.
    </span>
  </footer>
</template>

<script setup lang="ts">
import sfzLogo from "@/assets/img/sfz_logo.svg";
import bmbfLogo from "@/assets/img/bmbf_logo.svg";
import prototypefundLogo from "@/assets/img/prototypefund_logo.svg";
</script>

<style lang="scss">
.sponsors {
  width: fit-content;
}

.logo-container {
  display: flex;
  flex-direction: column;
  gap: 2cm;
  align-items: center;
}

@include media-breakpoint-up(md) {
  .logo-container {
    flex-direction: row;
  }
}

.logo {
  height: 100px;
}
</style>
