<script setup lang="ts">
import { onMounted } from 'vue'
import { default as dayjs } from 'dayjs'
import * as d3 from 'd3'
import { type Journey, type JourneyAndAlternative, type Leg } from '../assets/ts/fptfTypes'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  journeys: JourneyAndAlternative[]
}>()

let height = 600
let width = 800
const trainWidth = 40
const gap = 20
const alternativeGap = 5
const alternativeTrainWidth = 5
const marginLeft = 15
const marginY = 25
const transitionDuration = 200

const maxCharsSingleLine = 5

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
  if (journey.legs[0].origin.id === alternative.legs[0].origin.id) {
    return new Date(journey.legs[0].departure)
  }
  for (let leg of journey.legs) {
    if (leg.destination.id === alternative.legs[0].origin.id) {
      return new Date(leg.arrival)
    }
    for (let stopover of leg.stopovers) {
      if (stopover.stop.id === alternative.legs[0].origin.id) {
        return new Date(stopover.arrival)
      }
    }
  }
  console.log(
    'Error: Did not find initial departure for alternative: ',
    alternative,
    'and journey: ',
    journey
  )
  return new Date(alternative.legs[0].departure)
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

const [minDates, maxDates] = getAllMinsAndMaxes(props.journeys)
let journeyXCords: number[] = []

const timeScale = d3
  .scaleTime()
  .domain([min(minDates), max(maxDates)])
  .range([marginY, height - marginY])

const zoom = d3.zoom()

const redraw = () => {
  for (let i = 0; i < props.journeys.length; i++) {
    updateJourney(i, props.journeys[i].journey, props.journeys[i].alternatives)
  }
  gY.transition().duration(transitionDuration).call(yAxis, timeScale)
}

var oldMinIndex = 0
var oldMaxIndex = 0

function zoomed({
  transform,
  noXMovement = false
}: {
  transform: d3.ZoomTransform
  noXMovement: Boolean
}) {
  const tx = transform.x

  const currentXtend: [number, number] = [marginLeft - tx, width - tx]
  const [currentMinIndex, currentMaxIndex] = getDisplayedJourneyIndices(currentXtend)
  if (currentMinIndex !== oldMinIndex || currentMaxIndex !== oldMaxIndex) {
    oldMinIndex = currentMinIndex
    oldMaxIndex = currentMaxIndex

    const currentMinDate = min(minDates.slice(currentMinIndex, currentMaxIndex + 1))
    const currentMaxDate = max(maxDates.slice(currentMinIndex, currentMaxIndex + 1))

    timeScale.domain([currentMinDate, currentMaxDate])
    redraw()
  }

  if (noXMovement === false) {
    gJourneys.attr('transform', `translate(${tx},0)`)
  }
}

function closestJourneyX(x: number) {
  let leftLimit = marginLeft - x
  let closestJourneyX = journeyXCords[0]
  let closestJourneyDistance = Math.abs(journeyXCords[0] - leftLimit)
  for (let i = 1; i < journeyXCords.length; i++) {
    const distance = Math.abs(journeyXCords[i] - leftLimit)
    if (distance < closestJourneyDistance) {
      closestJourneyX = journeyXCords[i]
      closestJourneyDistance = distance
    }
  }
  const tx = marginLeft + gap - closestJourneyX
  return tx
}

function snapToNearestJourney({ transform }: { transform: d3.ZoomTransform }) {
  const tx = closestJourneyX(transform.x) 
  gJourneys.transition().duration(transitionDuration).attr('transform', `translate(${tx},0)`)
  const t = d3.zoomIdentity.translate(tx, 0)
  zoomed({ transform: t, noXMovement: true })
}

function move(by: number) {
  let transform = d3.zoomTransform(svg.node())
  const xOrigin = transform.x
  transform = transform.translate(by, 0)
  const tx = closestJourneyX(transform.x)
  svg.transition().duration(transitionDuration).call(
    zoom.translateBy,
    tx - xOrigin, 0,
  ).on('end', null)

}

function next() {
  move(-trainWidth * 4)
}

function prev() {
  move(trainWidth * 4)
}

