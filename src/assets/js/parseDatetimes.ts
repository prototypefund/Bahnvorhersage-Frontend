import { default as dayjs } from "dayjs";

export default function parseDatetimes(connections: any): any {
  for (let i = 0; i < connections.length; i++) {
    connections[i].plannedDeparture = dayjs(connections[i].plannedDeparture);
    connections[i].plannedArrival = dayjs(connections[i].plannedArrival);

    connections[i].departure = dayjs(connections[i].departure);
    connections[i].arrival = dayjs(connections[i].arrival);
    connections[i].duration = dayjs.duration(
      connections[i].duration,
      "seconds"
    );
    connections[i].plannedDuration = dayjs.duration(
      connections[i].plannedDuration,
      "seconds"
    );

    for (let u = 0; u < connections[i].legs.length; u++) {
      connections[i].legs[u].plannedDeparture = dayjs(
        connections[i].legs[u].plannedDeparture
      );
      connections[i].legs[u].plannedArrival = dayjs(
        connections[i].legs[u].plannedArrival
      );

      connections[i].legs[u].departure = dayjs(
        connections[i].legs[u].departure
      );
      connections[i].legs[u].arrival = dayjs(connections[i].legs[u].arrival);

      connections[i].legs[u].duration = dayjs.duration(
        connections[i].legs[u].arrival.diff(connections[i].legs[u].departure)
      );
      connections[i].legs[u].plannedDuration = dayjs.duration(
        connections[i].legs[u].plannedArrival.diff(
          connections[i].legs[u].plannedDeparture
        )
      );

      if ("transferTime" in connections[i].legs[u]) {
        connections[i].legs[u].transferTime = dayjs.duration(
          connections[i].legs[u].transferTime,
          "minutes"
        );

        if (
          connections[i].legs[u].neededTransferTime.frequentTraveller.duration
        ) {
          connections[i].legs[u].neededTransferTime.frequentTraveller.duration =
            dayjs.duration(
              connections[i].legs[u].neededTransferTime.frequentTraveller
                .duration
            );
        }
        if (
          connections[i].legs[u].neededTransferTime.mobilityImpaired.duration
        ) {
          connections[i].legs[u].neededTransferTime.mobilityImpaired.duration =
            dayjs.duration(
              connections[i].legs[u].neededTransferTime.mobilityImpaired
                .duration
            );
        }
        if (
          connections[i].legs[u].neededTransferTime.occasionalTraveller.duration
        ) {
          connections[i].legs[
            u
          ].neededTransferTime.occasionalTraveller.duration = dayjs.duration(
            connections[i].legs[u].neededTransferTime.occasionalTraveller
              .duration
          );
        }
      }
    }
  }
  return connections;
}