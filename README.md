### Known Bugs
- 最近的兩個點 (k = 2) 不一定是最佳, 但是當 (k = 全部的點) -> brute force 會是最佳, 所以要越準確就是跟 k 值有關 (報告可以討論 (?))
- 兩個點的直線距離會穿過建築物 (這個路線不存在) 需要繞過建築物, 但是如果考慮繞過建築物的路線, 就不能單純算兩點最短距離, 可能需要丟到 google map api 看繞過建築物時間/距離 -> 可以 argue 我們假設這路線存在或是只是 approximation (?)
- Share common station, what to do? As in 3rd screenshot marta

### Question
- Google 的地鐵路線是到最近的站嗎 (?) 還是總時間最短的站


### Screenshot

![image](https://user-images.githubusercontent.com/29709822/54088076-0d2c2980-4330-11e9-8aab-dc12401d154e.png)
![image](https://user-images.githubusercontent.com/29709822/54091095-46759100-4352-11e9-8b2c-2251b5db1d3c.png)
(The black line is the shortest distance total using bike)
![image](https://user-images.githubusercontent.com/29709822/54097643-78edb100-4387-11e9-9661-d10209a76354.png)


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
  - maybe something like:
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
http://localhost:8080/dist/walk/bike/walk?k=5&lat1=33.76147456195493&lng1=-84.36572268184585&lat2=33.76147456195493&lng2=33.76147456195493
http://localhost:8080/dist/bike/marta?k=5&lat1=33.76147456195493&lng1=-84.36572268184585&lat2=33.757410764920266&lng2=-84.35275687836776
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
| get | /dist/walk/bike/walk | parameter: k (stations), lat1, lng1, lat2, lng2 return [{Gordon-White Park 4394.230297492726 [33.73907466035702 -84.43218996727106]} {West End Park 5112.9700662789355 [33.740805432873486 -84.4244820521268]}]|
| get | /dist/walk/marta/walk | parameter: k (stations), lat1, lng1, lat2, lng2 return [{Gordon-White Park 4394.230297492726 [33.73907466035702 -84.43218996727106]} {West End Park 5112.9700662789355 [33.740805432873486 -84.4244820521268]}]|

