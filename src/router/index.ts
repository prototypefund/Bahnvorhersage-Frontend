import { nextTick } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Start Seite",
    component: () =>
      import(
        /* webpackChunkName: "start" */ "../views/TravelDestinationsDisplay.vue"
      ),
  },
  {
    path: "/search",
    name: "Verbindungen",
    component: () =>
      import(
        /* webpackChunkName: "connection" */ "../views/ConnectionDisplay.vue"
      ),
  },
  {
    path: "/about",
    name: "Über TCP",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutPage.vue"),
  },
  {
    path: "/imprint",
    name: "Impressum",
    component: () =>
      import(/* webpackChunkName: "imprint" */ "../views/ImprintPage.vue"),
  },
  {
    path: "/privacy",
    name: "Datenschutz",
    component: () =>
      import(/* webpackChunkName: "privacy" */ "../views/PrivacyPage.vue"),
  },
  {
    path: "/stats",
    name: "Statistiken",
    component: () =>
      import(
        /* webpackChunkName: "stats" */ "../views/stats/StatsDescription.vue"
      ),
  },
  {
    path: "/stats/overview",
    name: "Übersichtsstatistik",
    component: () =>
      import(
        /* webpackChunkName: "overview_stats" */ "../views/stats/OverviewStats.vue"
      ),
  },
  {
    path: "/stats/stations",
    name: "Bahnhofs-Statistiken",
    component: () =>
      import(
        /* webpackChunkName: "station_stats" */ "../views/stats/StationStats.vue"
      ),
  },
  {
    path: "/opendata",
    name: "Open Data",
    component: () =>
      import(/* webpackChunkName: "opendata" */ "../views/OpenData.vue"),
  },
  {
    path: "/stationviewer",
    name: "Stationviewer",
    component: () =>
      import(
        /* webpackChunkName: "stationviewer" */ "../views/StationDataViewer.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  routes: routes,
  scrollBehavior(to): any {
    if (to.hash) {
      nextTick(() => {
        document
          ?.getElementById(to.hash.substring(1))
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      // Does not work but it's the official vue way
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
  },
});

type LocationQuery = import("vue-router").LocationQuery;
import { SearchParams } from "../store";

function extract_search_query(query: LocationQuery): LocationQuery {
  return Object.keys(new SearchParams()).reduce((result, key) => {
    if (query[key]) {
      result[key] = query[key];
    }
    return result;
  }, <LocationQuery>{});
}

router.beforeEach((to, from) => {
  const old_query_params = extract_search_query(from.query);
  const new_query_params = extract_search_query(to.query);
  if (
    Object.keys(new_query_params).length === 0 &&
    Object.keys(old_query_params).length > 0
  ) {
    return { ...to, query: old_query_params };
  }
});

export default router;
