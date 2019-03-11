package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"sort"
	"strconv"
)

func main() {
	handleReq()
}

func handleReq() {
	r := mux.NewRouter()
    // r.PathPrefix("/").Handler(http.FileServer(http.Dir("../frontend/")))
	r.HandleFunc("/bike", getBikeStations(sendBikeStations)).Methods("GET", "OPTIONS")
	r.HandleFunc("/dist/origin/bike", getBikeStations(computeOriginBike)).Methods("GET", "OPTIONS")
	r.HandleFunc("/dist/walk/bike/walk", computeWalkBikeWalk).Methods("GET", "OPTIONS")
	r.HandleFunc("/dist/walk/marta/walk", computeWalkMartaWalk).Methods("GET", "OPTIONS")
	r.HandleFunc("/dist/origin/marta", getMartaStations(computeOriginMarta)).Methods("GET", "OPTIONS")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func getMartaStations(h http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		content, err := getDataFromApi("https://opendata.arcgis.com/datasets/7b752dcfca54486c8290b399340a407c_17.geojson")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stationCord := buildMartaMap(content)
		context.Set(r, "stationCord", stationCord)
		// fmt.Println(stationCord)

		h.ServeHTTP(w, r)
	})

}

func getBikeStations(h http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		content, err := getDataFromApi("https://opendata.arcgis.com/datasets/f5b90fe709aa466084dfe2674118e426_27.geojson")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stationCord := buildBikeMap(content)
		context.Set(r, "stationCord", stationCord)
		// fmt.Println(stationCord)

		h.ServeHTTP(w, r)
	})

}

func getDataFromApi(url string) ([]byte, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, errors.New("Cannot get API!")
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, errors.New("Cannot get body!")
	}
	return body, nil
}

func buildMartaMap(content []byte) map[string][]float64 {
	stationCord := map[string][]float64{}

	resJson := map[string]interface{}{}
	json.Unmarshal(content, &resJson)
	for _, station := range resJson["features"].([]interface{}) {
		name := ""
		cord := []float64{}
		for keyProp, prop := range station.(map[string]interface{}) {
			if keyProp == "properties" {
				name = prop.(map[string]interface{})["STATION"].(string)
			} else if keyProp == "geometry" {
				cord = append(cord, prop.(map[string]interface{})["coordinates"].([]interface{})[1].(float64))
				cord = append(cord, prop.(map[string]interface{})["coordinates"].([]interface{})[0].(float64))
			}
		}
		// fmt.Println(station_Name)
		// fmt.Println(station_Cord)
		stationCord[name] = cord
	}
	return stationCord
}

func buildBikeMap(content []byte) map[string][]float64 {
	stationCord := map[string][]float64{}

	resJson := map[string]interface{}{}
	json.Unmarshal(content, &resJson)
	for _, station := range resJson["features"].([]interface{}) {
		name := ""
		cord := []float64{}
		for keyProp, prop := range station.(map[string]interface{}) {
			if keyProp == "properties" {
				name = prop.(map[string]interface{})["STATION_NAME"].(string)
			} else if keyProp == "geometry" {
				cord = append(cord, prop.(map[string]interface{})["coordinates"].([]interface{})[1].(float64))
				cord = append(cord, prop.(map[string]interface{})["coordinates"].([]interface{})[0].(float64))
			}
		}
		// fmt.Println(station_Name)
		// fmt.Println(station_Cord)
		stationCord[name] = cord
	}
	return stationCord
}

func sendBikeStations(w http.ResponseWriter, r *http.Request) {
	allData := context.GetAll(r)
	stationCord := allData["stationCord"]
	fmt.Println(stationCord)
	/* w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(stationCord)
	// result := map[string]interface{}{}
	// fmt.Fprintf(w, "%v", stationCord)
    */
    w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(stationCord)
}

