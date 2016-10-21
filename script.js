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
    infoWindow= new google.maps.InfoWindow();
    marker.addListener('click', function(){
        infoWindow.open(map, marker);
    });
};
