export type Stopover = {
    type: 'stopover',
    stop: string,
    arrival: string,
    departure: string,
    distTraveled: number,
}

export type Line = {
    type: 'line',
    id: string,
    name: string,
    operator: string,
    isRegio: boolean,
}

export type JourneyLeg = {
    origin: string,
    destination: string,
    departure: string,
    arrival: string,
    stopovers: Stopover[],
    mode: string,
    public: boolean,
    distTraveled: number,
    line: Line,
}

export type Journey = {
    type: 'journey',
    legs: JourneyLeg[],
}

export type JourneyAndAlternative = {
    journey: Journey,
    alternatives: Journey[],
}