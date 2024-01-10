<script setup lang="ts">
import SearchForm from "./SearchForm.vue";
</script>

<template>
  <div class="container-md viewport-height d-flex">
    <div class="hero-layout">
      <div class="slogan text-center align-self-center">
        <h6 class="display-6">Verspätungen vermeiden</h6>
        <h6 class="display-6">mit</h6>
        <h1 class="display-4 fw-bold">Bahn-Vorhersage</h1>
      </div>
      <SearchForm
        id="search"
        class="search hover shadow rounded align-self-center"
      >
      </SearchForm>
    </div>
  </div>
</template>

<style lang="scss">
.viewport-height {
  min-height: 85vh; // calc(100vh - 50px); // 50px is the height of the navbar
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content;
  grid-template-areas:
    "slogan"
    "search";
  grid-gap: 20px;
  width: 100%;
}

@include media-breakpoint-up(lg) {
  .hero-layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "slogan search";
  }
}

.slogan {
  grid-area: slogan;
}

.search {
  grid-area: search;
  padding: 3em 1em;
}
</style>
