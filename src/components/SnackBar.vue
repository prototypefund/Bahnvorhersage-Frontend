<template>
  <div class="snackbar-center">
    <div id="snackbar" class="">
      <div
        class="shadow rounded snack-content"
        :class="[
          {
            'layout small': layout === 'small',
            'layout multiline': layout === 'multiline'
          },
          style_class
        ]"
      >
        <div>
          <slot></slot>
        </div>
        <slot name="action"> </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SnackBar',
  props: {
    layout: {
      type: String,
      default: 'small',
      validator: function (value: any) {
        return ['small', 'multiline'].indexOf(value) !== -1
      }
    },
    style_class: {
      type: String,
      default: ''
    }
  },
})
</script>

<style lang="scss">
.snackbar-center {
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: fixed; /* Sit on top of the screen */
  bottom: 30px; /* 30px from the bottom */
  z-index: 10;
}

#snackbar {
  width: 95%;
  max-width: 600px;

  .layout {
    padding: 20px 30px;
    display: grid;
    align-items: center;
  }

  .layout.small {
    grid-template-columns: auto min-content;
    column-gap: 20px;
  }

  .layout.multiline {
    grid-template-rows: auto min-content;
    row-gap: 20px;
  }

  .snack-content {
    background-color: $page_lighter_gray;
  }
}
</style>
