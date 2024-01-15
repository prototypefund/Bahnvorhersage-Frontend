<template>
  <SearchHero></SearchHero>
  <div class="content-container" v-if="connections.length !== 0">
    <div class="m-auto container d-flex justify-content-center">
      <div>
        <h1 class="text-center">
          {{ search_params.start }} nach
          {{ search_params.destination }}
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
        <transition-group name="connections">
          <div v-for="connection in connections" :key="connection.id">
            <connection-header :connection="connection"></connection-header>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <ConnectionsSearchShareButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import ConnectionHeader from '../components/ConnectionHeader.vue'
import SearchHero from '../components/SearchHero.vue'
import ConnectionsSearchShareButton from '../components/ConnectionsSearchShareButton.vue'

type SortKey = 'departure' | 'arrival' | 'duration' | 'transfers' | 'connectionScore' | 'price'

const last_time_key = ref<SortKey>('departure')
const last_sort = ref<SortKey>('departure')
const asc_sort = ref({
  departure: true,
  arrival: false,
  duration: false,
  transfers: true,
  connectionScore: true,
  price: false
})

const store = useMainStore()
const { connections, search_params } = storeToRefs(store)

function sort_time() {
  if (last_time_key.value === 'departure' && !asc_sort.value[last_time_key.value]) {
    last_time_key.value = 'arrival'
    sort_by_key(last_time_key.value)
    asc_sort.value[last_time_key.value] = true
  } else if (last_time_key.value === 'arrival' && !asc_sort.value[last_time_key.value]) {
    last_time_key.value = 'departure'
    sort_by_key(last_time_key.value)
    asc_sort.value[last_time_key.value] = true
  } else {
    sort_by_key(last_time_key.value)
  }
}
function sort_by_key(key: SortKey) {
  let tmpConnections = [...connections.value]
  last_sort.value = key
  // switch sort oder
  asc_sort.value[key] = !asc_sort.value[key]

  if (key === 'duration' && asc_sort.value[key]) {
    // sort ascending
    tmpConnections.sort(function (a: any, b: any) {
      const x = a[key].$ms
      const y = b[key].$ms
      return x < y ? -1 : x > y ? 1 : 0
    })
  } else if (key === 'duration' && !asc_sort.value[key]) {
    // sort descending
    tmpConnections.sort(function (a: any, b: any) {
      const x = a[key].$ms
      const y = b[key].$ms
      return x < y ? 1 : x > y ? -1 : 0
    })
  } else if (asc_sort.value[key]) {
    // sort ascending
    tmpConnections.sort(function (a: any, b: any) {
      const x = a[key]
      const y = b[key]
      return x < y ? -1 : x > y ? 1 : 0
    })
  } else if (!asc_sort.value[key]) {
    // sort descending
    tmpConnections.sort(function (a: any, b: any) {
      const x = a[key]
      const y = b[key]
      return x < y ? 1 : x > y ? -1 : 0
    })
  }
  connections.value = tmpConnections
}
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
  cursor: pointer;
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

.fit-content {
  max-width: fit-content;
}
</style>
