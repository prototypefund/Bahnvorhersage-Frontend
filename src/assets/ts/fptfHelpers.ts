import dayjs from 'dayjs'
import type { Duration } from 'dayjs/plugin/duration'
import { type Leg, type Journey } from './fptfTypes'

export function getDurationsOfLeg(leg: Leg) {
  return {
    duration: dayjs.duration(dayjs(leg.arrival).diff(leg.departure)),
    ...(leg.plannedArrival &&
      leg.plannedDeparture && {
        plannedDuration: dayjs.duration(dayjs(leg.plannedArrival).diff(leg.plannedDeparture))
      })
  }
}

export function getDurationsOfJourney(journey: Journey): {
  duration: Duration
  plannedDuration?: Duration
} {
  return {
    duration: dayjs.duration(dayjs(journey.legs.at(-1).arrival).diff(journey.legs[0].departure)),
    ...(journey.legs.at(-1).plannedArrival &&
      journey.legs[0].plannedDeparture && {
        plannedDuration: dayjs.duration(
          dayjs(journey.legs.at(-1).plannedArrival).diff(journey.legs[0].plannedDeparture)
        )
      })
  }
}

export function getJourneySummary(journey: Journey) {
  const durations = getDurationsOfJourney(journey)
  const categories = []
  let transfers = -1
  let connectionScore = 1

  for (const leg of journey.legs) {
    if (leg.walking) {
      categories.push('Fußweg')
    } else {
      categories.push(leg.line.productName)
      transfers++
    }
    if (leg.transferScore) {
      connectionScore *= leg.transferScore
    }
  }
  connectionScore = Math.trunc(connectionScore * 100)

  return {
    categories,
    transfers,
    connectionScore,
    ...durations
  }
}
