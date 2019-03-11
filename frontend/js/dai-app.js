$(function(){
       
        var map;        
        function initialize() {
          // Create an array of styles.
          var styles = 
          [
              {
                  "featureType": "water",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#d3d3d3"
                      }
                  ]
              },
              {
                  "featureType": "transit",
                  "stylers": [
                      {
                          "color": "#808080"
                      },
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#b3b3b3"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#ffffff"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#ffffff"
                      },
                      {
                          "weight": 1.8
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "color": "#d7d7d7"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#ebebeb"
                      }
                  ]
              },
              {
                  "featureType": "administrative",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "color": "#a7a7a7"
                      }
                  ]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#ffffff"
                      }
                  ]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#ffffff"
                      }
                  ]
              },
              {
                  "featureType": "landscape",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#efefef"
                      }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels.text.fill",
                  "stylers": [
                      {
                          "color": "#696969"
                      }
                  ]
              },
              {
                  "featureType": "administrative",
                  "elementType": "labels.text.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#737373"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "labels.icon",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "labels",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "color": "#d6d6d6"
                      }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels.icon",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {},
              {
                  "featureType": "poi",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#dadada"
                      }
                  ]
              }
          ];
          // Create a new StyledMapType object, passing it the array of styles,
          // as well as the name to be displayed on the map type control.
          var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});      
          // Create a map object, and include the MapTypeId to add
          // to the map type control.
          var mapOptions = {
            disableDefaultUI: true,
            zoom: 12,
            zoomControl: true,
            scaleControl: true,
            scrollwheel: true,
            center: new google.maps.LatLng(33.7780685,-84.3914225),
            mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
          };
          map = new google.maps.Map(document.getElementById('Location-map'),
            mapOptions);

          //Associate the styled map with the MapTypeId and set it to display.
          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');
          
          //click(map);
          
        }

        initialize();           
        
        /**************************************************************************************/
        /**************************************************************************************/
        var markers=[];  //store the fixed marker
        var markers_sensor=[[],[]]; //store all the markers
        
        var Latitude = -1;  // store the newest lat from sensor
        var Longitude = -1; // store the newest lng from sensor
        var val;  //store the newest val from sensor
        
        var lastLat=0; 
        var lastLng=0;
        
        var polyCoordinates = []; //store the newest polyline      
        var polyLines = [[],[]]; //store all the visible polylines
        var limit=3;  // the number of lines that we want to remain on the map
        
        var status=[0,0,0,0,0,0]; //status of buttons  
        
        var counterIDs = [0, 0]; // the number of marker
        
        var flag_op=0;
        var flag=0; // 1 : data come in for the first time --> show the dynamic marker 
        var flag_camera=0; // 1 : someone click the camera button , so ignore the triggers from makers who near the camera
        var change = document.getElementById("button_s1");
        
        var camera1 = {lat:24.789655 , lng:120.997031};
        var camera2 = {lat:24.788225 , lng:120.998487};  
        /**************************************************************************************/
        /**************************************************************************************/
        
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
            parking: {
                icon: iconBase + 'parking_lot_maps.png'
            },
            obstacle: {
                icon: 'image/icons8-railway-station-24.png'
            },
            info: {
                icon: iconBase + 'info-i_maps.png'
            },
            camera: {
                icon: 'image/icons8-bicycle-50.png'
            },
            dog1: {
                icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
            },
            dog2: {
                icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-stars.png'
            },
            cat1: {
                icon: 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png'
            },
            cat2: {
                icon: 'http://maps.google.com/mapfiles/kml/paddle/purple-stars.png'
            }
        };
      
        

    var ajaxInit = new XMLHttpRequest();
    var url = "ATLBicycle_Share.geojson";
    ajaxInit.open("GET", url, true); // True for sync
    ajaxInit.setRequestHeader("content-type","application/json");
    ajaxInit.onreadystatechange = function(){
        if(ajaxInit.readyState == 4 && ajaxInit.status == 200){
            var atlbikeJson = JSON.parse(ajaxInit.responseText);
            processData(atlbikeJson, "camera");
        }
    }   
    ajaxInit.send(null);

    var ajaxInit2 = new XMLHttpRequest();
    var url2 = "MartaStations.geojson";
    ajaxInit2.open("GET", url2, true); // True for sync
    ajaxInit2.setRequestHeader("content-type","application/json");
    ajaxInit2.onreadystatechange = function(){
        if(ajaxInit2.readyState == 4 && ajaxInit2.status == 200){
            var martaJson = JSON.parse(ajaxInit2.responseText);
            processData(martaJson, "obstacle");
            addListenertoObstacle();
        }
        // addListenertoObstacle();

    }
   
    ajaxInit2.send(null);


    function processData(atlbikeJson, type)
    {
        // console.log(atlbikeJson.features);
        // console.log(atlbikeJson.features.length);
        var stations = atlbikeJson.features;
        for(let i = 0; i < stations.length; i++){
            // console.log(stations[i].geometry.coordinates);
            // console.log(stations[i].properties.STATION_NAME);
            let s_name;
            
            if(type == "obstacle"){
                s_name = stations[i].properties.STATION;
                var image = {
                    url: icons[type].icon,
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                };
                var marker = new google.maps.Marker({
                    position:  new google.maps.LatLng(stations[i].geometry.coordinates[1], stations[i].geometry.coordinates[0]),
                    icon: image,
                    map: map,
                    title: type,
                    content: stations[i].properties.STATION,
                    visible: false
                });
                markers.push(marker);
            }
            else{
                s_name = stations[i].properties.STATION_NAME;
                var image = {
                    url: icons[type].icon,
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                };
                var marker = new google.maps.Marker({
                    position:  new google.maps.LatLng(stations[i].geometry.coordinates[1], stations[i].geometry.coordinates[0]),
                    icon: image,
                    map: map,
                    title: type,
                    content: stations[i].properties.STATION_NAME,
                    visible: false
                });
                markers.push(marker);
            }
            /*
            var marker = new google.maps.Marker({
                position:  new google.maps.LatLng(stations[i].geometry.coordinates[1], stations[i].geometry.coordinates[0]),
                icon: icons[type].icon,
                map: map,
                title: type,
                content: s_name,
                visible: false
            });
            /*console.log(marker.content);
            if(marker.title == 'obstacle' || marker.title == 'camera'){
                var infowindow = new google.maps.InfoWindow({
                    content: marker.content
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
                infowindowIndex =  marker.index;
            });
            marker.index = infowindowArr.length;
                infowindowArr.push(infowindow);
            };
            markers.push(marker);*/
            
            // markers.push(marker);
            
            
        }

    }

   
        var features = [];
        
        // Create markers.
        features.forEach(function(feature) {
            var marker = new google.maps.Marker({
                position: feature.position,
                icon: icons[feature.type].icon,
                map: map,
                title: feature.type,
                content:feature.content,
                visible: false
            });
            markers.push(marker);
            marker.addListener('click', function() {
                 if(marker.title == 'camera'){
                      if(marker.content == 'open') //if the camera is already open , close it
                      {
                            $('#function_but').show(); 
                            marker.content ='close';
                            $('#Video-Display').attr('src', '');
                            flag_camera = 0;
                      }
                      else
                      {
                            
                            $('#function_but').hide();
                            $('.button_sm').hide(); 
                            if(marker.position == features[0].position)
                            {
                                $('#Video-Display').attr('src', 'http://admin:5131339@140.113.124.220/GetData.cgi?CH=1');
                                //marker.content ='close';
                                markers.forEach(function(M) {
                                    if(M.position != features[0].position && M.title == 'camera')
                                    M.content = 'close';
                                });
                            }
                            else
                            {
                                   //alert(marker.position[1] + new google.maps.LatLng(24.789655, 120.997031));
                                $('#Video-Display').attr('src', 'http://admin:5131339@140.113.124.221/video1.mjpg');
                                //marker.content ='close';
                                markers.forEach(function(M) {
                                    if(M.position != features[1].position && M.title == 'camera')
                                    M.content = 'close';
                                });
                            }
                            marker.content ='open';
                            flag_camera = 1;
                      }
                  }  

             });
              
        });
       
       
        $('#button_d1').hide();  // we dont show this button initially        
        
        status[0]=0;
        status[1]=1; // i should set obstacle to this flag but i mess up haha
        status[2]=0;
        status[3]=0;
        status[4]=0;
        
        
        
        
        $(document).on('click', '#button_s1', function(){            
            if(status[0] == 1)
            {                
                change.innerHTML = "Select All";
                $(this).css({"opacity": 0.5});
                status[0] = 0;
                status[2]=0;
                status[3]=0;
                $('#button_s2').css({"opacity": 0.5});
                $('#button_s3').css({"opacity": 0.5});
                markers.forEach(function(marker) {
                   if(marker.title == 'obstacle')
                       marker.setVisible(false);
               });
                markers.forEach(function(marker) {
                   if(marker.title == 'camera')
                       marker.setVisible(false);
               });
                for(i = 0; i < infowindowArr.length; i++)
                        infowindowArr[i].close();

                
            }
            else
            {
                change.innerHTML = "Cancel";
                $(this).css({"opacity": 1});
                status[0] = 1;
                $('#button_s2').css({"opacity": 1});
                $('#button_s3').css({"opacity": 1});
                //$('#button_d1').css({"opacity": 1});
                status[2]=1;
                status[3]=1;
                //status[4]=1;
           
                markers.forEach(function(marker) {
                    if(marker.title == 'camera')
                        marker.setVisible(true);
                });
           
                markers.forEach(function(marker) {
                    if(marker.title == 'obstacle'){
                        marker.setVisible(true);
                    }
                });
                /*markers_sensor.forEach(function(arr) {
                     HideAllMarkers(arr);
               });*/
            }
                  
        });
       
        $(document).on('click', '#button_s2', function(){
           if(status[2] == 1)
           {
              //alert("123");
               $(this).css({"opacity": 0.5});
               $('#button_s1').css({"opacity": 0.5});
               change.innerHTML = "Select All";
               status[2]=0;
               status[0] = 0;
               markers.forEach(function(marker) {
                   if(marker.title == 'obstacle')
                       marker.setVisible(false);
               });
           }
           else
           {
               status[2]=1;              
               $(this).css({"opacity": 1});               
               markers.forEach(function(marker) {
                   if(marker.title == 'obstacle'){
                        marker.setVisible(true);
                     
                    }
               });
               if(CheckAllButton())
              {
                     $('#button_s1').css({"opacity": 1});
                     status[0] = 1;
                     change.innerHTML = "Cancel";
              }
           }
        });
       
        $(document).on('click', '#button_s3', function(){
           if(status[3] == 1)
           {
               $(this).css({"opacity": 0.5});
               $('#button_s1').css({"opacity": 0.5});
               $('#Video-Display').attr('src', '');
               $('#function_but').show();
               change.innerHTML = "Select All";
               status[3]=0;
               status[0] = 0;
               markers.forEach(function(marker) {
                   if(marker.title == 'camera')
                       marker.setVisible(false);
               });
           }
           else
           {
              $(this).css({"opacity": 1});
              status[3]=1;                   
              markers.forEach(function(marker) {
                   if(marker.title == 'camera')
                       marker.setVisible(true);
               });
               if(CheckAllButton())
              {
                     $('#button_s1').css({"opacity": 1});
                     status[0] = 1;
                     change.innerHTML = "Cancel";
              }
           }
        });
        
        $(document).on('click', '#button_d1', function(){
           var button = document.getElementById('button_d1');
           if(status[4] == 1)
           {
              
              $(this).css({"opacity": 0.5});
              $(this).css({"border": ""});
              //$('#button_s1').css({"opacity": 0.5});
              change.innerHTML = "Select All";
               status[4] = 0;
               //status[0] = 0;
               markers_sensor.forEach(function(arr) {
                   HideAllMarkers(arr);
               });
               polyLines .forEach(function(arr) {
                   HideAllLines(arr);
               });
               
           }
           else
           {
              /*if(CheckAllButton())
              {
                     $('#button_s1').css({"opacity": 1});
                     status[0] = 1;
                     change.innerHTML = "Cancel";
              }*/
              $(this).css({"opacity": 1});
              //$(this).css({"border": "2px red double"});
               status[4] = 1;
               markers_sensor.forEach(function(arr) {
                   arr[arr.length-1].setVisible(true);
               });
           }
        });
                
        $('.function').on('click', function(){
          $('.button_sm').toggle();
          $('.button').toggle();

        })
        
        function CheckAllButton(){
              for(var x=1;x < 4;x++)
              {
                     if(status[x]== 0)
                         return false;
              }
              return true;
        }
                
        function GeoLoData_O(data){
           
           Latitude = parseFloat(data[0]);
           Longitude = parseFloat(data[1]);
           val = data[2].toString();
           if(Latitude != -1 && Longitude != -1 && flag == 0) // check is the data come in for the first time
           {
              flag = 1;
              $('#button_d1').show();
              //status[4] = 1;              
           }
           if(status[4]==1)
           {              
               addMarker(Latitude, Longitude, val);
           }
           else
               HideAllMarkers(markers_sensor[val]);
        }
               
        function getDistance(p1, p2) {
            function rad(x){
                return x*Math.PI/180;
            }      
            var Earth_R = 6378137; // Earth’s mean radius in meter
            var dLat = rad(p2.lat - p1.lat);
            var dLong = rad(p2.lng - p1.lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = Earth_R * c;
            return d; // returns the distance in meter       
        }
              
        function HideAllMarkers(markerArr){
              
              {
                  markerArr.forEach(function(marker) {
                         marker.setVisible(false);
                  });   
              }
            
        }
        
        function HideAllLines(lineArr){
              
              {
                  lineArr.forEach(function(line) {
                         line.setVisible(false);
                  });   
              }
            
        }
           
        function addMarker(lat, lng, val){
            console.log('adding marker: [ lat: ' + lat + ', lng: ' + lng + ', val: ' + val + ' ]');
            if(getDistance({ lat: lat, lng: lng }, { lat: lastLat, lng: lastLng }) > 2 )  //consider 2 markers are the same if their distance < 2
            {
                HideAllMarkers(markers_sensor[val]);
                var marker = new google.maps.Marker({
                    position:{ lat: lat, lng: lng },
                    map: map,
                    title: "bana",
                    label: val,
                    icon:'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png',
                });
            
                markers_sensor[val].push(marker);
                lastLat= lat;
                lastLng= lng;                
                counterIDs[val]++;
                /*************************************************************************************************************/
                /*  Show camera when marker approach                                                                         */
                /*************************************************************************************************************/
                if(getDistance({ lat: lat, lng: lng }, { lat: camera1.lat, lng: camera1.lng }) <10  && flag_camera!=1 )
                {
                     $('#Video-Display').attr('src', 'http://admin:5131339@140.113.124.220/GetData.cgi?CH=1');
                     $('#function_but').hide();
                }
                else if(getDistance({ lat: lat, lng: lng }, { lat: camera2.lat, lng: camera2.lng }) <10 && flag_camera!=1 )
                {
                     $('#Video-Display').attr('src', 'http://admin:5131339@140.113.124.221/video1.mjpg');
                     $('#function_but').hide();
                }
                else{
                     if( flag_camera!=1 )
                     {
                         $('#Video-Display').attr('src', '');
                         $('#function_but').show();
                     }
                }
                /*************************************************************************************************************/
                /*  Show camera when marker approach                                                                         */
                /*************************************************************************************************************/
            }
            
        }
              
        function addPolyLine( index, num, markerArr){     
              polyCoordinates = [];              
              polyCoordinates.push(markerArr[num].position);  // point n
              num--;
              polyCoordinates.push(markerArr[num].position);  // point n-1             
                           
              var markersLine = new google.maps.Polyline({     // line n <--> n-1
                  path: polyCoordinates,
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  visible:true
                });
              polyLines[index].push(markersLine);       // put line n <--> n-1 into polyArray according to the index ( dog1 or dog2)
              polyLines[index][polyLines[index].length-1].setMap(map);
              if(polyLines[index].length > limit)          // polyArray can only store 'limit' lines
              {
                  var temp = [];
                  for(var j=1;j<polyLines[index].length;j++)
                  {
                      temp.push(polyLines[index][j]);
                  }
                  polyLines[index][0].setVisible(false);
                  polyLines[index] = temp;                  
              }              
        }
        

  /***************************************************************************************************************************************************************/      
        

        $('.button').on('click', function(){
            console.log('tared');
            console.log(infowindowIndex);
            var clicked = false;
            if($(this).hasClass('clickClass'))
              clicked = true;
            $('.button').removeClass('clickClass');
            if(clicked)
                $(this).removeClass('clickClass');
            else
               $(this).addClass('clickClass');
            if($('#ob_upd').hasClass('clickClass'))
            {
                var newInfo = prompt('Enter new information');
                infowindowArr[infowindowIndex].setContent(newInfo);

            }
            if($('#ob_add').hasClass('clickClass'))
            {
                google.maps.event.clearInstanceListeners(map);

                icon = 'image/icons8-railway-station-24.png';
          // prompt("Add Description: ");
                var title = 'obstacle';

                gg1listen = balala(icon,title);
            }
            else if($('#cam_add').hasClass('clickClass'))
            {
                google.maps.event.clearInstanceListeners(map);
    //prompt("Stream URI: ");
                icon = 'image/icons8-bicycle-50.png';
                var title = 'camera';
                gg2listen = balala(icon , title);
            }
            else if($('#start_add').hasClass('clickClass'))
            {
                google.maps.event.clearInstanceListeners(map);
    //prompt("Stream URI: ");
                icon = 'image/icons8-detective-64.png';
                var title = 'start';
                gg2listen = balala(icon , title);
            }
            else if($('#end_add').hasClass('clickClass'))
            {
                google.maps.event.clearInstanceListeners(map);
    //prompt("Stream URI: ");
                icon = 'image/icons8-iron-man-64.png';
                var title = 'end';
                gg2listen = balala(icon , title);
            }
        });

        /*$('#cam_add').on('click', function(){
            $('#ob_add').removeClass('clickClass');
            $(this).toggleClass('clickClass');
            if($('#cam_add').hasClass('clickClass'))
            {
                google.maps.event.clearInstanceListeners(map);
    //prompt("Stream URI: ");
                icon = 'http://i.imgur.com/Eh9U0qI.png';
                var title = 'camera';
                gg2listen = balala(icon , title);
            }
        });*/

        var balala = function(icon , title){        
            var listenergg = google.maps.event.addListener(map, 'click', function(event) {
                var LatLng = event.latLng;
                lat = LatLng.lat().toPrecision(12);
                lng = LatLng.lng().toPrecision(12);
                // yoo
                var URL = 1;
                // yoo
                if(URL)
                    addIcon(parseFloat(lat), parseFloat(lng), icon , title, URL);
                return function(){};
            });
      };
        
        var startMarker = [];
        var endMarker = [];
        function addIcon(lat, lng, icon_ ,title, URL)
        {          
        //deleteMarkers();
            // yoo
            if(title == 'camera' && !($('#cam_add').hasClass('clickClass')))
              return;
            if(title == 'obstacle' && !($('#ob_add').hasClass('clickClass')))
              return;
            if(title == 'start' && !($('#start_add').hasClass('clickClass')))
              return;
            if(title == 'start' && ($('#start_add').hasClass('clickClass'))){
                var image = {
                    url: icon_,
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                };
                var marker = new google.maps.Marker({
                    icon: image,
                    position:{ lat: lat, lng: lng },
                    map: map, 
                    fillOpacity: 0.4,
                    title: title,
                    // yoo
                    content: ""

                    // yoo
                //icon: pinImage
                });
                if(startMarker.length != 0){
                    startMarker[0].setMap(null);
                    startMarker[0] = marker;
                }
                else{
                    startMarker.push(marker);
                }
                getClosetBikeStation(startMarker[0], true);
                getClosetMartaStation(startMarker[0], true);
                return;
            }
            if(title == 'end' && !($('#end_add').hasClass('clickClass')))
              return;
            if(title == 'end' && ($('#end_add').hasClass('clickClass'))){
                var image = {
                    url: icon_,
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                };
                var marker = new google.maps.Marker({
                    icon: image,
                    position:{ lat: lat, lng: lng },
                    map: map, 
                    fillOpacity: 0.4,
                    title: title,
                    // yoo
                    content: ""

                    // yoo
                //icon: pinImage
                });
                if(endMarker.length != 0){
                    endMarker[0].setMap(null);
                    endMarker[0] = marker;
                }
                else{
                    endMarker.push(marker);
                }
                getClosetBikeStation(endMarker[0], false);
                getClosetMartaStation(endMarker[0], false);
                return;
            }

            bootbox.prompt(" ", function(result){ 
                if(!result) return 0;
                var marker = new google.maps.Marker({
                    icon: icon_,
                    position:{ lat: lat, lng: lng },
                    map: map, 
                    fillOpacity: 0.4,
                    title: title,
                    // yoo
                    content: result

                    // yoo
                //icon: pinImage
                    });
                if(marker.title == 'obstacle' || marker.title == 'camera'){
                    var infowindow = new google.maps.InfoWindow({
                        content: marker.content
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                    infowindowIndex =  marker.index;
                });
                marker.index = infowindowArr.length;
                    infowindowArr.push(infowindow);
                };
                markers.push(marker);
                console.log(result); 
            });
            // var infofo = prompt("Station Name: ");
                        // yoo
            
        }
        var infowindowIndex = -1;
        infowindowArr = [];
        function addListenertoObstacle()
        {
            console.log(markers.length);
            for(let i = 0; i < markers.length; i++){
                let infowindow = new google.maps.InfoWindow({
                      content: markers[i].content
                });
                markers[i].addListener('click', function() {
                      infowindow.open(map, markers[i]);
                      infowindowIndex = markers[i].index;
                });
                markers[i].index = infowindowArr.length;
                infowindowArr.push(infowindow);
                
            }
            
            
        }

    /***************************************************************************************************************************************************************/     
    
    var barDomBike = $('#rightbar span:nth-child(1)');
    var barDomMarta = $('#rightbar span:nth-child(2)');

    
    function getClosetBikeStation(marker, start){
        $.get("http://18.188.214.33:8080/dist/origin/bike?k=2&lat=" + marker.getPosition().lat() + "&lng=" + marker.getPosition().lng(), function(data){
            // console.log(data);
            for(let i = 0; i < data.length; i++){
                // console.log(data[i].Coord);
                addClosestBike(marker, data[i].Coord, start)
            }
        });
    }   

    var closeOriginBike = [];
    var closeDestBike = [];
    var closeBike = [];
    var bikeOriginCoord = [];
    var bikeDestCoord = [];
    function addClosestBike(marker, coord, start){   
        if(start){ // Origin  
            polyCoordinates = [];              
            polyCoordinates.push(marker.position); 
            polyCoordinates.push({lat: coord[0], lng: coord[1]});             
            if(closeOriginBike.length >= 2){
                for(let i = 0; i < closeOriginBike.length; i++){
                    closeOriginBike[i].setVisible(false)
                }
                closeOriginBike.length = 0;
                bikeOriginCoord.length = 0;
            }

            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#4286f4",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            closeOriginBike.push(markersLine);
            bikeOriginCoord.push(coord);
        }
        else{
            polyCoordinates = [];              
            polyCoordinates.push(marker.position); 
            polyCoordinates.push({lat: coord[0], lng: coord[1]});             
            if(closeDestBike.length >= 2){
                for(let i = 0; i < closeDestBike.length; i++){
                    closeDestBike[i].setVisible(false)
                }
                closeDestBike.length = 0;
                bikeDestCoord.length = 0;
            }

            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#4286f4",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            closeDestBike.push(markersLine);
            bikeDestCoord.push(coord);
        }
        if(bikeOriginCoord.length == 2 && bikeDestCoord.length == 2){
            connectBike();
        }
    }

    var bikeLine = [];
    function connectBike(){
        if(closeBike.length >= 4){
            for(let i = 0; i < closeBike.length; i++){
                closeBike[i].setVisible(false)
            }
            closeBike.length = 0;
        }
        for(let i = 0; i < bikeOriginCoord.length; i++){
            for(let j = 0; j < bikeDestCoord.length; j++){
                polyCoordinates = [];              
                polyCoordinates.push({lat: bikeOriginCoord[i][0], lng: bikeOriginCoord[i][1]}); 
                polyCoordinates.push({lat: bikeDestCoord[j][0], lng: bikeDestCoord[j][1]});             
                var markersLine = new google.maps.Polyline({     
                    path: polyCoordinates,
                    strokeColor: "#4286f4",
                    strokeOpacity: 0.1,
                    strokeWeight: 2,
                    visible:true
                });
                markersLine.setMap(map);
                closeBike.push(markersLine);
            }
        }
        $.get("http://18.188.214.33:8080/dist/walk/bike/walk?k=2&lat1=" + startMarker[0].getPosition().lat() + "&lng1=" + startMarker[0].getPosition().lng() + "&lat2=" + endMarker[0].getPosition().lat() + "&lng2=" + endMarker[0].getPosition().lng(), function(data){
            console.log(data[0].Coords);
            polyCoordinates = [];
            if(bikeLine.length > 0){
                bikeLine[0].setVisible(false);
                bikeLine.length = 0;
            }
            for(let i = 0; i < data[0].Coords.length; i++){
                polyCoordinates.push({lat: data[0].Coords[i][0], lng: data[0].Coords[i][1]});
            }
            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#4286f4",
                strokeOpacity: 1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            bikeLine.push(markersLine);
            barDomBike.text("Walk to " + data[0].Stations[0] + " and ride Bicycle to " + data[0].Stations[1] + ". The total distance of walking and biking is " + data[0].TotalDist.toPrecision(2) + " meters.");
        });
    }


    function getClosetMartaStation(marker, start){
        $.get("http://18.188.214.33:8080/dist/origin/marta?k=2&lat=" + marker.getPosition().lat() + "&lng=" + marker.getPosition().lng(), function(data){
            // console.log(data);
            for(let i = 0; i < data.length; i++){
                // console.log(data[i].Coord);
                addClosestMarta(marker, data[i].Coord, start)
            }
        });
    }   

    var closeOriginMarta = [];
    var closeDestMarta = [];
    var closeMarta = [];
    var martaOriginCoord = [];
    var martaDestCoord = [];

    function addClosestMarta(marker, coord, start){   
        if(start){ // Origin  
            polyCoordinates = [];              
            polyCoordinates.push(marker.position); 
            polyCoordinates.push({lat: coord[0], lng: coord[1]});             
            if(closeOriginMarta.length >= 2){
                for(let i = 0; i < closeOriginMarta.length; i++){
                    closeOriginMarta[i].setVisible(false)
                }
                closeOriginMarta.length = 0;
                martaOriginCoord.length = 0;
            }

            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#f77b0e",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            closeOriginMarta.push(markersLine);
            martaOriginCoord.push(coord);
        }
        else{
            polyCoordinates = [];              
            polyCoordinates.push(marker.position); 
            polyCoordinates.push({lat: coord[0], lng: coord[1]});             
            if(closeDestMarta.length >= 2){
                for(let i = 0; i < closeDestMarta.length; i++){
                    closeDestMarta[i].setVisible(false)
                }
                closeDestMarta.length = 0;
                martaDestCoord.length = 0;
            }

            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#f77b0e",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            closeDestMarta.push(markersLine);
            martaDestCoord.push(coord);
        }
        if(martaOriginCoord.length == 2 && martaDestCoord.length == 2){
            connectMarta();
        }
    }
    
    var martaLine = [];
    function connectMarta(){
        if(closeMarta.length >= 4){
            for(let i = 0; i < closeMarta.length; i++){
                closeMarta[i].setVisible(false)
            }
            closeMarta.length = 0;
        }
        for(let i = 0; i < martaOriginCoord.length; i++){
            for(let j = 0; j < martaDestCoord.length; j++){
                polyCoordinates = [];              
                polyCoordinates.push({lat: martaOriginCoord[i][0], lng: martaOriginCoord[i][1]}); 
                polyCoordinates.push({lat: martaDestCoord[j][0], lng: martaDestCoord[j][1]});             
                var markersLine = new google.maps.Polyline({     
                    path: polyCoordinates,
                    strokeColor: "#f77b0e",
                    strokeOpacity: 0.1,
                    strokeWeight: 2,
                    visible:true
                });
                markersLine.setMap(map);
                closeMarta.push(markersLine);
            }
        }
        $.get("http://18.188.214.33:8080/dist/walk/marta/walk?k=2&lat1=" + startMarker[0].getPosition().lat() + "&lng1=" + startMarker[0].getPosition().lng() + "&lat2=" + endMarker[0].getPosition().lat() + "&lng2=" + endMarker[0].getPosition().lng(), function(data){
            console.log(data[0].Coords);
            polyCoordinates = [];
            if(martaLine.length > 0){
                martaLine[0].setVisible(false);
                martaLine.length = 0;
            }
            for(let i = 0; i < data[0].Coords.length; i++){
                polyCoordinates.push({lat: data[0].Coords[i][0], lng: data[0].Coords[i][1]});
            }
            var markersLine = new google.maps.Polyline({     
                path: polyCoordinates,
                strokeColor: "#f77b0e",
                strokeOpacity: 1,
                strokeWeight: 2,
                visible:true
            });
            markersLine.setMap(map);
            martaLine.push(markersLine);
            barDomMarta.text("Walk to " + data[0].Stations[0] + " and take Marta to " + data[0].Stations[1] + ". The total distance of walking excluding taking Marta is " + data[0].TotalDist.toPrecision(2) + " meters.");
        });
    }
    var openedbar = true;
    $('#openbar').on("click", function() {
        if(openedbar) {
            openedbar = false;
            $('#openbar').text("<");
            $('#rightbar').css("width", "0%");
            $('#openbar').css("right", "0%");
        } else {
            openedbar = true;
            $('#openbar').text(">");
            $('#rightbar').css("width", "20%");
            $('#openbar').css("right", "20%");
        }
      });

});



