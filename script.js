var myLat=0;
var myLng=0;
var me= new google.maps.LatLng(myLat, myLng);
var myOptions = {
    zoom: 13,
    center: me
};
var map;
var marker;
var infoWindow;
var names;
var lat;
var lng;
var image= './icon.png';
var stationPosition= new Array(22);
var stations= {
    names: ["South Station", "Andrew", "Porter Square", "Harvard Square", "JFK/UMass", "Savin Hill", 
    "Park Street", "Broadway", "North Quincy", "Shawmut", "Davis", "Alewife", "Kendall/MIT", 
    "Charles/MGH", "Downtown Crossing", "Quincy Center", "Quincy Adams", "Ashmont", "Wollaston",
    "Fields Corner", "Central Square", "Braintree"],
    lat: [42.352271, 42.330154, 42.3884, 42.373362, 42.320685, 42.31129, 42.35639457, 42.342622,
        42.275275, 42.29312583, 42.39674, 42.395428, 42.36249079, 42.361166, 42.355518, 42.251809,
        42.233391, 42.284652, 42.2665139, 42.300093, 42.365486, 42.2078543],
    lng: [-71.05524200000001, -71.057655, -71.11914899999999, -71.118956, -71.052391, -71.053331,
        -71.0624242, -71.056967, -71.029583, -71.06573796000001, -71.121815, -71.142483, -71.08617653,
        -71.070628, -71.060225, -71.005409, -71.007153, -71.06448899999999, -71.0203369, -71.061667, 
        -71.103802, -71.0011385]
};
var stationMarker;
var stationInfoWindow;

function init(){
    map= new google.maps.Map(document.getElementById('map'), myOptions);
    getLocation();
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
    infoWindow= new google.maps.InfoWindow({
        content: marker.title
    });
    marker.addListener('click', function(){
        infoWindow.open(map, marker);
    });
    markStations();
};

function markStations(){
    stationMarker= new Array(stations.names.length);
    stationInfoWindow= new Array(stations.names.length);
    for(var n= 0; n < stations.names.length; n++){
        stationPosition[n]= new google.maps.LatLng(stations.lat[n], 
            stations.lng[n]);
        stationMarker[n]= new google.maps.Marker({
            position: stationPosition[n],
            map: map,
            title: stations.names[n],
            icon: image
        });
        stationInfoWindow[n]= new google.maps.InfoWindow({
            content: stationMarker[n].title
        });
        stationMarker[n].addListener('click', function(){
            stationInfoWindow[n].open(map, stationMarker[n]);
        });
    };
    markPaths();
};

function markPaths(){
    var paths= new google.maps.Polyline({
        path: stationPosition,
        geodesic: true,
        strokeColor: 'red',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
};