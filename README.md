### API

- Origin, Destination, Bike Stations, Marta
- Also return coordinates to integrate segments
- For example, origin - bike {{ostation1: [lat1, lng1, dist1]}, {ostation2: [lat2, lng2, dist2]}}
               bike - marta {{bstation1: [lat1, lng1, dist1]}, {bstation2: [lat2, lng2, dist2]}}
- Although ostation1 + bstation1 is shorter, but because ostation2 + bstation2 on same direction -> better path

| Method | Path | Description |
|------- | --------- | ------ |
| get | /dist/origin/marta | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
| get | /dist/origin/bike | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
| get | /dist/bike/dest | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
| get | /dist/marta/dest | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
| get | /dist/bike/marta | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
| get | /dist/marta/bike | parameter: k (stations), return {{stationName1: [cordLat, cordLng, distance]}, ... {stationNamek: [...]}}|
