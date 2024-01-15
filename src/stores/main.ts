import { defineStore } from "pinia";
import parseDatetimes from "../assets/js/parseDatetimes";
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

export const useMainStore = defineStore('main', {
  state: () => ({
    stations: [],
    connections: [],
    progressing: false,
    error: null as Error | null,
    search_params: new SearchParams(),
  }),
  actions: {
    display_fetch_error (response: Response) {
      if (!response.ok) {
        this.progressing = false;
        let error;
        if (response.status === 429) {
          error = Error(
            "Du hast zu viele Anfragen an unseren Server gesendet. Bitte warte ein paar Minuten und versuche es erneut."
          );
        } else {
          error = Error(response.statusText);
        }
        this.error = error;
        console.log(response.url);
        console.log(error);
      }
      return response;
    },
    display_img_load_error(event: Event) {
      this.progressing = false;
      const error = Error("Failed to load image");
      this.error = error;
      console.log(event);
      console.log(error);
    },
    async fetch_stations() {
      if (!(this.stations.length > 0)) {
        let response = await fetch("/api/station_list.json");
        response = await this.display_fetch_error(response);
        this.stations = (await response.json()).stations;
      }
    },
    async get_connections() {
      // remove current connections
      this.connections = [];
      this.progressing = true;
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.search_params),
      });
      let connections = await this.display_fetch_error(response).json();
      if (connections) {
        connections = parseDatetimes(connections);

        router.replace({
          path: "/connections",
          hash: "#content",
        });

        this.connections = connections;
      }
      this.progressing = false;
    },
  }
});