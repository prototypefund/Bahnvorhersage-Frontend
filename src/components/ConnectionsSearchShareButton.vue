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
      const query = {};
      query.start = this.$store.state.search_params.start;
      query.destination = this.$store.state.search_params.destination;
      query.date = this.$store.state.search_params.date;
      query.search_for_arrival =
        this.$store.state.search_params.search_for_arrival;
      query.only_regional = this.$store.state.search_params.only_regional;
      query.bike = this.$store.state.search_params.bike;
      const path = this.$router.resolve({
        path: "/",
        hash: "#search",
        query: query,
      });
      navigator.clipboard.writeText(window.location.origin + path.href);
      this.link_copied = true;
      setTimeout(() => {
        this.link_copied = false;
      }, 3000);
    },
  },
});
</script>
