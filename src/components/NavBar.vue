<template>
  <header class="sticky-top">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark shadow">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" @click="collapse.toggle()">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarSupportedContent"
          ref="collapse"
        >
          <router-link
            class="navbar-brand"
            @click="collapse.hide()"
            :to="{ path: '/' }"
            ><img
              src="../assets/img/IC.svg"
              height="24"
              width="32"
              alt="bahnvorhersage logo"
          /></router-link>
          <div class="navbar-nav me-auto">
            <router-link
              class="nav-item nav-link"
              @click="collapse.hide()"
              :to="{ path: '/connections', hash: '#content' }"
              >Verbindungen</router-link
            >
            <router-link
              class="nav-item nav-link"
              @click="collapse.hide()"
              :to="{ path: '/about', hash: '#content' }"
              >Über uns</router-link
            >
            <div class="nav-item dropdown">
              <router-link
                class="nav-link dropdown-toggle"
                @click="collapse.hide()"
                data-toggle="dropdown"
                :to="{ path: '/stats', hash: '#content' }"
                >Statistiken</router-link
              >
              <div class="dropdown-menu dropdown-menu-dark bg-dark rounded">
                <router-link
                  class="nav-link"
                  @click="collapse.hide()"
                  :to="{ path: '/stats/overview', hash: '#content' }"
                  >Übersicht</router-link
                >
                <router-link
                  class="nav-link"
                  @click="collapse.hide()"
                  :to="{ path: '/stats/stations', hash: '#content' }"
                  >Bahnhöfe</router-link
                >
              </div>
            </div>
            <div class="nav-item dropdown">
              <router-link
                class="nav-link dropdown-toggle"
                @click="collapse.hide()"
                data-toggle="dropdown"
                :to="{ path: '/opendata', hash: '#content' }"
                >Open Data</router-link
              >
              <div class="dropdown-menu dropdown-menu-dark bg-dark rounded">
                <router-link
                  class="nav-link"
                  @click="collapse.hide()"
                  :to="{ path: '/stationviewer', hash: '#content' }"
                  >Stationsdaten</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <install-button></install-button>
          <router-link
            class="btn btn-primary"
            @click="collapse.hide()"
            :to="{ path: '/opensource', hash: '#content' }"
            ><i class="icon icon-gitlab"></i> GitLab / Docs</router-link
          >
        </div>
      </div>
    </nav>
    <div id="pgr_bar"></div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import installButton from "./InstallButton.vue";
import update from "../assets/js/update";
import { mapState } from "vuex";
import { default as ProgressBar } from "progressbar.js";
import { Collapse } from "bootstrap";
// import ProgressBar = require("progressbar.js");

export default defineComponent({
  name: "NavBar",
  components: { installButton },
  data: function () {
    return {
      progress: null,
      collapse: null,
    };
  },
  computed: {
    ...mapState(["progressing"]),
  },
  mounted: function () {
    this.progress = new ProgressBar.Line("#pgr_bar", {
      strokeWidth: 0.8,
      color: "#3f51b5",
      trailColor: "transparent",
      trailWidth: 0,
    });
    this.collapse = new Collapse(this.$refs.collapse, {
      toggle: false,
    });
  },
  watch: {
    progressing: function (val) {
      if (val) {
        this.progress.animate(600, { duration: 300000, easing: "linear" });
      } else {
        this.progress.animate(0, { duration: 10, easing: "linear" });
      }
    },
  },
});
</script>

<style lang="scss">
.navbar .dropdown-menu {
  display: block;
}

.dropdown-menu .nav-link {
  padding-left: 1rem !important;
}

@include media-breakpoint-up(md) {
  .navbar .nav-item .dropdown-menu {
    display: none;
  }
  .navbar .nav-item:hover .dropdown-menu {
    display: block;
  }
  .navbar .nav-item .dropdown-menu {
    margin-top: 0;
  }
}

#pgr_bar {
  position: relative;
  top: -5px;
}
</style>
