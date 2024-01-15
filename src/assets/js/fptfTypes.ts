export type Stopover = {
    type: 'stopover',
    stop: string,
    arrival: string,
    departure: string,
    distTraveled: number,
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
    isRegio: boolean,
}

export type Journey = {
    type: 'journey',
    legs: JourneyLeg[],
}

export type JourneyAndAlternative = {
    journey: Journey,
    alternatives: Journey[],
}