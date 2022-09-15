import { createStore } from "vuex";
import parse_datetimes from "../assets/js/parse_datetimes";
import flatpickr from "flatpickr";
import router from "../router";

/**
 * https://stackoverflow.com/a/59806829/7246401
 */
export class SearchParams {
  start = "";
  destination = "";
  date = flatpickr.formatDate(new Date(), "d.m.Y H:i");
  search_for_arrival = false;
  only_regional = false;
  bike = false;
}

export default createStore({
  state: {
    stations: [],
    connections: [],
    progressing: false,
    error: null as ErrorConstructor | null,
    search_params: new SearchParams(),
  },
  mutations: {
    set_stations(state, stations) {
      state.stations = stations;
    },
    set_connections(state, connections) {
      state.connections = connections;
    },
    set_error(state, error) {
      state.error = error;
      setTimeout(() => {
        state.error = null;
      }, 15000);
    },
    set_search_param(state, { key, value }) {
      state.search_params[key] = value;
    },
    set_search_params(state, search_params: SearchParams) {
      // Don't allow undefined values
      state.search_params = Object.entries(search_params).reduce(
        (result, [key, value]) => {
          result[key] = value;
          return result;
        },
        new SearchParams()
      );
    },
    start_progress(state) {
      state.progressing = true;
    },
    stop_progress(state) {
      state.progressing = false;
    },
  },
  actions: {
    display_fetch_error(context, response: Response) {
      if (!response.ok) {
        context.commit("stop_progress");
        let error;
        if (response.status === 429) {
          error = Error(
            "Du hast zu viele Anfragen an unseren Server gesendet. Bitte warte ein paar Minuten und versuche es erneut."
          );
        } else {
          error = Error(response.statusText);
        }
        context.commit("set_error", error);
        console.log(response.url);
        console.log(error);
      }
      return response;
    },
    display_img_load_error(context, event) {
      context.commit("stop_progress");
      const error = Error("Failed to load image");
      context.commit("set_error", error);
      console.log(event);
      console.log(error);
    },
    async fetch_stations(context) {
      if (!(context.state.stations.length > 0)) {
        let response = await fetch("/api/station_list.json");
        response = await context.dispatch("display_fetch_error", response);
        const stations = (await response.json()).stations;
        context.commit("set_stations", stations);
      }
    },
    async get_connections(context) {
      // remove current connections
      context.commit("set_connections", []);
      context.commit("start_progress");
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context.state.search_params),
      });
      let connections = await context
        .dispatch("display_fetch_error", response)
        .then((r) => r.json());
      if (connections) {
        connections = parse_datetimes(connections);

        router.replace({
          path: "/connections",
          hash: "#content",
        });

        context.commit("set_connections", connections);
      }

      context.commit("stop_progress");
    },
  },
  modules: {},
});
