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
        var features = [
            {
                position: new google.maps.LatLng( 33.766296339949854, -84.38751223293974),
                type: 'camera',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.788225, 120.998487),
                type: 'camera',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.788312, 120.997101),
                type: 'obstacle',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.789491, 120.995709),
                type: 'obstacle',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.787957, 120.998568),
                type: 'obstacle',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.789076, 120.998096),
                type: 'obstacle',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.789627, 120.994984),
                type: 'obstacle',
                content: 'close'
            },{
                position: new google.maps.LatLng(24.787800, 120.998509),
                type: 'obstacle',
                content: 'close'
            }/*,{
                position: new google.maps.LatLng(24.7887725, 120.9951233333334),
                type: 'dog1'
            },{
                position: new google.maps.LatLng(24.7878311, 120.9943021),
                type: 'dog2'
            },{
                position: new google.maps.LatLng(24.7879711, 120.9931021),
                type: 'cat1'
            },{
                position: new google.maps.LatLng(24.7876111, 120.9913021),
                type: 'cat2'
            },*/
        ];
        

    var ajaxInit = new XMLHttpRequest();
    var url = "ATLBicycle_Share.geojson";
    ajaxInit.open("GET", url, true); // True for sync
    ajaxInit.setRequestHeader("content-type","application/json");
    ajaxInit.onreadystatechange = function(){
        if(ajaxInit.readyState == 4 && ajaxInit.status == 200)
            var atlbikeJson = JSON.parse(ajaxInit.responseText);
        processData(atlbikeJson, "camera");
    }   
    ajaxInit.send(null);

    var ajaxInit2 = new XMLHttpRequest();
    var url2 = "MartaStations.geojson";
    ajaxInit2.open("GET", url2, true); // True for sync
    ajaxInit2.setRequestHeader("content-type","application/json");
    ajaxInit2.onreadystatechange = function(){
        if(ajaxInit2.readyState == 4 && ajaxInit2.status == 200)
            var martaJson = JSON.parse(ajaxInit2.responseText);
        processData(martaJson, "obstacle");
        addListenertoObstacle();

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
                var marker = new google.maps.Marker({
                    position:  new google.maps.LatLng(stations[i].geometry.coordinates[1], stations[i].geometry.coordinates[0]),
                    icon: icons[type].icon,
                    map: map,
                    title: type,
                    content: stations[i].properties.STATION,
                    visible: false
                });
                markers.push(marker);
            }
            else{
                s_name = stations[i].properties.STATION_NAME;
                var marker = new google.maps.Marker({
                    position:  new google.maps.LatLng(stations[i].geometry.coordinates[1], stations[i].geometry.coordinates[0]),
                    icon: icons[type].icon,
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
                getClosetBikeStation(startMarker[0]);
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
        function addIcon(lat, lng,icon_ ,title, URL)
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
                var marker = new google.maps.Marker({
                    icon: icon_,
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
               
                return;
            }
            if(title == 'end' && !($('#end_add').hasClass('clickClass')))
              return;
            if(title == 'end' && ($('#end_add').hasClass('clickClass'))){
                var marker = new google.maps.Marker({
                    icon: icon_,
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
                console.log(markers[i].content);
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
    
    function getClosetBikeStation(marker){
                
        let ajaxInit = new XMLHttpRequest();
        let url = "http://18.188.214.33:8080/dist/origin/bike?k=3&lat=33.76147456195493&lng=-84.36572268184585";
        ajaxInit.open("GET", url, true); // True for sync
        ajaxInit.setRequestHeader("content-type","application/json");
        ajaxInit.onreadystatechange = function(){
        if(ajaxInit.readyState == 4 && ajaxInit.status == 200)
            var bikeStationJson = JSON.parse(ajaxInit.responseText);
        console.log(bikeStationJson);
    }   
    ajaxInit.send(null);
}
});



