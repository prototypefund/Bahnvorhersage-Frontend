<template>
  <div
    class="toggle_container"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="form-check-label" :class="{ inactive: modelValue }">Ab</span>
    <span class="toggler" :class="{ on: modelValue }"></span>
    <span class="form-check-label" :class="{ inactive: !modelValue }">An</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ToggleSwitch",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.toggle_container {
  min-width: max-content;
}

.toggler {
  width: 2.5rem;
  display: inline-block;
  height: 0.9rem;
  background-color: $page_even_lighter_gray;
  margin: 0 0.7rem;
  border-radius: 100px;
  position: relative;
  vertical-align: middle;

  &.on::after {
    left: 1.4rem;
  }
}

.toggler::after {
  content: "";
  width: 1.3rem;
  height: 1.3rem;
  display: inline-block;
  background-color: $primary;
  border-radius: 100px;
  position: absolute;
  top: -0.2rem;
  left: -0.2rem;
  box-shadow: 0 0 0.5rem 0 $page_background;
  transition: left 0.1s;
}
</style>
