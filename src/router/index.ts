import { nextTick } from "vue";
import ConnectionDisplay from "../views/ConnectionDisplay.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Verbindungen",
    component: ConnectionDisplay,
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

export default router;