func computeOriginMarta(w http.ResponseWriter, r *http.Request) {
	allData := context.GetAll(r)
	stationCord := allData["stationCord"]
	// fmt.Println(r.URL.Query().Get("k"))
	k := r.URL.Query().Get("k")
	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	flat, err := strconv.ParseFloat(lat, 64)
	if err != nil {
		http.Error(w, "lat parse error", http.StatusBadRequest)
		return
	}
	flng, err := strconv.ParseFloat(lng, 64)
	if err != nil {
		http.Error(w, "lng parse error", http.StatusBadRequest)
		return
	}
	ik, err := strconv.Atoi(k)
	if err != nil {
		http.Error(w, "k parse error", http.StatusBadRequest)
		return
	}
	fmt.Println(ik, flat, flng)
	// fmt.Println(stationCord)

	type martaCord struct {
		Key   string
		Value []float64
	}

	martaVals := []martaCord{}
	origin := []float64{flat, flng}
	for k, v := range stationCord.(map[string][]float64) {
		v = append(v, calcDist(origin, v))
		martaVals = append(martaVals, martaCord{k, v})
	}

	sort.Slice(martaVals, func(i, j int) bool {
		// d1 := calcDist(origin, bikeVals[i].Value)
		// d2 := calcDist(origin, bikeVals[j].Value)
		// fmt.Println(d1, d2)
		return martaVals[i].Value[2] < martaVals[j].Value[2]
		// return ss[i].Value > ss[j].Value
	})

	type resObj struct {
		Name  string
		Dist  float64
		Coord []float64
	}
	resCord := []resObj{}
	for _, martaCord := range martaVals {
		if ik == 0 {
			break
		}
		// fmt.Printf("%s, %v\n", bikeCord.Key, bikeCord.Value)
		resCord = append(resCord, resObj{martaCord.Key, martaCord.Value[2], []float64{martaCord.Value[0], martaCord.Value[1]}})
		ik--
	}
	fmt.Println(resCord)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resCord)
}

func buildCandiBike(resJson []interface{}) map[string][]float64 {
    candiCoord := map[string][]float64{}
    for _, val := range resJson {
        tmp := []float64{}
        for _,  coord := range (val.(map[string]interface{})["Coord"].([]interface{})){
            tmp = append(tmp, coord.(float64))
        }
        candiCoord[val.(map[string]interface{})["Name"].(string)] = tmp
    }
    // fmt.Println(originCoord)
    return candiCoord
}

func computeWalkBikeWalk(w http.ResponseWriter, r *http.Request) {

	k := r.URL.Query().Get("k")
	lat1 := r.URL.Query().Get("lat1")
	lng1 := r.URL.Query().Get("lng1")
	lat2 := r.URL.Query().Get("lat2")
	lng2 := r.URL.Query().Get("lng2")

    content1, err := getDataFromApi("http://localhost:8080/dist/origin/bike?k=" + k + "&lat=" + lat1 + "&lng=" + lng1)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
	resJson1 := []interface{}{}
	json.Unmarshal(content1, &resJson1)
    originCoord := buildCandiBike(resJson1) 
    // fmt.Println(originCoord)

    content2, err := getDataFromApi("http://localhost:8080/dist/origin/bike?k=" + k + "&lat=" + lat2 + "&lng=" + lng2)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
	resJson2 := []interface{}{}
	json.Unmarshal(content2, &resJson2)
    destCoord := buildCandiBike(resJson2) 
    // fmt.Println(destCoord)

	flat1, err := strconv.ParseFloat(lat1, 64)
	if err != nil {
		http.Error(w, "lat parse error", http.StatusBadRequest)
		return
	}
	flng1, err := strconv.ParseFloat(lng1, 64)
	if err != nil {
		http.Error(w, "lng parse error", http.StatusBadRequest)
		return
	}
	flat2, err := strconv.ParseFloat(lat2, 64)
	if err != nil {
		http.Error(w, "lat parse error", http.StatusBadRequest)
		return
	}
	flng2, err := strconv.ParseFloat(lng2, 64)
	if err != nil {
		http.Error(w, "lng parse error", http.StatusBadRequest)
		return
	}
    origin := []float64{flat1, flng1}
    dest := []float64{flat2, flng2}
    type totalPath struct{
        Stations []string
        Coords [][]float64
        TotalDist float64
    }

    pathPairs := []totalPath{}
    for orgStat, orgCoord := range(originCoord){
        for destStat, destCoord := range(destCoord){
            totalDist := 0.
            totalDist += calcDist(origin, orgCoord)
            totalDist += calcDist(destCoord, orgCoord)
            totalDist += calcDist(destCoord, dest)
            tmpStat := []string{}
            tmpStat = append(tmpStat, orgStat)
            tmpStat = append(tmpStat, destStat)
            tmpCoord := [][]float64{}
            tmpCoord = append(tmpCoord, origin)
            tmpCoord = append(tmpCoord, orgCoord)
            tmpCoord = append(tmpCoord, destCoord)
            tmpCoord = append(tmpCoord, dest)
            pathPairs = append(pathPairs, totalPath{tmpStat, tmpCoord, totalDist})
        }
    }
	sort.Slice(pathPairs, func(i, j int) bool {
		return pathPairs[i].TotalDist < pathPairs[j].TotalDist
	})
    w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(pathPairs)
}

