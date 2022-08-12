import { default as dayjs } from "dayjs";

function parse_datetimes(connections) {
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
    }
  }
  return connections;
}

export default parse_datetimes;
