<template>
  <SnackBar
    v-if="error"
    :layout="'multiline'"
    :timeout="15000"
    class="text-dark"
    :style_class="'bg-danger'"
  >
    <div>
      <div><b>Holy Guacamole!</b> {{ error.toString() }}</div>
      <div>
        Falls der Fehler weiterhin auftritt, verfassen Sie bitte einen Bugreport
        auf
        <a
          href="https://gitlab.com/bahnvorhersage/bahnvorhersage/-/issues?sort=created_date&state=opened"
          class="link-dark fw-bold"
          target="_blank"
          rel="noopener"
          >GitLab</a
        >
      </div>
    </div>
  </SnackBar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import SnackBar from "../components/SnackBar.vue";

export default defineComponent({
  name: "ErrorDisplay",
  computed: {
    ...mapState(["error"]),
  },
  components: {
    SnackBar,
  },
});
</script>
