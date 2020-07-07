// Creating map object
var myMap = L.map("map", {
    center: [27.6648, -81.5158],
    zoom: 7
  });

  // Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Use this link to get the geojson data.
var link = "GeoPlan_Public_and_Private_Schools_in_Florida_-_2017.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      // Style each feature
      style: function(feature) {
        return {
          color: "black",
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      // Call on each feature
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // Mouseover event function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // Mouseover event function, the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          }
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h1>" + feature.properties.NAME + 
                        "</h1> <hr> <h2>" + feature.properties.ADDRESS + 
                        "</h2> <hr> <h3>" + feature.properties.CITY +
                        "</h3> <hr> <h4>" + feature.properties.ZIPCODE +
                        "</h4> <hr> <h5>" + feature.properties.COUNTY +
                        "</h5> <hr> <h6>" + feature.properties.TYPE +
                        "</h5> <hr> <h6>" + feature.properties.OP_CLASS +
                        "</h6>");
  
      }
    }).addTo(myMap);
  });
  