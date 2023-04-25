<template>
  <div class="my-5">
    <div v-if="connections.length !== 0">
      <h1 class="text-center">
        {{ $store.state.search_params.start }} nach
        {{ $store.state.search_params.destination }}
      </h1>
      <div class="custom_card rounded overflow-hidden">
        <div class="connections_header">
          <div class="col1 sort_col" @click="sort_time()">
            Zeit
            <span v-if="last_sort === 'departure' || last_sort === 'arrival'">
              <span v-if="last_sort === 'departure'">Ab </span>
              <span v-if="last_sort === 'arrival'">An </span>
              <i v-if="asc_sort[last_sort]" class="arrow up"></i>
              <i v-else-if="!asc_sort[last_sort]" class="arrow down"></i>
            </span>
          </div>
          <div class="col2 sort_col" @click="sort_by_key('duration')">
            Dauer
            <span v-if="last_sort === 'duration'">
              <i v-if="asc_sort[last_sort]" class="arrow up"></i>
              <i v-else-if="!asc_sort[last_sort]" class="arrow down"></i>
            </span>
          </div>
          <div class="col3 sort_col" @click="sort_by_key('transfers')">
            Umstiege
            <span v-if="last_sort === 'transfers'">
              <i v-if="asc_sort[last_sort]" class="arrow up"></i>
              <i v-else-if="!asc_sort[last_sort]" class="arrow down"></i>
            </span>
          </div>
          <div class="col4">Produkte</div>
          <div class="col5 sort_col" @click="sort_by_key('connectionScore')">
            Score
            <span v-if="last_sort === 'connectionScore'">
              <i v-if="asc_sort[last_sort]" class="arrow up"></i>
              <i v-else-if="!asc_sort[last_sort]" class="arrow down"></i>
            </span>
          </div>
          <div class="col6 sort_col" @click="sort_by_key('price')">
            Ticket
            <span v-if="last_sort === 'price'">
              <i v-if="asc_sort[last_sort]" class="arrow up"></i>
              <i v-else-if="!asc_sort[last_sort]" class="arrow down"></i>
            </span>
          </div>
        </div>
      </div>
      <transition-group name="connections" tag="div">
        <div v-for="connection in connections" :key="connection.id">
          <connection-header :connection="connection"></connection-header>
        </div>
      </transition-group>
      <div class="d-flex justify-content-center">
        <ConnectionsSearchShareButton />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import ConnectionHeader from "../components/ConnectionHeader.vue";
import ConnectionsSearchShareButton from "../components/ConnectionsSearchShareButton.vue";

