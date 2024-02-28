export type TransferDuration = {
    duration: string,
    distance?: number
}

export type TransferInfo = {
    identicalPhysicalPlatform: boolean,
    frequentTraveller: TransferDuration,
    mobilityImpaired: TransferDuration,
    occasionalTraveller: TransferDuration,
    source: 'RIL420' | 'INDOOR_ROUTING' | 'EFZ' | 'FALLBACK',
};

export type Stop = {
    type: 'stop',
    id: string,
    name: string,
}


export type Stopover = {
    type: 'stopover',
    stop: Stop,
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
    productName: string,
}

export type Leg = {
    origin: Stop,
    destination: Stop,
    departure: string,
    departurePrediction?: number,
    plannedDeparture?: string,
    departurePlatform?: string,
    plannedDeparturePlatform?: string,
    arrival: string,
    arrivalPrediction?: number,
    plannedArrival?: string,
    arrivalPlatform?: string,
    plannedArrivalPlatform?: string,
    stopovers: Stopover[],
    mode: string,
    public: boolean,
    distTraveled: number,
    line: Line,
    transferScore?: number,
    neededTransferTime?: TransferInfo
    direction?: string,
    walking?: boolean,
    distance?: number,
}

export type Journey = {
    type: 'journey',
    legs: Leg[],
    price?: number,
}

export type JourneyAndAlternative = {
    journey: Journey,
    alternatives: Journey[],
}