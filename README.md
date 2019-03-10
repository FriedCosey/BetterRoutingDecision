### Screenshot

![image](https://user-images.githubusercontent.com/29709822/54088076-0d2c2980-4330-11e9-8aab-dc12401d154e.png)

### Installation
```
cd backend
  go run main.go
cd hostfrontend
  node app.js
```

### Structure

- frontend
  - I do not understand the code in this folder, only god knows ...
  - Just made sure everything work on my local firefox browser

- backend
  - api implemented in main.go
  - Any language is fine, flask, node, express ..... (Need to add cors header)
  - node example:
    - https://github.com/FriedCosey/Swift-Webpage/blob/master/app.js
    - https://github.com/FriedCosey/ca1/blob/master/routes/user/course/query.js
  
- hostfrontend
  - I created another server to host frontend static files because I want to test cross-origin
  - This is not needed actually, and can be merged with backend server

### API

**Sample JSON**
[{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]

**Sample Get**
http://18.188.214.33:8080/dist/origin/bike?k=5&lat=33.76147456195493&lng=-84.36572268184585

- Also return coordinates to integrate segments
  - For example, origin - bike {{ostation1: [lat1, lng1, dist1]}, {ostation2: [lat2, lng2, dist2]}}
               bike - marta {{bstation1: [lat1, lng1, dist1]}, {bstation2: [lat2, lng2, dist2]}}
  - Although ostation1 + bstation1 is shorter, but because ostation2 + bstation2 on same direction -> better path

| Method | Path | Description |
|------- | --------- | ------ |
| get | /dist/origin/marta | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
| get | /dist/origin/bike | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
| get | /dist/marta/dest | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
| get | /dist/marta/bike | parameter: k (stations), lat, lng return [{"Name":"Highland Ave - Freedom Trail Park","Dist":0,"Coord":[33.76147456195493,-84.36572268184585]},{"Name":"Eastside BeltLine \u0026 Irwin","Dist":432.05950572295995,"Coord":[33.75769038253729,-84.36468508386245]}]|