export default defineComponent({
  name: "ConnectionDisplay",
  computed: {
    ...mapState(["connections"]),
  },
  components: {
    ConnectionHeader,
    ConnectionsSearchShareButton,
  },
  data: function () {
    return {
      last_time_key: "departure" as string,
      last_sort: "departure" as string,
      asc_sort: {
        departure: true,
        arrival: false,
        duration: false,
        transfers: true,
        connectionScore: true,
        price: false,
      },
    } as any;
  },
  methods: {
    sort_time: function () {
      if (
        this.last_time_key === "departure" &&
        !this.asc_sort[this.last_time_key]
      ) {
        this.last_time_key = "arrival";
        this.sort_by_key(this.last_time_key);
        this.asc_sort[this.last_time_key] = true;
      } else if (
        this.last_time_key === "arrival" &&
        !this.asc_sort[this.last_time_key]
      ) {
        this.last_time_key = "departure";
        this.sort_by_key(this.last_time_key);
        this.asc_sort[this.last_time_key] = true;
      } else {
        this.sort_by_key(this.last_time_key);
      }
    },
    sort_by_key: function (key: string) {
      let connections = [...this.connections];
      this.last_sort = key;
      // switch sort oder
      this.asc_sort[key] = !this.asc_sort[key];

      if (key === "duration" && this.asc_sort[key]) {
        // sort ascending
        connections.sort(function (a: any, b: any) {
          const x = a[key].$ms;
          const y = b[key].$ms;
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else if (key === "duration" && !this.asc_sort[key]) {
        // sort descending
        connections.sort(function (a: any, b: any) {
          const x = a[key].$ms;
          const y = b[key].$ms;
          return x < y ? 1 : x > y ? -1 : 0;
        });
      } else if (this.asc_sort[key]) {
        // sort ascending
        connections.sort(function (a: any, b: any) {
          const x = a[key];
          const y = b[key];
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else if (!this.asc_sort[key]) {
        // sort descending
        connections.sort(function (a: any, b: any) {
          const x = a[key];
          const y = b[key];
          return x < y ? 1 : x > y ? -1 : 0;
        });
      }
      this.$store.commit("set_connections", connections);
    },
  },
});
</script>

<style lang="scss">
.connections-move {
  transition: transform 1s;
}

.custom_card {
  @include border-radius;
  overflow: hidden;
  background-color: $page_gray;
  margin-bottom: 5px;
  color: $text_color;
  max-width: 70em;
}

.card_header {
  background-color: $page_gray;
  overflow: hidden;
  height: max-content;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr minmax(190px, 1fr);

  .col1,
  .col3,
  .col5,
  .col6 {
    background-color: $page_gray;
  }

  .col2,
  .col4 {
    background-color: $page_lighter_gray;
  }

  .col1.sort_col:hover,
  .col3.sort_col:hover,
  .col5.sort_col:hover,
  .col6.sort_col:hover {
    background-color: color.scale($page_gray, $lightness: -20%);
  }

  .col2.sort_col:hover,
  .col4.sort_col:hover {
    background-color: color.scale($page_lighter_gray, $lightness: -20%);
  }
}

@media (max-width: 1000px) {
  .card_header {
    grid-template-columns: 1fr 1fr minmax(190px, 1fr);

    .col1,
    .col3,
    .col4,
    .col6 {
      background-color: $page_gray;
    }

    .col2,
    .col5 {
      background-color: $page_lighter_gray;
    }

    .col1.sort_col:hover,
    .col3.sort_col:hover,
    .col4.sort_col:hover,
    .col6.sort_col:hover {
      background-color: color.scale($page_gray, $lightness: -20%);
    }

    .col2.sort_col:hover,
    .col5.sort_col:hover {
      background-color: color.scale($page_lighter_gray, $lightness: -20%);
    }
  }
}

@media (max-width: 450px) {
  .card_header {
    background-color: $page_lighter_gray;
    grid-template-columns: 1fr minmax(190px, 1fr);

    .col1,
    .col3,
    .col5 {
      background-color: $page_lighter_gray;
    }

    .col2,
    .col4,
    .col6 {
      background-color: $page_gray;
    }

    .col1.sort_col:hover,
    .col3.sort_col:hover,
    .col5.sort_col:hover {
      background-color: color.scale($page_gray, $lightness: -20%);
    }

    .col2.sort_col:hover,
    .col4.sort_col:hover,
    .col6.sort_col:hover {
      background-color: color.scale($page_lighter_gray, $lightness: -20%);
    }
  }

  .pretty_form {
    padding: 20px 8px;
  }
}

@media (max-width: 350px) {
  .card_header {
    background-color: $page_gray;
    grid-template-columns: minmax(190px, 1fr);
  }
}

.connections_header {
  @extend .card_header;
  overflow: unset;
  border-left: 7px solid transparent;

  div {
    padding: 5px 20px;
  }
}

.card_header_item {
  display: inline-grid;
  flex-grow: 1;
  flex-basis: 1px;
  width: min-content;
  grid-auto-rows: min-content;
}

.outdated {
  color: $page_outdated_text;
}

.affiliate_link_container {
  display: grid;
  flex-grow: 1;
  flex-basis: 0;

  .pretty_button {
    padding: 12px 12px;
  }
}

.card_contents {
  border-top: 1px solid $page_background;
  overflow: auto;
}

.open-enter-active,
.open-leave-active {
  transition: all 0.5s;
  max-height: 99em;
  overflow: hidden;
}

.open-enter-from,
.open-leave-to {
  display: block;
  max-height: 0px;
  overflow: hidden;
}

.arrow {
  border: solid $text_color;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
}

.up {
  transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
}

.sort_col {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  cursor: pointer;
}

.sort_col:hover {
  color: #fff;
  z-index: 1;
}

.sort_col:active {
  transform: scale(0.95);
}
</style>
