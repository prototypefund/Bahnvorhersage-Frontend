<template>
  <div class="dropdown flex-fill">
    <input
      class="form-control"
      :class="{ 'is-invalid': show_error }"
      type="text"
      autocomplete="off"
      :placeholder="placeholder"
      :name="name"
      v-model="_value"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.tab="tab"
      @keydown.esc="loose_focus"
      @input="change"
      v-on:blur="loose_focus"
    />
    <ul
      class="dropdown-menu bg-body-secondary"
      v-bind:class="{ show: open_suggestions }"
      style="width: 100%"
    >
      <li
        v-for="(suggestion, index) in matches"
        :key="index"
        @click="suggestion_click(index)"
        @mousedown="mousedown_prevent"
      >
        <a class="dropdown-item" v-bind:class="{ active: index === current }">{{
          suggestion
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from "vue";

export default defineComponent({
  name: "AutoSuggest",
  props: {
    value: {
      type: String,
      required: true,
    },
    is_valid: {
      type: Boolean,
      required: false,
    },
    values: {
      type: Array as PropType<string[]>,
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
  },
  emits: ["update:value", "update:is_valid"],
  mounted() {
    this.update_is_valid();
  },
  data() {
    return {
      open: false,
      current: 0,
    };
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(value: string) {
        this.$emit("update:value", value);
      },
    },
    _is_valid: {
      get() {
        return this.is_valid;
      },
      set(value: boolean) {
        this.$emit("update:is_valid", value);
      },
    },
    matches() {
      return this.values.filter(
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
        { count: 0, search: this._value.toLowerCase() }
      );
    },
    open_suggestions() {
      return (
        this._value !== "" && this.matches.length !== 0 && this.open === true
      );
    },
    show_error() {
      return !(this._is_valid || this._value === "" || this.open);
    },
  },
  methods: {
    enter(event) {
      if (this.open) {
        event.preventDefault();
        this._value = this.matches[this.current];
        this.open = false;
        this.update_is_valid();
      }
    },
    up() {
      if (this.current > 0) this.current--;
    },
    down() {
      if (this.current < this.matches.length - 1) this.current++;
    },
    is_active(index: number) {
      return index === this.current;
    },
    change() {
      if (!this.open) {
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
      this.update_is_valid();
    },
    suggestion_click(index) {
      this._value = this.matches[index];
      this.open = false;
      this.update_is_valid();
    },
    update_is_valid() {
      if (this.values.length > 0) {
        this._is_valid = this.values.includes(this._value);
      }
    },
  },
  watch: {
    value() {
      this.update_is_valid();
    },
    values() {
      this.update_is_valid();
    },
  },
});
</script>
