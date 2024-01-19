<template>
  <h1 class="text-center">Alpha Routing</h1>

  <div class="content-container">
    <div id="debug-field"></div>
    <div id="journey-display-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import { type Journey, type JourneyAndAlternative, type JourneyLeg } from '../assets/js/fptfTypes'

import _dummyJourney from './dummy_routing.json'

const dummyJourneys: JourneyAndAlternative[] = _dummyJourney

const height = 600
const width = 800
const trainWidth = 40
const gap = 20
const alternativeGap = 5
const alternativeTrainWidth = 5
const marginLeft = 50
const scaleXWidth = 42
const journeyDisplayWidth = width - marginLeft
const transitionDuration = 200

const svg = d3.create('svg').attr('height', height).attr('width', width)
const gY = svg.append('g')
const gJourneys = svg.append('g').attr('id', 'journey-display-content')

function min(arr: any[]): any {
  let min = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}

function max(arr: any[]): any {
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

function findMinAndMaxDate(journey: JourneyAndAlternative): [Date, Date] {
  let minDate = new Date('9999-12-31T23:59:59+00:00')
  let maxDate = new Date('0000-01-01T00:00:00+00:00')

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

  return [minDate, maxDate]
}

function getAllMinsAndMaxes(journeys: JourneyAndAlternative[]): [Date[], Date[]] {
  let minDates: Date[] = []
  let maxDates: Date[] = []

  for (let journey of journeys) {
    const [minDate, maxDate] = findMinAndMaxDate(journey)
    minDates.push(minDate)
    maxDates.push(maxDate)
  }

  return [minDates, maxDates]
}

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

function getDisplayedJourneyIndices(extend: [number, number]) {
  let minIndex = 0
  let maxIndex = journeyXCords.length - 2

  for (let i = 0; i < journeyXCords.length; i++) {
    if (journeyXCords[i] <= extend[0]) {
      minIndex = i
    }
    if (journeyXCords[i] >= extend[1]) {
      maxIndex = i - 1
      break
    }
  }

  return [minIndex, maxIndex]
}

const [minDates, maxDates] = getAllMinsAndMaxes(dummyJourneys)
let journeyXCords: number[] = []

const timeScale = d3
  .scaleTime()
  .domain([min(minDates), max(maxDates)])
  .range([0, height])

const zoom = d3.zoom().scaleExtent([1, 1]).on('zoom', zoomed).on('end', snapToNearestJourney)

const boundX = (x: number) => {
  return Math.min(0, Math.max(journeyDisplayWidth - journeyXCords.at(-1), x))
}

function zoomed({
  transform,
  noXMovement = false
}: {
  transform: d3.ZoomTransform
  noXMovement: Boolean
}) {
  d3.select('#debug-field').text(
    `x: ${transform.x}, k: ${transform.k},` // extend: [${currentXtend}], indices: [${currentMinIndex}, ${currentMaxIndex}]`
  )

  const tx = boundX(transform.x)
  if (tx !== transform.x) {
    const t = d3.zoomIdentity.translate(tx, 0)
    svg.call(zoom.transform, t)
    return
  }

  const currentXtend: [number, number] = [marginLeft - tx, width - tx]
  const [currentMinIndex, currentMaxIndex] = getDisplayedJourneyIndices(currentXtend)

  const currentMinDate = min(minDates.slice(currentMinIndex, currentMaxIndex + 1))
  const currentMaxDate = max(maxDates.slice(currentMinIndex, currentMaxIndex + 1))

  timeScale.domain([currentMinDate, currentMaxDate])
  if (noXMovement === false) {
    gJourneys.attr('transform', `translate(${tx},0)`)
  }

  let x = gap + marginLeft
  for (let i = 0; i < dummyJourneys.length - 1; i++) {
    x = updateJourney(x, i, dummyJourneys[i].journey, dummyJourneys[i].alternatives)
  }

  gY.transition().duration(transitionDuration).call(yAxis, timeScale)
  // gY.select('.domain').remove()
  // svg
  //   .selectAll('line.horizontal-grid')
  //   .data(timeScale.ticks())
  //   .join('line')
  //   .transition()
  //   .duration(transitionDuration)
  //   .attr('class', 'horizontal-grid')
  //   .attr('x1', marginLeft)
  //   .attr('x2', width)
  //   .attr('y1', (d) => timeScale(d))
  //   .attr('y2', (d) => timeScale(d))
  // .attr('fill', 'none')
  // .attr('shape-rendering', 'crispEdges')
  // .attr('stroke', 'white')
  // .attr('stroke-width', '1px')
}

function snapToNearestJourney({ transform }: { transform: d3.ZoomTransform }) {
  const leftLimit = marginLeft - transform.x
  let closestJourneyX = journeyXCords[0]
  let closestJourneyDistance = Math.abs(journeyXCords[0] - leftLimit)
  for (let i = 1; i < journeyXCords.length; i++) {
    const distance = Math.abs(journeyXCords[i] - leftLimit)
    if (distance < closestJourneyDistance) {
      closestJourneyX = journeyXCords[i]
      closestJourneyDistance = distance
    }
  }
  const tx = boundX(marginLeft + gap - closestJourneyX)
  gJourneys.transition().duration(transitionDuration).attr('transform', `translate(${tx},0)`)
  const t = d3.zoomIdentity.translate(tx, 0)
  zoomed({ transform: t, noXMovement: true })
}

const drawLegs = (g, legs: JourneyLeg[], x: number, width: number) => {
  g.selectAll('rect')
    .data(legs)
    .join('rect')
    .classed('leg', true)
    .classed('regio', (leg: JourneyLeg) => leg.isRegio)
    .transition()
    .duration(transitionDuration)
    .attr('x', x)
    .attr('y', (leg: JourneyLeg) => timeScale(new Date(leg.departure)))
    .attr('width', width)
    .attr(
      'height',
      (leg: JourneyLeg) => timeScale(new Date(leg.arrival)) - timeScale(new Date(leg.departure))
    )
}

function drawJourney(x: number, id: number, journey: Journey, alternatives: Journey[]): number {
  const journeyX = x

  const gJourney = gJourneys.append('g').attr('id', `journey-${id}`)
  const mainJourney = gJourney.append('g').attr('class', 'main-journey')
  const alternativeJourneys = gJourney.append('g').attr('class', 'alternative-journeys')

  mainJourney.call((g) => drawLegs(g, journey.legs, x, trainWidth))

  x += trainWidth + alternativeGap

  for (let i = 0; i < alternatives.length; i++) {
    const alternative = alternativeJourneys.append('g').attr('id', `alternative-${i}`)
    const initialDepartureLine = alternative.append('line').attr('class', 'initial-departure-line')
    const journeyLine = alternative.append('line').attr('class', 'journey-line')

    alternative.call((g) => drawLegs(g, alternatives[i].legs, x, alternativeTrainWidth))
    initialDepartureLine
      .attr('stroke', 'white')
      .attr('x1', journeyX + trainWidth)
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('x2', x + alternativeTrainWidth / 2)
      .attr('y2', timeScale(getInitialDeparture(journey, alternatives[i])))

    journeyLine
      .attr('stroke', 'white')
      .attr('x1', x + alternativeTrainWidth / 2)
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('x2', x + alternativeTrainWidth / 2)
      .attr('y2', timeScale(new Date(alternatives[i].legs.at(-1).arrival)))

    x += alternativeTrainWidth + alternativeGap
  }

  return x + gap - alternativeGap
}

function updateJourney(x: number, id: number, journey: Journey, alternatives: Journey[]): number {
  const journeyX = x

  const gJourney = gJourneys.select(`#journey-${id}`)
  const mainJourney = gJourney.select('.main-journey')
  const alternativeJourneys = gJourney.select('.alternative-journeys')

  mainJourney.call((g) => drawLegs(g, journey.legs, x, trainWidth))

  x += trainWidth + alternativeGap

  for (let i = 0; i < alternatives.length; i++) {
    const alternative = alternativeJourneys.select(`#alternative-${i}`)
    const initialDepartureLine = alternative.select('.initial-departure-line')
    const journeyLine = alternative.select('.journey-line')

    alternative.call((g) => drawLegs(g, alternatives[i].legs, x, alternativeTrainWidth))

    initialDepartureLine
      .transition()
      .duration(transitionDuration)
      .attr('stroke', 'white')
      .attr('x1', journeyX + trainWidth)
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('x2', x + alternativeTrainWidth / 2)
      .attr('y2', timeScale(getInitialDeparture(journey, alternatives[i])))

    journeyLine
      .transition()
      .duration(transitionDuration)
      .attr('stroke', 'white')
      .attr('x1', x + alternativeTrainWidth / 2)
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('x2', x + alternativeTrainWidth / 2)
      .attr('y2', timeScale(new Date(alternatives[i].legs.at(-1).arrival)))

    x += alternativeTrainWidth + alternativeGap
  }

  return x + gap - alternativeGap
}

const yAxis = (g, y) => {
  g.call(d3.axisLeft(y).tickSize(journeyDisplayWidth)).call((g) =>
    g.attr('transform', `translate(${width},0)`)
  )
}

onMounted(() => {
  let x = gap + marginLeft
  journeyXCords.push(x)

  for (let i = 0; i < dummyJourneys.length - 1; i++) {
    x = drawJourney(x, i, dummyJourneys[i].journey, dummyJourneys[i].alternatives)
    journeyXCords.push(x)
  }

  d3.select('#journey-display-container').append(() => svg.node())
  gY.call(yAxis, timeScale)
  svg.call(zoom)
})
</script>

<style lang="scss">
svg {
  .leg {
    fill: $text_color;
  }

  .alternative {
    fill: #999;
  }

  .regio {
    fill: $page_gray_text;
  }

  .horizontal-grid {
    stroke: $page_gray_text;
  }

  .tick line {
    stroke-dasharray: 2,2;
  }

  #journey-display-content {
    line {
      color: $text_color;
    }
  }
}
</style>
