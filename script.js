// Edit the center point and zoom level
var map = L.map('map', {
  center: [41.76, -72.69],
  zoom: 12,
  zoomControl: false, // add later to reposition
  scrollWheelZoom: false
});

// create custom pane for town layer, set to display below overlay zIndex 400
map.createPane('towns');
map.getPane('towns').style.zIndex = 350;

map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/otl-redlining" target="_blank">sources and code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

L.control.scale().addTo(map);

new L.Control.GeoSearch({
				provider: new L.GeoSearch.Provider.Google(),
        position: 'topleft',
        // showMarker: true
        // retainZoomLevel: false
}).addTo(map);

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);

// town outline layer, with custom pane set to display at lower z-index
$.getJSON("src/ct-towns-simple.geojson", function (data) {
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'black',
        'weight': 2,
        fillOpacity: 0
      }
    },
    onEachFeature: function( feature, layer) {
      var popupText = "<b>" + feature.properties.town + "</b>";
      layer.bindPopup(popupText);
    },
    pane: 'towns'
  }).addTo(map);
});

// redlining polygons
$.getJSON("polygons.geojson", function (data) {
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      var fillColor,
        grade = feature.properties.grade;
      if (grade == "A") fillColor = "green";
      else if (grade == "B") fillColor = "blue";
      else if (grade == "C") fillColor = "yellow";
      else if (grade == "D") fillColor = "red";
      else fillColor = "gray"; // no data
      return {
        'color': 'black',
        'weight': 2,
        'fillColor': fillColor,
        'fillOpacity': 0.7
      }
    },
    onEachFeature: function( feature, layer) {
      var popupText = "<b>Area " + feature.properties.name + " - " + feature.properties.town + "</b><br />"
         + "<a href='https://jackdougherty.github.io/otl-redlining/pdf/" + feature.properties.name + ".pdf' target='_blank'>Neighborhood report (PDF in new tab)</a>";
      layer.bindPopup(popupText);
    }
  }).addTo(map);
});

// redlining points with default blue markers
$.getJSON("points.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var colors = {
        'A': 'green',
        'B': 'blue',
        'C': 'yellow',
        'D': 'red',
      }
      var mIcon = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: feature.properties.name,
        markerColor: colors[feature.properties.grade]
      });
      var marker = L.marker(latlng, {icon: mIcon});
      var popupText = "<b>Area " + feature.properties.name + " - " + feature.properties.town + "</b><br />"
         + "<a href='https://jackdougherty.github.io/otl-redlining/pdf/" + feature.properties.name + ".pdf' target='_blank'>Neighborhood report (PDF in new tab)</a>";
      marker.bindPopup(popupText);
      return marker;
    }
  }).addTo(map);
});

/*
// FIX NEEDED: display redlining points as numeric markers, but I have errors in my code below
 $.getJSON("points.geojson", function (data) {
   var geoJsonLayer = L.geoJson(data, {
       var marker = L.ExtraMarkers(latlng,{
         icon: 'fa-number',
         number: feature.properties.name,
         markerColor: 'blue'
       });
       marker.bindPopup(feature.properties.name);
       return marker;
     }
   }).addTo(map);
 });
*/
