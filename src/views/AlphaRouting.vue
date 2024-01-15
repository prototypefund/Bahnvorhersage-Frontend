<template>
  <h1 class="text-center">Alpha Routing</h1>

  <div class="content-container">
    <svg id="journey-display"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import { type Journey, type JourneyAndAlternative, type JourneyLeg } from '../assets/js/fptfTypes'

import _dummyJourney from './dummy_routing.json'

const dummyJourneys: JourneyAndAlternative[] = _dummyJourney

const height = 600
const width = 8000
const trainWidth = 40
const gap = 10
const alternativeTrainWidth = 8
const marginLeft = 50

function findMinAndMaxDate(journeys: JourneyAndAlternative[]): [Date, Date] {
  let minDate = new Date('9999-12-31T23:59:59+00:00')
  let maxDate = new Date('0000-01-01T00:00:00+00:00')

  for (let journey of journeys) {
    for (let leg of journey.journey.legs) {
      if (new Date(leg.departure) < minDate) {
        minDate = new Date(leg.departure)
      }
      if (new Date(leg.arrival) > maxDate) {
        maxDate = new Date(leg.arrival)
      }
    }
    for (let alternative of journey.alternatives) {
      for (let leg of alternative.legs) {
        if (new Date(leg.departure) < minDate) {
          minDate = new Date(leg.departure)
        }
        if (new Date(leg.arrival) > maxDate) {
          maxDate = new Date(leg.arrival)
        }
      }
    }
  }

  return [minDate, maxDate]
}

const [minDate, maxDate] = findMinAndMaxDate(dummyJourneys)

const timeScale = d3
  .scaleTime()
  .domain([
    minDate,
    maxDate,
  ])
  .range([0, height])

function getInitialDeparture(journey: Journey, alternative: Journey): Date {
  if (journey.legs[0].origin === alternative.legs[0].origin) {
    return new Date(journey.legs[0].departure)
  }
  for (let leg of journey.legs) {
    if (leg.destination === alternative.legs[0].origin) {
      return new Date(leg.arrival)
    }
    for (let stopover of leg.stopovers) {
      if (stopover.stop === alternative.legs[0].origin) {
        return new Date(stopover.arrival)
      }
    }
  }
}

function drawJourney(x: number, journey: Journey, alternatives: Journey[]): number {
  const journeyX = x

  d3.select('#journey-display')
    .append('g')
    .selectAll()
    .data(journey.legs)
    .join('rect')
    .attr('x', x)
    .attr('y', (d) => timeScale(new Date(d.departure)))
    .attr('width', trainWidth)
    .attr('height', (d) => timeScale(new Date(d.arrival)) - timeScale(new Date(d.departure)))
    .classed('leg', true)
    .classed('regio', (d) => d.isRegio)

  x += trainWidth + gap

  for (let i = 0; i < alternatives.length; i++) {
    d3.select('#journey-display')
      .append('g')
      .call((g) => {
        g.append('line')
          .attr('stroke', 'white')
          .attr('x1', journeyX + trainWidth)
          .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
          .attr('x2', x + alternativeTrainWidth / 2)
          .attr('y2', timeScale(getInitialDeparture(journey, alternatives[i])))
        g.append('line')
          .attr('stroke', 'white')
          .attr('x1', x + alternativeTrainWidth / 2)
          .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
          .attr('x2', x + alternativeTrainWidth / 2)
          .attr('y2', timeScale(new Date(alternatives[i].legs.at(-1).arrival)))
      })
      .call((g) => {
        g.selectAll()
          .data(alternatives[i].legs)
          .join('rect')
          .attr('x', x)
          .attr('y', (d) => timeScale(new Date(d.departure)))
          .attr('width', alternativeTrainWidth)
          .attr('height', (d) => timeScale(new Date(d.arrival)) - timeScale(new Date(d.departure)))
          .classed('leg', true)
          .classed('alternative', true)
          .classed('regio', (d) => d.isRegio)
      })

    x += alternativeTrainWidth + gap
  }

  return x
}

onMounted(() => {
  d3.select('#journey-display').attr('width', width).attr('height', height)

  d3.select('#journey-display')
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(timeScale))

  let x = gap + marginLeft

  for (let dummyJourney of dummyJourneys) {
    x = drawJourney(x, dummyJourney.journey, dummyJourney.alternatives)
  }
})
</script>


<style lang="scss">

svg {
  .leg {
    fill: white;
  }

  .alternative {
    fill: #999;
  }

  .regio {
    fill: #f00;
  }
}

</style>