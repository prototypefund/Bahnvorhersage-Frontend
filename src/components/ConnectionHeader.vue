<template>
  <!-- summary -->
  <div v-bind:style="[background_color, border_style]" class="custom_card">
    <div v-on:click="show_details = !show_details" class="card_header">
      <div class="p-3 col1">
        <div>
          {{ connection.departure.format("HH:mm") }}
          <del
            v-show="!connection.departure.isSame(connection.plannedDeparture)"
            class="outdated"
          >
            {{ connection.plannedDeparture.format("HH:mm") }}
          </del>
        </div>

        <div>
          {{ connection.arrival.format("HH:mm") }}
          <del
            v-show="!connection.arrival.isSame(connection.plannedArrival)"
            class="outdated"
          >
            {{ connection.plannedArrival.format("HH:mm") }}
          </del>
        </div>
      </div>
      <div class="p-3 col2">
        {{ connection.duration.format("H:mm")
        }}<del
          v-show="!connection.duration.asSeconds() === connection.plannedDuration.asSeconds()"
          class="outdated"
        >
          {{ connection.plannedDuration.format("H:mm") }}
        </del>
      </div>
      <div class="p-3 col3">{{ connection.transfers }}</div>
      <div class="p-3 col4">
        {{ connection.trainCategories.join(", ") }}
      </div>
      <div class="p-3 col5" v-bind:style="[text_color]">
        {{ connection.connectionScore }}%
      </div>
      <AffiliateLink
        class="col6"
        :date="connection.departure"
        :time="connection.departure"
        :price="connection.price"
        :start="connection.legs[0].origin.name"
        :destination="connection.legs.at(-1).destination.name"
      ></AffiliateLink>
    </div>
    <!-- segments -->
    <transition name="open">
      <div v-show="show_details" class="card_contents">
        <div>
          <div class="details_grid">
            <ConnectionSegment
              v-for="(segment, index) in connection.legs"
              v-bind:key="index"
              v-bind:segment="segment"
              v-bind:con_score="connection.connectionScore"
            ></ConnectionSegment>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { rdylgr_colormap } from "../assets/js/colormap";
import ConnectionSegment from "./ConnectionSegment.vue";
import AffiliateLink from "./AffiliateLink.vue";

export default defineComponent({
  name: "ConnectionHeader",
  components: {
    ConnectionSegment,
    AffiliateLink,
  },
  props: ["connection"],
  data: function () {
    return {
      show_details: false,
      background_color: {
        "background-color": "#212529",
      },
      border_style: {
        "border-left":
          "10px solid " +
          rdylgr_colormap(this.connection.connectionScore, 50, 100, 200),
      },
      text_color: {
        color: rdylgr_colormap(this.connection.connectionScore, 50, 100, 200),
      },
    };
  },
});
</script>
