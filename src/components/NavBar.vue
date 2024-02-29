<template>
  <header class="sticky-top">
    <nav class="navbar navbar-expand-md bg-dark shadow">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" @click="collapse.toggle()">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <router-link class="navbar-brand" @click="collapse.hide()" :to="{ path: '/' }"
            ><img src="../assets/img/IC.svg" height="24" width="32" alt="bahnvorhersage logo"
          /></router-link>
          <div class="navbar-nav me-auto">
            <router-link
              class="nav-item nav-link"
              @click="collapse.hide()"
              :to="{ path: '/connections', hash: '#content' }"
              >Verbindungen</router-link
            >
            <div class="nav-item dropdown">
              <router-link
                class="nav-item nav-link glow"
                @click="collapse.hide()"
                :to="{ path: '/routing' }"
                >Neu: Alternativen</router-link
              >
              <div class="dropdown-menu rounded">
                <router-link
                  class="nav-item nav-link"
                  @click="collapse.hide()"
                  :to="{ path: '/routing' }"
                  >Alternativen</router-link
                >
                <router-link
                  class="nav-item nav-link"
                  @click="collapse.hide()"
                  :to="{ path: '/routing/explanation' }"
                  >Funktionsweise</router-link
                >
              </div>
            </div>
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
              <div class="dropdown-menu rounded">
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
              <div class="dropdown-menu shadow rounded">
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

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import installButton from './InstallButton.vue'
import { default as ProgressBar } from 'progressbar.js'
import { Collapse } from 'bootstrap'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { progressing } = storeToRefs(store)

const progress = ref(null)
const collapse = ref(null)

onMounted(() => {
  progress.value = new ProgressBar.Line('#pgr_bar', {
    strokeWidth: 0.8,
    color: '#3f51b5',
    trailColor: 'transparent',
    trailWidth: 0
  })
  collapse.value = new Collapse('#navbarSupportedContent', {
    toggle: false
  })
})

watch(progressing, (val) => {
  if (val) {
    progress.value.animate(600, { duration: 300000, easing: 'linear' })
  } else {
    progress.value.animate(0, { duration: 10, easing: 'linear' })
  }
})
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

.glow {
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: none;
    color: $page_gray_text;
  }
  to {
    text-shadow: 0 0 10px $warning;
    color: $text_color;
  }
}
</style>
