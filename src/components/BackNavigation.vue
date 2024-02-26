<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header class="sticky-top">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark shadow">
      <div class="container-fluid row justify-content-between">
        <div class="col-auto">
          <button type="button" class="btn btn-dark" @click="router.back()">
            <span><i class="icon icon-arrow-left align-text-bottom fs-5"></i> Zurück</span>
          </button>
        </div>
        <div class="col">
          <slot name="nav-body"></slot>
        </div>
      </div>
    </nav>
  </header>
</template>
