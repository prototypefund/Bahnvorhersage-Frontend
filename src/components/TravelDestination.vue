<template>
  <router-link :to="url" class="card text-decoration-none" style="width: 22rem">
    <img
      loading="lazy"
      :src="image"
      class="card-img-top"
      :alt="'Bild von ' + title"
    />
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
      <h4 class="card-title">{{ title }}</h4>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "travelDestination",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: Object,
      required: true,
    },
  },
});
</script>
