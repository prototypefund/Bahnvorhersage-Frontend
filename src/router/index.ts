import { nextTick } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(
        /* webpackChunkName: "home" */ "../views/TravelDestinationsDisplay.vue"
      ),
  },
  {
    path: "/connections",
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
    path: "/opensource",
    name: "Open Source",
    component: () =>
      import(/* webpackChunkName: "opensource" */ "../views/OpenSource.vue"),
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
  {
    // Redicrect to external url defined in a parameter called "url"
    path: "/redirect",
    name: "Redirect",
    component: () =>
      import(
        /* webpackChunkName: "home" */ "../views/TravelDestinationsDisplay.vue"
      ),
    beforeEnter: (to) => {
      location.href = to.query.url as string;
    },
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
import { SearchParams } from "@/store";
import store from "@/store";

function extract_search_params(query: LocationQuery): LocationQuery {
  return Object.keys(new SearchParams()).reduce((result, key) => {
    if (query[key]) {
      result[key] = query[key];
    }
    return result;
  }, <LocationQuery>{});
}

function search_params_from_location_query(query: LocationQuery): SearchParams {
  return Object.entries(new SearchParams()).reduce((result, [key, value]) => {
    if (query[key]) {
      if (typeof value == "boolean") {
        // Booleans need to be parsed separately
        result[key] = query[key] === "true";
      } else {
        result[key] = value.constructor(query[key]);
      }
    }
    return result;
  }, new SearchParams());
}

router.beforeEach(async (to, from) => {
  const old_query_params = extract_search_params(from.query);
  const new_query_params = extract_search_params(to.query);
  const new_query_params_parsed =
    search_params_from_location_query(new_query_params);
  if (
    Object.keys(new_query_params).length > 0 &&
    JSON.stringify(new_query_params) !== JSON.stringify(old_query_params) &&
    JSON.stringify(new_query_params_parsed) !==
      JSON.stringify(store.state.search_params)
  ) {
    // newer params in the query
    store.commit("set_search_params", new_query_params_parsed);
    if (to.path === "/connections") {
      // do an await here in order to make it possible to return a different hash
      store.dispatch("fetch_stations").then(() => {
        if (
          store.state.stations.includes(store.state.search_params.start) &&
          store.state.stations.includes(store.state.search_params.destination)
        ) {
          store.dispatch("get_connections");
        } else {
          router.push({
            ...to,
            hash: "#search",
          });
        }
      });
    }
  } else if (
    Object.keys(new_query_params).length === 0 &&
    Object.keys(old_query_params).length > 0
  ) {
    // preserve query
    return { ...to, query: old_query_params };
  }
});

export default router;
