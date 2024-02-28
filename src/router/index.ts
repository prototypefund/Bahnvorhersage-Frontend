import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore, SearchParams } from '@/stores/main'
import { storeToRefs } from 'pinia'
type LocationQuery = import('vue-router').LocationQuery
type RouteRecordRaw = import('vue-router').RouteRecordRaw

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/connections',
    name: 'Verbindungen',
    component: () => import('../views/JourneyDisplay.vue')
  },
  {
    path: '/routing',
    name: 'Alpha: Routing',
    component: () => import('../views/AlphaRouting.vue')
  },
  {
    path: '/routing/journeys',
    name: 'Verbindungen und Alternativen',
    component: () => import('../views/routing/JourneyPage.vue')
  },
  {
    path: '/journeydetails/:index',
    name: 'Verbindungs-Details',
    component: () => import('../views/JourneyDetails.vue')
  },
  {
    path: '/about',
    name: 'Über TCP',
    component: () => import('../views/AboutPage.vue')
  },
  {
    path: '/imprint',
    name: 'Impressum',
    component: () => import('../views/ImprintPage.vue')
  },
  {
    path: '/privacy',
    name: 'Datenschutz',
    component: () => import('../views/PrivacyPage.vue')
  },
  {
    path: '/opensource',
    name: 'Open Source',
    component: () => import('../views/OpenSource.vue')
  },
  {
    path: '/stats',
    name: 'Statistiken',
    component: () => import('../views/stats/StatsDescription.vue')
  },
  {
    path: '/stats/overview',
    name: 'Übersichtsstatistik',
    component: () => import('../views/stats/OverviewStats.vue')
  },
  {
    path: '/stats/stations',
    name: 'Bahnhofs-Statistiken',
    component: () => import('../views/stats/StationStats.vue')
  },
  {
    path: '/opendata',
    name: 'Open Data',
    component: () => import('../views/OpenData.vue')
  },
  {
    path: '/stationviewer',
    name: 'Stationviewer',
    component: () => import('../views/StationDataViewer.vue')
  },
  {
    // Redirect to external url defined in a parameter called "url"
    path: '/redirect',
    name: 'Redirect',
    component: () => import('../views/HomePage.vue'),
    beforeEnter: (to) => {
      location.href = to.query.url as string
    }
  },
  {
    // Redirect to external url defined in a parameter called "url"
    path: '/paper',
    name: 'Paper',
    component: () => import('../views/HomePage.vue'),
    beforeEnter: () => {
      location.href =
        'https://gitlab.com/bahnvorhersage/docs/-/raw/main/Langfassung_Bahnvorhersage_2023.pdf'
    }
  },
  {
    // Redirect to external url defined in a parameter called "url"
    path: '/paper2021',
    name: 'Paper2021',
    component: () => import('../views/HomePage.vue'),
    beforeEnter: () => {
      location.href = 'https://gitlab.com/bahnvorhersage/docs/-/raw/main/Old%20Docs/JuFo%202021.pdf'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes: routes,
  scrollBehavior(to): any {
    if (to.hash) {
      nextTick(() => {
        nextTick(() => {
          document
            ?.getElementById(to.hash.substring(1))
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      })
      // Does not work but it's the official vue way
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
  }
})

function extract_search_params(query: LocationQuery): LocationQuery {
  return Object.keys(new SearchParams()).reduce(
    (result, key) => {
      if (query[key]) {
        result[key] = query[key]
      }
      return result
    },
    <LocationQuery>{}
  )
}

function search_params_from_location_query(query: LocationQuery): SearchParams {
  return Object.entries(new SearchParams()).reduce((result, [key, value]) => {
    if (query[key]) {
      if (typeof value == 'boolean') {
        // Booleans need to be parsed separately
        result[key] = query[key] === 'true'
      } else {
        result[key] = value.constructor(query[key])
      }
    }
    return result
  }, new SearchParams())
}

router.beforeEach(async (to, from) => {
  const old_query_params = extract_search_params(from.query)
  const new_query_params = extract_search_params(to.query)
  const new_query_params_parsed = search_params_from_location_query(new_query_params)

  const store = useMainStore()
  const { searchParams: searchParams, stations } = storeToRefs(store)

  if (
    Object.keys(new_query_params).length > 0 &&
    JSON.stringify(new_query_params) !== JSON.stringify(old_query_params) &&
    JSON.stringify(new_query_params_parsed) !== JSON.stringify(searchParams.value)
  ) {
    // newer params in the query
    searchParams.value = new_query_params_parsed
    if (to.path === '/connections') {
      // do an await here in order to make it possible to return a different hash
      store.fetchStations().then(() => {
        if (
          stations.value.includes(searchParams.value.start) &&
          stations.value.includes(searchParams.value.destination)
        ) {
          store.get_connections()
        } else {
          router.push({
            ...to,
            hash: '#search'
          })
        }
      })
    }
  } else if (
    Object.keys(new_query_params).length === 0 &&
    Object.keys(old_query_params).length > 0
  ) {
    // preserve query
    return { ...to, query: old_query_params }
  }
})

export default router
