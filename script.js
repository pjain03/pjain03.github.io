var myLat=0;
var myLng=0;
var me= new google.maps.LatLng(myLat, myLng);
var myOptions = {
    zoom: 13,
    center: me
};
var map;
var marker;
var infoWindow= new google.maps.InfoWindow();
var names;
var lat;
var lng;
var request= new XMLHttpRequest();
var schedule= null;
var stationPosition= new Array(22);
var infoWindowStations= new Array(22);
var stations= {
    names: ["Alewife", "Davis", "Porter Square", "Harvard Square", "Central Square", "Kendall/MIT", 
    "Charles/MGH", "Park Street", "Downtown Crossing", "South Station", "Broadway", "Andrew", "JFK/UMass", 
    "North Quincy", "Wollaston", "Quincy Center", "Quincy Adams", "Braintree", "Savin Hill",
    "Fields Corner", "Shawmut", "Ashmont"],
    lat: [42.395428, 42.39674, 42.3884, 42.373362, 42.365486, 42.36249079, 42.361166, 42.35639457,
    42.355518, 42.352271, 42.342622, 42.330154, 42.320685, 42.275275, 42.2665139, 42.251809, 42.233391,
    42.2078543, 42.31129, 42.300093, 42.29312583, 42.284652],
    lng: [-71.142483, -71.121815, -71.11914899999999, -71.118956, -71.103802, -71.08617653, -71.070628, 
    -71.0624242, -71.060225, -71.05524200000001, -71.056967, -71.057655, -71.052391, -71.029583, -71.0203369,
    -71.005409, -71.007153, -71.0011385, -71.053331, -71.061667, -71.06573796000001, -71.06448899999999]
};
var stationMarker;
var stationInfoWindow;

function init(){
    map= new google.maps.Map(document.getElementById('map'), myOptions);
    processRequest();
    getLocation();
};    

function processRequest(){
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200){
            schedule= request.responseText;
            schedule= JSON.parse(schedule);
        } 
        else if(request.readyState === XMLHttpRequest.DONE && request.status === 404){
            processRequest();
        }
    };
    request.open("get", "https://serene-wildwood-36147.herokuapp.com/redline.json");
    request.send();
};

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            myLat= position.coords.latitude;
            myLng= position.coords.longitude;
            renderMap();
        });
    }
    else
        alert("Browser doesn't support Geolocation");
};

function renderMap(){
    me= new google.maps.LatLng(myLat, myLng);
    map.panTo(me);
    marker= new google.maps.Marker({
        position: me,
        map: map,
        title: "Your Current Position",
        animation: google.maps.Animation.DROP
    });
    markStations();
    markPaths();
    checkClick();
};

function markStations(){
    stationMarker= new Array(stations.names.length);
    for(var n= 0; n < stations.names.length; n++){
        stationPosition[n]= new google.maps.LatLng(stations.lat[n], 
            stations.lng[n]);
        stationMarker[n]= new google.maps.Marker({
            position: stationPosition[n],
            map: map,
            title: stations.names[n],
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: '#0000ff',
                strokeWeight: 2
            }
        });
    };
};

function markPaths(){
    var stationPositionPath= new Array(3);
    stationPositionPath[0]= new Array(13);
    stationPositionPath[1]= new Array(6);
    stationPositionPath[2]= new Array(5);
    var paths= new Array(3);

    for(var n= 0; n < stationPositionPath[0].length; n++){
        stationPositionPath[0][n]= stationPosition[n];
    };
    for(var n= 0; n < stationPositionPath[1].length; n++){
        stationPositionPath[1][n]= stationPosition[12+n];
    };
    stationPositionPath[2][0] = stationPosition[12];
    for(var n= 1; n < stationPositionPath[2].length; n++){
        stationPositionPath[2][n] = stationPosition[17+n];
    };
    for(var n= 0; n < paths.length; n++){
        paths[n]= new google.maps.Polyline({
        path: stationPositionPath[n],
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
    };
};

function checkClick(){
    for(var n= 0; n < stations.names.length; n++){
        infoWindowStations[n]= new google.maps.InfoWindow({
            content: stations.names[n] 
        });
    };
    marker.addListener('click', function(){
        closeAll();
        infoWindowStationsInit(); 
        smallestDistance();
    });
    stationMarkerIWSetup();
};

function stationMarkerIWSetup(){
    for(var n= 0; n < stations.names.length; n++){
        setUpInfoWindow(stationMarker[n], infoWindowStations[n]);
    };
};

function closeAll(){   
    infoWindow.close();
    for(var n= 0; n < stations.names.length; n++){
        infoWindowStations[n].close();
    };  
};

function infoWindowStationsInit(){
    for(var n= 0; n < stations.names.length; n++){
        infoWindowStations[n].setContent(stations.names[n]);
    };
};

function updateDetails(i){
    processRequest();
    var limit= schedule.TripList.Trips.length;
    var update= "<u>Trains Passing through " + i +":</u><br/>";
    for(var n= 0; n < limit; n++){
        var limitPred= schedule.TripList.Trips[n].Predictions.length;
        var flag= false;
        var pred= " ";
        for(var o= 0; o < limitPred; o++){
            if(i === schedule.TripList.Trips[n].Predictions[o].Stop){
                pred+= schedule.TripList.Trips[n].Predictions[o].Stop + ", in " +
                    schedule.TripList.Trips[n].Predictions[o].Seconds + " seconds <br/>";
                flag= true;
            }
        };
        if(flag){
            update+= "Final Destination is " + schedule.TripList.Trips[n].Destination + ": <br/>" + pred + "<br/>";
        }
        flag= false;
    };
    return update;
};

function setUpInfoWindow(smarker, sinfoWindow){
    smarker.addListener('click', function(){
        closeAll();
        infoWindowStationsInit(); 
        updatedContent= updateDetails(sinfoWindow.content);
        sinfoWindow.setContent(updatedContent);
        sinfoWindow.open(map, smarker);
    });
};

function smallestDistance(){
    var smallestDist= google.maps.geometry.spherical.computeDistanceBetween(
        me,stationPosition[0]);
    var smallestDistPos= 0;
    for(var n= 1; n < stationPosition.length; n++){
        var dist= google.maps.geometry.spherical.computeDistanceBetween(
            me, stationPosition[n]);
        if(dist < smallestDist){
            smallestDist= dist;
            smallestDistPos= n;
        };
    };
    smallestDist*= 0.000621371;
    renderInfoWindow(smallestDist, smallestDistPos);
    renderPolyline(smallestDistPos);
};

function renderInfoWindow(smallestDist, smallestDistPos){
    infoWindow= new google.maps.InfoWindow({
        content: "Closest station to you is " + 
            stations.names[smallestDistPos] + 
            ". Distance from you is " + smallestDist + " miles."
    });
    infoWindow.open(map, marker);
};

function renderPolyline(smallestDistPos){
    var shortestPath= new google.maps.Polyline({
        path: [me, stationPosition[smallestDistPos]],
        strokeColor: '#00ff00',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
};