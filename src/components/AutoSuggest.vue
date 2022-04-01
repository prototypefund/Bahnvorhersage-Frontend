<template>
  <div class="dropdown flex-fill">
    <input
      class="form-control"
      :class="{ 'is-invalid': is_invalid }"
      type="text"
      autocomplete="off"
      :placeholder="placeholder"
      :name="name"
      v-model="value"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.tab="tab"
      @keydown.esc="loose_focus"
      @input="change"
      v-on:blur="loose_focus"
    />
    <ul
      class="dropdown-menu dropdown-menu-dark"
      v-bind:class="{ show: open_suggestions }"
      style="width: 100%"
    >
      <li
        v-for="(suggestion, index) in matches"
        :key="index"
        @click="suggestion_click(index)"
        @mousedown="mousedown_prevent"
      >
        <a
          class="dropdown-item"
          v-bind:class="{ active: index === current }"
          href="#"
          >{{ suggestion }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "AutoSuggest",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    is_invalid: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      open: false,
      current: 0,
    };
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    matches() {
      return this.stations.filter(
        function (item) {
          if (
            this.search &&
            this.count < 20 &&
            item.toLowerCase().indexOf(this.search) >= 0
          ) {
            this.count++;
            return true;
          }
          return false;
        },
        { count: 0, search: this.modelValue.toLowerCase() }
      );
    },

    open_suggestions() {
      return (
        this.modelValue !== "" &&
        this.matches.length !== 0 &&
        this.open === true
      );
    },
    ...mapState(["stations"]),
  },

  methods: {
    enter(event) {
      if (this.open) {
        event.preventDefault();
        this.value = this.matches[this.current];
        this.open = false;
      }
    },

    up() {
      if (this.current > 0) this.current--;
    },

    down() {
      if (this.current < this.matches.length - 1) this.current++;
    },

    is_active(index) {
      return index === this.current;
    },

    change() {
      if (this.open === false) {
        this.open = true;
        this.current = 0;
      }
    },

    tab(event) {
      if (this.open) {
        event.preventDefault();
        if (this.current < this.matches.length - 1) this.current++;
        else this.current = 0;
      }
    },

    mousedown_prevent(event) {
      // clicking on a suggestion should not trigger blur
      event.preventDefault();
    },

    loose_focus() {
      this.open = false;
    },

    suggestion_click(index) {
      this.value = this.matches[index];
      this.open = false;
    },
  },
});
</script>
