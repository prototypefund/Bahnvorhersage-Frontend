import { defineStore } from 'pinia'
import flatpickr from 'flatpickr'
import router from '../router'
import { type JourneyAndAlternative } from '../assets/ts/fptfTypes'

/**
 * https://stackoverflow.com/a/59806829/7246401
 */
export class SearchParams {
  start = ''
  destination = ''
  date = flatpickr.formatDate(new Date(), 'd.m.Y H:i')
  search_for_arrival = false
  only_regional = false
  bike = false
}

export class AlphaSearchParams {
  origin = ''
  destination = ''
  departure = new Date().setSeconds(0, 0) // when seconds are set, flatpickr mobile will fail on some validation
}

export const useMainStore = defineStore('main', {
  state: () => ({
    stations: [] as string[],
    connections: [],
    progressing: false,
    error: null as Error | null,
    searchParams: new SearchParams(),
    alphaSearchParams: new AlphaSearchParams(),
    journeysAndAlternatives: [] as JourneyAndAlternative[]
  }),
  actions: {
    setError(error: Error) {
      this.error = error
      console.log(error)
      setTimeout(() => {
        this.error = null
      }, 15000)
    },
    async display_fetch_error(response: Response) {
      if (!response.ok) {
        let error
        if (response.status === 429) {
          error = Error(
            'Du hast zu viele Anfragen an unseren Server gesendet. Bitte warte ein paar Minuten und versuche es erneut.'
          )
        } else {
          try {
            error = Error((await response.json()).error || response.statusText)
          } catch (e) {
            error = Error(response.statusText)
          }
        }
        this.setError(error)
        this.progressing = false
      }
      return response
    },
    display_img_load_error(event: Event) {
      this.progressing = false
      const error = Error('Failed to load image')
      this.setError(error)
    },
    async fetchStations() {
      if (!(this.stations.length > 0)) {
        let response = await fetch('/api/station_list.json')
        response = await this.display_fetch_error(response)
        this.stations = (await response.json()).stations
      }
    },
    async getJourneys() {
      this.progressing = true
      const response = await fetch('/api/journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.alphaSearchParams)
      })
      this.journeysAndAlternatives = await (await this.display_fetch_error(response)).json()
      this.progressing = false
    },
    get_connections() {
      // remove current connections
      this.connections = []
      this.progressing = true
      fetch('/api/trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.searchParams)
      })
        .then((response) => this.display_fetch_error(response))
        .then((response) => response.json())
        .then((connections) => {
          if (connections) {
            router.replace({
              path: '/connections',
              hash: '#content'
            })

            this.connections = connections
          }
          this.progressing = false
        })
    }
  }
})
