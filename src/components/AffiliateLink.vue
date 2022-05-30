<template>
  <div class="mt-auto mb-auto">
    <a :href="link" target="_blank" rel="noopener" @click.stop>
      <span
        class="btn btn-primary text-nowrap d-block m-2"
        v-if="price === -1"
        data-bs-toggle="tooltip"
        title="Wir können für diese Verbindung leider keinen Preis ermitteln. Vielleicht kann die Bahn den Preis angeben"
        >Preis ermitteln</span
      >
      <span class="btn btn-primary text-nowrap d-block m-2" v-else
        >{{ price.toFixed(2) }}€</span
      >
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AffiliateLink",
  props: ["date", "time", "start", "destination", "price"],
  computed: {
    link: function () {
      return `https://reiseauskunft.bahn.de//bin/query.exe/dn?dbkanal_003=L01_S01_D001_KAF0001_Linkgenerator_individuelle_Verbindungen-!!!affid!!!_LZ01&S=${encodeURIComponent(
        this.start
      )}&Z=${encodeURIComponent(this.destination)}&date=${this.date.format(
        "DD.MM.YYYY"
      )}&time=${this.time.format("HH:mm")}&timesel=depart&start=1&l=d`;
    },
  },
});
</script>
