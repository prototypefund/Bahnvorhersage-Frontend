<template>
  <div class="form-check" :class="{ 'form-check-inline': inline }">
    <input class="form-check-input" type="checkbox" v-model="value" :id="id" />
    <label
      class="form-check-label"
      :class="{ inactive: !modelValue }"
      :for="id"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "CheckBox",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
});
</script>