function drawLegText(g, leg: Leg, x: number, width: number) {
  if (leg.mode === 'walking') {
    g.append('text')
      .attr('class', 'walk')
      .attr('x', x + width / 2)
      .attr('y', (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 4)
      .text('\uf10a')
  } else if (leg.line.name.length <= maxCharsSingleLine) {
    g.append('text')
      .attr('class', 'name-number')
      .attr('x', x + width / 2)
      .attr('y', (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 4)
      .text(leg.line.name)
  } else {
    g.append('text')
      .attr('class', 'name')
      .attr('x', x + width / 2)
      .attr('y', (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2)
      .text(leg.line.name.substring(0, leg.line.name.indexOf(' ')))
    g.append('text')
      .attr('class', 'number')
      .attr('x', x + width / 2)
      .attr('y', (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 12)
      .text(leg.line.name.substring(leg.line.name.indexOf(' ') + 1))
  }
}

function updateLegText(g, leg: Leg) {
  if (leg.mode === 'walking') {
    g.select('.walk').attr(
      'y',
      (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 4
    )
  } else if (leg.line.name.length <= maxCharsSingleLine) {
    g.select('.name-number').attr(
      'y',
      (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 4
    )
  } else {
    g.select('.name').attr(
      'y',
      (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2
    )
    g.select('.number').attr(
      'y',
      (timeScale(new Date(leg.arrival)) + timeScale(new Date(leg.departure))) / 2 + 12
    )
  }
}

const drawLegs = (g, legs: Leg[], x: number, width: number, isAlternative: boolean) => {
  g.selectAll('rect')
    .data(legs)
    .join('rect')
    .classed('leg', true)
    .classed('regio', (leg: Leg) => leg.line.isRegio)
    .classed('walk', (leg: Leg) => leg.mode === 'walking')
    .attr('x', x)
    .attr('y', (leg: Leg) => timeScale(new Date(leg.departure)))
    .attr('width', width)
    .attr(
      'height',
      (leg: Leg) => timeScale(new Date(leg.arrival)) - timeScale(new Date(leg.departure))
    )
  if (!isAlternative) {
    g.selectAll('g.train-name')
      .data(legs)
      .join('g')
      .attr('class', 'train-name')
      .each((leg: Leg, index: number, nodes) => {
        drawLegText(d3.select(nodes[index]), leg, x, width)
      })
    for (let leg of legs) {
      g.append('g')
        .attr('class', 'train-name')
        .call((g) => drawLegText(g, leg, x, width))
    }
  }
}

const drawDpArTs = (g, legs: Leg[], x: number) => {
  g.append('text')
    .attr('class', 'dp-ts')
    .attr('x', x + trainWidth / 2)
    .attr('y', timeScale(new Date(legs[0].departure)))
    .text(dayjs(legs[0].departure).format('HH:mm'))

  g.append('text')
    .attr('class', 'ar-ts')
    .attr('x', x + trainWidth / 2)
    .attr('y', timeScale(new Date(legs.at(-1).arrival)))
    .text(dayjs(legs.at(-1).arrival).format('HH:mm'))
}

const updateLegs = (g, legs: Leg[], isAlternative: boolean) => {
  g.selectAll('rect')
    .data(legs)
    .join('rect')
    .transition()
    .duration(transitionDuration)
    .attr('y', (leg: Leg) => timeScale(new Date(leg.departure)))
    .attr(
      'height',
      (leg: Leg) => timeScale(new Date(leg.arrival)) - timeScale(new Date(leg.departure))
    )

  if (!isAlternative) {
    g.selectAll('g.train-name')
      .data(legs)
      .join('g')
      .each((leg: Leg, index: number, nodes) => {
        updateLegText(d3.select(nodes[index]).transition().duration(transitionDuration), leg)
      })
  }
}

const updateDpArTs = (g, legs: Leg[]) => {
  g.select('.dp-ts')
    .transition()
    .duration(transitionDuration)
    .attr('y', timeScale(new Date(legs[0].departure)))

  g.select('.ar-ts')
    .transition()
    .duration(transitionDuration)
    .attr('y', timeScale(new Date(legs.at(-1).arrival)))
}

function showJourneyDetails(index: number) {
  router.push({ name: 'Verbindungs-Details', params: { index: index.toString() } })
}

function drawJourney(x: number, id: number, journey: Journey, alternatives: Journey[]): number {
  const journeyX = x

  const gJourney = gJourneys
    .append('a')
    .attr('id', `journey-${id}`)
    .on('click', () => showJourneyDetails(id))
  const mainJourney = gJourney.append('g').attr('class', 'main-journey')
  const alternativeJourneys = gJourney.append('g').attr('class', 'alternative-journeys')

  mainJourney.call((g) => drawLegs(g, journey.legs, x, trainWidth, false))
  mainJourney.call((g) => drawDpArTs(g, journey.legs, x))

  x += trainWidth + alternativeGap

  for (let i = 0; i < alternatives.length; i++) {
    const alternative = alternativeJourneys.append('g').attr('id', `alternative-lines-${i}`)
    const initialDepartureLine = alternative.append('line').attr('class', 'initial-departure-line')
    const journeyLine = alternative.append('line').attr('class', 'journey-line')

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

  x = journeyX + trainWidth + alternativeGap
  for (let i = 0; i < alternatives.length; i++) {
    const alternative = alternativeJourneys.append('g').attr('id', `alternative-${i}`)
    alternative.call((g) => drawLegs(g, alternatives[i].legs, x, alternativeTrainWidth, true))
    x += alternativeTrainWidth + alternativeGap
  }

  return x + gap - alternativeGap
}

function updateJourney(id: number, journey: Journey, alternatives: Journey[]) {
  const gJourney = gJourneys.select(`#journey-${id}`)
  const mainJourney = gJourney.select('.main-journey')
  const alternativeJourneys = gJourney.select('.alternative-journeys')

  mainJourney.call((g) => updateLegs(g, journey.legs, false))
  mainJourney.call((g) => updateDpArTs(g, journey.legs))

  for (let i = 0; i < alternatives.length; i++) {
    const alternative = alternativeJourneys.select(`#alternative-${i}`)
    const alternativeLines = alternativeJourneys.select(`#alternative-lines-${i}`)
    const initialDepartureLine = alternativeLines.select('.initial-departure-line')
    const journeyLine = alternativeLines.select('.journey-line')

    alternative.call((g) => updateLegs(g, alternatives[i].legs, true))

    initialDepartureLine
      .transition()
      .duration(transitionDuration)
      .attr('stroke', 'white')
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('y2', timeScale(getInitialDeparture(journey, alternatives[i])))

    journeyLine
      .transition()
      .duration(transitionDuration)
      .attr('stroke', 'white')
      .attr('y1', timeScale(getInitialDeparture(journey, alternatives[i])))
      .attr('y2', timeScale(new Date(alternatives[i].legs.at(-1).arrival)))
  }
}

const yAxis = (g, y) => {
  g.call(d3.axisLeft(y).tickSize(width).tickFormat(d3.timeFormat('%H:%M'))).call((g) =>
    g.attr('transform', `translate(${width},0)`)
  )
}

function onResize() {
  width = document.getElementById('journey-display-container')?.offsetWidth || width
  height = document.getElementById('journey-display-container')?.offsetHeight || height

  timeScale.range([marginY, height - marginY])

  svg.attr('height', height).attr('width', width)

  redraw()
}

onMounted(() => {
  let x = gap + marginLeft
  journeyXCords.push(x)
  for (let i = 0; i < props.journeys.length - 1; i++) {
    x = drawJourney(x, i, props.journeys[i].journey, props.journeys[i].alternatives)
    journeyXCords.push(x)
  }

  const currentXtend: [number, number] = [marginLeft, width]
  const [currentMinIndex, currentMaxIndex] = getDisplayedJourneyIndices(currentXtend)
  const currentMinDate = min(minDates.slice(currentMinIndex, currentMaxIndex + 1))
  const currentMaxDate = max(maxDates.slice(currentMinIndex, currentMaxIndex + 1))
  timeScale.domain([currentMinDate, currentMaxDate])
  redraw()

  d3.select('#journey-display-container').append(() => svg.node())
  gY.call(yAxis, timeScale)
  zoom
    .scaleExtent([1, 1])
    .translateExtent([
      [0, 0],
      [journeyXCords.at(-1) - marginLeft + trainWidth * 3, 0]
    ])
    .on('zoom', zoomed)
    .on('end', snapToNearestJourney)
  svg.call(zoom)

  onResize()
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      next()
    } else if (e.key === 'ArrowLeft') {
      prev()
    }
  })
})
</script>

<template>
  <div id="journey-display-container-container" class="p-2 shadow rounded">
    <div id="journey-display-container"></div>
  </div>
  <button class="carousel-control-prev journey-control-prev" type="button" @click="prev">
    <span class="carousel-control-prev-icon btn" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next journey-control-next" type="button" @click="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</template>

<style lang="scss">
svg {
  .main-journey {
    .leg {
      fill: $text_color;
    }

    .regio {
      fill: $page_gray_text;
    }

    .walk {
      fill: $page_even_lighter_gray;
    }
  }

  .alternative-journeys {
    .leg {
      fill: darken($text_color, 20%);
    }

    .regio {
      fill: darken($page_gray_text, 20%);
    }

    line {
      stroke: $page_gray_text;
      shape-rendering: crispEdges;
    }
  }

  .train-name {
    text-anchor: middle;

    text {
      font-family: $font-family-monospace;
      font-weight: bold;
      font-size: 12px;
      stroke: $text_color;
      paint-order: stroke;
      stroke-width: 3px;
    }

    .walk {
      font-family: icons !important;
      font-weight: normal !important;
    }
  }

  .tick {
    line {
      stroke-dasharray: 1, 3;
      color: $page_gray_text;
    }

    text {
      transform: translate(32px, -6px);
      font-family: $font-family-monospace;
    }
  }

  .domain {
    stroke: none;
  }

  #journey-display-content {
    @mixin time-text {
      font-size: 12px;
      font-family: $font-family-monospace;
      fill: $text_color;
      text-anchor: middle;
      font-weight: bold;
      stroke: black;
      paint-order: stroke;
      stroke-width: 5px;
    }

    .dp-ts {
      @include time-text;
      transform: translateY(-5px);
    }

    .ar-ts {
      @include time-text;
      transform: translateY(3px + 12px);
    }
  }

  a {
    cursor: pointer;
  }

  a:hover {
    filter: brightness(1.2);
  }
}

#journey-display-container-container {
  background-color: black;
  height: calc(100vh - $nav-height - 20px);
  max-width: 100vw;
  width: 100%;
}

#journey-display-container {
  height: 100%;
  width: 100%;
}

.journey-control-prev, .journey-control-next {
    display: none;
  }

@include media-breakpoint-up(md) { 
  .journey-control-prev, .journey-control-next {
    width: 100px;
    display: block;
  }
 }


</style>
