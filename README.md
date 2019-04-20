### Screenshot

![image](https://user-images.githubusercontent.com/29709822/56450353-7cb01400-62f3-11e9-9d2d-db03967ae3dd.png)

### Installation
```
cd backend
  go get github.com/gorilla/context
  go get github.com/gorilla/mux
  go run main.go
The server should be running on localhost:8080
cd hostfrontend
  node app.js
The server should be running on localhost:3000
```

### Structure

- frontend
  - our integrated google map

- **backend**
  - api implemented in main.go
  - from each endpoint in handleReq() function, the corresponding function can be easily found
  
  /dist/origin/bike: Take User Input k, latitude and longitude. Compute the k closest bike station to the origin
  /dist/origin/marta: Take User Input k, latitude and longitude. Compute the k closest marta station to the origin
  /dist/bike/marta: Take User Input k, latitude of bike/marta station and longitude of bike/marta station. Compute the k closest marta station to the bike station.
  /dist/marta/bike: Take User Input k, latitude of bike/marta station and longitude of bike/marta station. Compute the k closest bike station to the marta station.
  /dist/walk/bike/marta: calls the above four endpoints for candidate set and enumerate all combinations
  
  
  - api endpoint for marta: https://opendata.arcgis.com/datasets/7b752dcfca54486c8290b399340a407c_17.geojson
  - api endpoint for bike: https://opendata.arcgis.com/datasets/f5b90fe709aa466084dfe2674118e426_27.geojson
  
- hostfrontend
  - node server to host frontend code

- test
  - seperate readme inside the folder

### How to play with our map
- Demo Video https://youtu.be/3KliR-3g0_8

- Click add marker
- Add start
  - Click a location on our map
- Add End
  - Click a location on our map

- Suggested route should be generated automatically
- Change the location of start/end icon by clicking other location. Have fun!


### API
- Sample Query
http://localhost:8080/cal/walk/bike/walk?k=2&lat1=33.8031772871&lng1=-84.50643562260001&lat2=33.8237153622&lng2=-84.43450950559998

- Return JSON
[{"Stations":["Tech Parkway","Atlantic Station"],"Coords":[[33.8031772871,-84.50643562260001],[33.777526808601124,-84.40759279905951],[33.79327387831942,-84.39788820975087],[33.8237153622,-84.43450950559998]],"TotalCal":1084.770867971532,"TotalTime":8469.259736183943},{"Stations":["Tech Parkway","14th \u0026 Howell Mill Rd"],"Coords":[[33.8031772871,-84.50643562260001],[33.777526808601124,-84.40759279905951],[33.78588862492411,-84.41137697891648],[33.8237153622,-84.43450950559998]],"TotalCal":1041.0060754589008,"TotalTime":8213.113795418363},{"Stations":["14th \u0026 Howell Mill Rd","Atlantic Station"],"Coords":[[33.8031772871,-84.50643562260001],[33.78588862492411,-84.41137697891648],[33.79327387831942,-84.39788820975087],[33.8237153622,-84.43450950559998]],"TotalCal":1025.3175921869733,"TotalTime":8040.157135702016},{"Stations":["14th \u0026 Howell Mill Rd","14th \u0026 Howell Mill Rd"],"Coords":[[33.8031772871,-84.50643562260001],[33.78588862492411,-84.41137697891648],[33.78588862492411,-84.41137697891648],[33.8237153622,-84.43450950559998]],"TotalCal":960.7779208996385,"TotalTime":7667.820597762477}]

| Method | Path | Description |
|------- | --------- | ------ |
| get | /dist/origin/marta | parameter: k (stations), lat, lng return [{"Name":"Inman Park-Reynoldstown","Dist":1282.4069476253053,"Coord":[33.757410764920266,-84.35275687836776]},{"Name":"King Memorial","Dist":1585.314178280163,"Coord":[33.7498080710845,-84.37554588614684]}]|
| get | /dist/origin/bike | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
| get | /dist/bike/marta | parameter: k (stations), lat, lng return [{"Name":"Inman Park-Reynoldstown","Dist":1282.4069476253053,"Coord":[33.757410764920266,-84.35275687836776]},{"Name":"King Memorial","Dist":1585.314178280163,"Coord":[33.7498080710845,-84.37554588614684]}]]|
| get | /dist/marta/bike | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
| get | /dist/walk/bike/walk /dist/walk/marta/walk /dist/walk/bike/marta | parameter: k (stations), lat1, lng1, lat2, lng2 return [{"Stations":["14th \u0026 Howell Mill Rd","14th \u0026 Howell Mill Rd"],"Coords":[[33.8031772871,-84.50643562260001],[33.78588862492411,-84.41137697891648],[33.78588862492411,-84.41137697891648],[33.8237153622,-84.43450950559998]],"TotalDist":13725.398869994833,"TotalTime":7667.820597762477}]|
| get | /cal/walk/bike/walk /cal/walk/bike/marta /cal/walk/marta/walk | parameter: k (stations), lat1, lng1, lat2, lng2 return [{"Stations":["14th \u0026 Howell Mill Rd","14th \u0026 Howell Mill Rd"],"Coords":[[33.8031772871,-84.50643562260001],[33.78588862492411,-84.41137697891648],[33.78588862492411,-84.41137697891648],[33.8237153622,-84.43450950559998]],"TotalCal":960.7779208996385,"TotalTime":7667.820597762477}]|

