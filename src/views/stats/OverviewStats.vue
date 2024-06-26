<template>
  <main-layout>
    <div id="stats" class="content-container">
      <div class="text-content">
        <div>
          <h1>Übersicht über die verwendeten Daten</h1>
          <p>
            Unser Machine Learning System wird auf echten Verspätungsinformationen trainiert. Diese
            Daten werden rund um die Uhr von uns aktualisiert. Hier gibt es eine Übersicht über den
            Datensatz.
          </p>
        </div>
        <div v-if="Object.keys(stats).length" class="text-center">
          Letzte Aktuallisierung der Statistik: {{ stats?.time }}
          <div class="stats-overview">
            <div class="header-row"></div>
            <div class="stath header"></div>
            <div class="arrivalh header">Ankunft</div>
            <div class="departureh header">Abfahrt</div>

            <!-- All Data -->
            <div class="vertical-header">
              <div class="vertical-rl">Daten seit Oktober 2020</div>
            </div>
            <div class="stat header">Anzahl an Halten</div>
            <div class="arrival">
              <span>{{ stats?.all_num_ar_data.toLocaleString('de-DE') }}</span>
            </div>
            <div class="departure">
              <span>{{ stats?.all_num_dp_data.toLocaleString('de-DE') }}</span>
            </div>

            <div class="stat header">Maximale Verspätung</div>
            <div class="arrival">
              <span>{{ stats?.all_max_ar_delay.toLocaleString('de-DE') }} min</span>
            </div>
            <div class="departure">
              <span>{{ stats?.all_max_dp_delay.toLocaleString('de-DE') }} min</span>
            </div>

            <div class="stat header">Ø Verspätung</div>
            <div class="arrival">
              <span>{{ stats?.all_avg_ar_delay.toLocaleString('de-DE') }} min</span>
            </div>
            <div class="departure">
              <span>{{ stats?.all_avg_dp_delay.toLocaleString('de-DE') }} min</span>
            </div>

            <div class="stat header">Prozent an Verspätungen</div>
            <div class="arrival">
              <span>{{ stats?.all_perc_ar_delay.toLocaleString('de-DE') }}%</span>
            </div>
            <div class="departure">
              <span>{{ stats?.all_perc_dp_delay.toLocaleString('de-DE') }}%</span>
            </div>

            <div class="stat header">Prozent an Ausfällen</div>
            <div class="arrival">
              <span>{{ stats?.all_perc_ar_cancel.toLocaleString('de-DE') }}%</span>
            </div>
            <div class="departure">
              <span>{{ stats?.all_perc_dp_cancel.toLocaleString('de-DE') }}%</span>
            </div>

            <div class="rowspan divider"></div>

            <!-- Most recent day of data -->
            <div class="vertical-header">
              <div class="vertical-rl">Daten vom {{ stats?.new_date }}</div>
            </div>
            <div class="stat header">Anzahl an Halten</div>
            <div class="arrival">
              <span>{{ stats?.new_num_ar_data.toLocaleString('de-DE') }}</span>
            </div>
            <div class="departure">
              <span>{{ stats?.new_num_dp_data.toLocaleString('de-DE') }}</span>
            </div>

            <div class="stat header">Maximale Verspätung</div>
            <div class="arrival">
              <span>{{ stats?.new_max_ar_delay.toLocaleString('de-DE') }} min</span>
            </div>
            <div class="departure">
              <span>{{ stats?.new_max_dp_delay.toLocaleString('de-DE') }} min</span>
            </div>

            <div class="stat header">Ø Verspätung</div>
            <div class="arrival">
              <span>{{ stats?.new_avg_ar_delay.toLocaleString('de-DE') }} min</span>
            </div>
            <div class="departure">
              <span>{{ stats?.new_avg_dp_delay.toLocaleString('de-DE') }} min</span>
            </div>

            <div class="stat header">Prozent an Verspätungen</div>
            <div class="arrival">
              <span>{{ stats?.new_perc_ar_delay.toLocaleString('de-DE') }}%</span>
            </div>
            <div class="departure">
              <span>{{ stats?.new_perc_dp_delay.toLocaleString('de-DE') }}%</span>
            </div>

            <div class="stat header">Prozent an Ausfällen</div>
            <div class="arrival">
              <span>{{ stats?.new_perc_ar_cancel.toLocaleString('de-DE') }}%</span>
            </div>
            <div class="departure">
              <span>{{ stats?.new_perc_dp_cancel.toLocaleString('de-DE') }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import { useMainStore } from '@/stores/main';
import { onMounted, ref } from 'vue';

type Stats = {
  time: string
  new_date: string
  all_num_ar_data: number
  all_num_dp_data: number
  all_max_ar_delay: number
  all_max_dp_delay: number
  all_avg_ar_delay: number
  all_avg_dp_delay: number
  all_perc_ar_delay: number
  all_perc_dp_delay: number
  all_perc_ar_cancel: number
  all_perc_dp_cancel: number
  new_num_ar_data: number
  new_num_dp_data: number
  new_max_ar_delay: number
  new_max_dp_delay: number
  new_avg_ar_delay: number
  new_avg_dp_delay: number
  new_perc_ar_delay: number
  new_perc_dp_delay: number
  new_perc_ar_cancel: number
  new_perc_dp_cancel: number
}

const store = useMainStore()

const stats = ref<Stats>({} as Stats)

onMounted(() => {
  fetch(window.location.protocol + '//' + window.location.host + '/api/stats')
    .then((response) => store.display_fetch_error(response))
    .then((response) => response.json())
    .then((response) => {
      stats.value = response
    })
})
</script>

<style lang="scss">
.stats-overview {
  @include border-radius;
  display: grid;
  grid-template-columns: min-content repeat(3, auto);
  gap: 2px;
  background-color: $page_lighter_gray;
  border: 2px solid $page_lighter_gray;
}

.stats-overview > div {
  @include border-radius;
  text-align: center;
  vertical-align: middle;
  background-color: $page_gray;
  padding: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.stats-overview > .stath {
  grid-area: 1 / 1 / 1 / 3;
}

.stats-overview > .arrivalh {
  grid-area: 1 / 3 / 1 / 4;
}

.stats-overview > .departureh {
  grid-area: 1 / 4 / 1 / 5;
}

.rowspan {
  grid-column-start: span 4;
}

.stats-overview > .header {
  font-size: 1.1rem;
  font-weight: bold;
}

.stats-overview > .header-row {
  grid-area: 1 / 1 / 1 / 5;
}

.stats-overview > .divider {
  border-bottom: 2px solid $page_lighter_gray;
  padding: 0;
}

.vertical-rl {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
}

.vertical-header {
  grid-row-start: span 5;
  display: flex;
  width: calc(1.5em + 30px);
}

@media (max-width: 740px) {
  .stats-overview > .header {
    font-size: 1rem;
  }

  .stats-overview > div {
    padding: 15px 5px;
  }

  .vertical-header {
    width: calc(1.5em + 10px);
  }
}
</style>
