<template>
  <body>
    <NavBar></NavBar>
    <div id="intro" class="container-md">
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 100%"
      >
        <div class="hero-layout">
          <div
            v-if="
              'rebrand' in this.$route.query &&
              this.$route.query['rebrand'] === 'true'
            "
            class="slogan d-flex flex-column justify-content-center align-items-center"
          >
            <h6 class="display-6 fw-bold">TrAIn_Connection_Prediction</h6>
            <h6 class="display-6">heißt jetzt</h6>
            <h1 class="display-4 fw-bold">Bahn-Vorhersage</h1>
          </div>
          <div
            v-else
            class="slogan d-flex flex-column justify-content-center align-items-center"
          >
            <h6 class="display-6">Verspätungen vermeiden</h6>
            <h6 class="display-6">mit</h6>
            <h1 class="display-4 fw-bold">Bahn-Vorhersage</h1>
          </div>
          <SearchForm id="search" class="search hover shadow rounded">
          </SearchForm>
        </div>
      </div>
    </div>
    <div
      class="container-fluid d-flex flex-column align-items-center py-5 main_background"
    >
      <main>
        <router-view id="content" />
      </main>
    </div>
    <footer class="text-center text-info p-3 shadow bg-dark">
      <div class="fw-bold">
        <router-link class="link-info" to="/imprint">Impressum</router-link> /
        <router-link class="link-info" to="/privacy">Datenschutz</router-link>
      </div>
      <br />
      <span
        >© 2022 Bahn-Vorhersage ist ein unabhängiger Service. Dieser steht in
        keiner Verbindung mit der Deutschen Bahn und ihren Tochter-Unternehmen.
      </span>
    </footer>
    <!-- Update Service worker -->
    <SnackBar v-if="updateExists">
      Ein Update ist verfügbar
      <template v-slot:action>
        <div @click="refreshApp" class="click_text">UPDATE</div>
      </template>
    </SnackBar>
    <ErrorDisplay></ErrorDisplay>
  </body>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/NavBar.vue";
import SearchForm from "./components/SearchForm.vue";
import update from "./assets/js/update";
import SnackBar from "./components/SnackBar.vue";
import ErrorDisplay from "./components/ErrorDisplay.vue";

export default defineComponent({
  name: "App",
  data: function () {
    return {
      connections: [],
    };
  },
  components: {
    SearchForm,
    SnackBar,
    NavBar,
    ErrorDisplay,
  },
  mixins: [update],
  mounted() {
    const styles = {
      light_grey: "color: #e5e5e5;",
      light_grey_bg_black:
        "color: #e5e5e5;background-color: #000;font-weight: bold;",
      light_grey_bg_red: "color: #e5e5e5;background-color: #b43836;",
      dark_grey: "color: #666666;",
    };
    console.log(
      "%c████████████████████████████████████▇▆▅▃▁\n" +
        "%c       Bahn-Vorhersage      ███████▙  ▜" +
        "%c██▆▁\n" +
        "%c███████████████████████████████████████████▃\n" +
        "%c▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀" +
        "%c█████▄" +
        "%c▖\n" +
        "%c█████████████████████████████████████████████\n" +
        "%c ▜█▀▀▜█▘                       ▜█▀▀▜█▘" +
        "%c   ▀▀▀",
      styles.light_grey,
      styles.light_grey_bg_black,
      styles.light_grey,
      styles.light_grey,
      styles.light_grey_bg_red,
      styles.light_grey,
      styles.dark_grey,
      styles.light_grey,
      styles.dark_grey,
      styles.light_grey
    );
  },
  methods: {},
});
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "src/assets/fonts/icons/icons.scss";

i {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "icons" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#intro {
  min-height: 800px;
}

.shadow-xxxl {
  box-shadow: 0 0 3em 2em $page_background;
}

.main_background {
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 2em 4em rgba(0, 0, 0, 0.8);
}

html,
body,
#intro {
  height: 100%;
}

main {
  max-width: 100%;
}

body {
  background-image: url(./assets/img/background_bold_blur.webp);
  background-position-x: center;
  background-position-y: 70px;
  background-repeat: no-repeat;
  background-size: contain;
  background-attachment: fixed;
  background-color: $page_background;
  overflow: auto;
  color: $text_color;
}

.text_content {
  max-width: 50em;
  width: 90%;
  margin: auto !important;
  margin-bottom: 80px !important;
  display: grid;
  row-gap: 20px;
}

.stats {
  height: 100%;
  margin: 20px;
}

.stats-picker {
  display: flex;
  justify-content: space-around;
  margin: auto;
  width: 100%;
  gap: 60px;
  align-items: center;
  height: max-content;
  margin-top: 3em;

  .slider {
    width: max-content;
    flex-grow: 1;
  }
}

.stats-image {
  max-height: 70vh;
  max-width: 100%;
  margin: auto;
  display: block;
}

@media (max-width: 1000px) {
  .stats-picker {
    flex-wrap: wrap;
  }
}

.light_text {
  color: $text_color !important;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content;
  grid-template-areas:
    "slogan"
    "search";
  grid-gap: 20px;
  margin: 0 auto;
  width: 100%;
}

.slogan {
  grid-area: slogan;
}

.search {
  grid-area: search;
  padding: 3em 1em;
}

.disclaimer {
  color: $gray-500;
}

@include media-breakpoint-up(sm) {
  .search {
    padding: 3em;
  }
}

@include media-breakpoint-up(lg) {
  .hero-layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "slogan search";
  }
}

.form-check-label {
  text-shadow: 0px 0px 1px $text_color;
  transition: color 0.1s;
}

.form-check-label.inactive {
  text-shadow: none;
}
</style>
