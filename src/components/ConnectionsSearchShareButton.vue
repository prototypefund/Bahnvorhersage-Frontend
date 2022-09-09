<template>
  <button @click="copy_link_to_clipboard" class="btn btn-primary">
    <i class="icon-share-fill"></i> Verbindungen teilen
  </button>
  <SnackBar v-if="link_copied" timeout="3000">
    Link in Zwischenablage kopiert
  </SnackBar>
</template>

<script>
import { defineComponent } from "vue";
import SnackBar from "./SnackBar.vue";

export default defineComponent({
  name: "connectionsSearchShareButton",
  components: {
    SnackBar,
  },
  data: function () {
    return {
      link_copied: false,
    };
  },
  methods: {
    async copy_link_to_clipboard() {
      navigator.clipboard.writeText(window.location);
      this.link_copied = true;
      setTimeout(() => {
        this.link_copied = false;
      }, 3000);
    },
  },
});
</script>