func computeOriginBike(w http.ResponseWriter, r *http.Request) {
	allData := context.GetAll(r)
	stationCord := allData["stationCord"]
	// fmt.Println(r.URL.Query().Get("k"))
	k := r.URL.Query().Get("k")
	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	flat, err := strconv.ParseFloat(lat, 64)
	if err != nil {
		http.Error(w, "lat parse error", http.StatusBadRequest)
		return
	}
	flng, err := strconv.ParseFloat(lng, 64)
	if err != nil {
		http.Error(w, "lng parse error", http.StatusBadRequest)
		return
	}
	ik, err := strconv.Atoi(k)
	if err != nil {
		http.Error(w, "k parse error", http.StatusBadRequest)
		return
	}
	fmt.Println(ik, flat, flng)
	/* for _, val := range(stationCord.(map[string][]float64)){
	    fmt.Println(val)
	}*/
	type bikeCord struct {
		Key   string
		Value []float64
	}

	bikeVals := []bikeCord{}
	origin := []float64{flat, flng}
	for k, v := range stationCord.(map[string][]float64) {
		v = append(v, calcDist(origin, v))
		bikeVals = append(bikeVals, bikeCord{k, v})
	}

	sort.Slice(bikeVals, func(i, j int) bool {
		// d1 := calcDist(origin, bikeVals[i].Value)
		// d2 := calcDist(origin, bikeVals[j].Value)
		// fmt.Println(d1, d2)
		return bikeVals[i].Value[2] < bikeVals[j].Value[2]
		// return ss[i].Value > ss[j].Value
	})

	type resObj struct {
		Name  string
		Dist  float64
		Coord []float64
	}
	resCord := []resObj{}
	for _, bikeCord := range bikeVals {
		if ik == 0 {
			break
		}
		// fmt.Printf("%s, %v\n", bikeCord.Key, bikeCord.Value)
		resCord = append(resCord, resObj{bikeCord.Key, bikeCord.Value[2], []float64{bikeCord.Value[0], bikeCord.Value[1]}})
		ik--
	}
	fmt.Println(resCord)
    w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resCord)
}

func rad(x float64) float64 {
	return x * math.Pi / 180
}

func calcDist(p1, p2 []float64) float64 {
	Earth_R := 6378137. // Earth’s mean radius in meter
	dLat := rad(p2[0] - p1[0])
	dLong := rad(p2[1] - p1[1])
	a := math.Sin(dLat/2)*math.Sin(dLat/2) + math.Cos(rad(p1[0]))*math.Cos(rad(p2[0]))*math.Sin(dLong/2)*math.Sin(dLong/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	d := Earth_R * c
	return d // returns the distance in meter
}
