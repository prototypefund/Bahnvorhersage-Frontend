<template>
  <main-layout>
    <SearchHero></SearchHero>
    <div class="content-container" id="content" v-if="connections.length !== 0">
      <div class="m-auto container d-flex justify-content-center">
        <div>
          <h1 class="text-center">
            {{ searchParams.start }} nach
            {{ searchParams.destination }}
          </h1>
          <div class="journey-card">
            <div class="journey-display-sorter">
              <div class="col1 sort-col" @click="sortTime()">
                Zeit
                <span v-if="lastSort === 'departure' || lastSort === 'arrival'">
                  <span v-if="lastSort === 'departure'">Ab </span>
                  <span v-if="lastSort === 'arrival'">An </span>
                  <i v-if="ascSort[lastSort]" class="arrow up"></i>
                  <i v-else-if="!ascSort[lastSort]" class="arrow down"></i>
                </span>
              </div>
              <div class="col2 sort-col" @click="sortByKey('duration')">
                Dauer
                <span v-if="lastSort === 'duration'">
                  <i v-if="ascSort[lastSort]" class="arrow up"></i>
                  <i v-else-if="!ascSort[lastSort]" class="arrow down"></i>
                </span>
              </div>
              <div class="col3 sort-col" @click="sortByKey('transfers')">
                Umstiege
                <span v-if="lastSort === 'transfers'">
                  <i v-if="ascSort[lastSort]" class="arrow up"></i>
                  <i v-else-if="!ascSort[lastSort]" class="arrow down"></i>
                </span>
              </div>
              <div class="col4">Produkte</div>
              <div class="col5 sort-col" @click="sortByKey('connectionScore')">
                Score
                <span v-if="lastSort === 'connectionScore'">
                  <i v-if="ascSort[lastSort]" class="arrow up"></i>
                  <i v-else-if="!ascSort[lastSort]" class="arrow down"></i>
                </span>
              </div>
              <div class="col6 sort-col" @click="sortByKey('price')">
                Ticket
                <span v-if="lastSort === 'price'">
                  <i v-if="ascSort[lastSort]" class="arrow up"></i>
                  <i v-else-if="!ascSort[lastSort]" class="arrow down"></i>
                </span>
              </div>
            </div>
          </div>
          <transition-group name="connections">
            <div v-for="connection in connections" :key="connection.id">
              <journey-card :journey="connection"></journey-card>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <ConnectionsSearchShareButton />
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import JourneyCard from '@/components/JourneyCard.vue'
import SearchHero from '../components/SearchHero.vue'
import ConnectionsSearchShareButton from '../components/ConnectionsSearchShareButton.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import type { Journey } from '@/assets/ts/fptfTypes'
import dayjs from 'dayjs'

type SortKey = 'departure' | 'arrival' | 'duration' | 'transfers' | 'connectionScore' | 'price'

const departureFunc = (c: Journey) => c.legs[0].departure
const arrivalFunc = (c: Journey) => c.legs[c.legs.length - 1].arrival
const durationFunc = (c: Journey) => dayjs(arrivalFunc(c)).diff(dayjs(departureFunc(c)))
const transfersFunc = (c: Journey) => {
  let ridingLegs = 0
  for (let leg of c.legs) {
    if (! ('walking' in leg) || leg.walking === false) {
      ridingLegs++
    }
  }
  return ridingLegs - 1
}
const connectionScoreFunc = (c: Journey) => {
  let connectionScore = 1
  for (let leg of c.legs) {
    if (leg.transferScore) {
      connectionScore *= leg.transferScore
    }
  }
  return Math.trunc(connectionScore * 100)
}
const priceFunc = (c: Journey) => {
  return c.price || Infinity
}

const keyFuncs = {
  departure: departureFunc,
  arrival: arrivalFunc,
  duration: durationFunc,
  transfers: transfersFunc,
  connectionScore: connectionScoreFunc,
  price: priceFunc
}
  

const lastTimeKey = ref<SortKey>('departure')
const lastSort = ref<SortKey>('departure')
const ascSort = ref({
  departure: true,
  arrival: false,
  duration: false,
  transfers: true,
  connectionScore: true,
  price: false
})

const store = useMainStore()
const { connections, searchParams: searchParams } = storeToRefs(store)

function sortTime() {
  if (lastTimeKey.value === 'departure' && !ascSort.value[lastTimeKey.value]) {
    lastTimeKey.value = 'arrival'
    sortByKey(lastTimeKey.value)
    ascSort.value[lastTimeKey.value] = true
  } else if (lastTimeKey.value === 'arrival' && !ascSort.value[lastTimeKey.value]) {
    lastTimeKey.value = 'departure'
    sortByKey(lastTimeKey.value)
    ascSort.value[lastTimeKey.value] = true
  } else {
    sortByKey(lastTimeKey.value)
  }
}
function sortByKey(key: SortKey) {
  const sortFunc = keyFuncs[key]
  let tmpConnections = [...connections.value]
  lastSort.value = key
  // switch sort oder
  ascSort.value[key] = !ascSort.value[key]

  if (ascSort.value[key]) {
    // sort ascending
    tmpConnections.sort(function (a: Journey, b: Journey) {
      const x = sortFunc(a)
      const y = sortFunc(b)
      return x < y ? -1 : x > y ? 1 : 0
    })
  } else {
    // sort descending
    tmpConnections.sort(function (a: Journey, b: Journey) {
      const x = sortFunc(a)
      const y = sortFunc(b)
      return x < y ? 1 : x > y ? -1 : 0
    })
  }
  connections.value = tmpConnections
}
</script>
