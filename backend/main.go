package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	handleReq()
}

func handleReq() {
	r := mux.NewRouter()
	r.HandleFunc("/bike/stations", getBikeStations).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", r))
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

func getBikeStations(w http.ResponseWriter, r *http.Request) {
	content, err := getDataFromApi("https://opendata.arcgis.com/datasets/f5b90fe709aa466084dfe2674118e426_27.geojson")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

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
        stati
	}

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(stationCord)
	// result := map[string]interface{}{}
}
