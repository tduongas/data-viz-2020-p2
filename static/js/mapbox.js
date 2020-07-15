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
var link = "static/data/GeoPlan_Public_and_Private_Schools_in_Florida_-_2017.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
    // Cluster Layer
    var markers = L.markerClusterGroup();
    // Creating a geoJSON layer with the retrieved data
    var geoJsonLayer = L.geoJson(data, {
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
    });

    // Add our marker cluster layer to the map
    markers.addLayer(geoJsonLayer);
    myMap.addLayer(markers);

    // Link to Florida_COVID19_Cases_by_County geojson
    var link2 = "static/data/Florida_COVID19_Cases_by_County.geojson";

    var geojson;

    // Grabbing our GeoJSON data..
    d3.json(link2, function(data) {

        // Create a new choropleth layer
        geojson = L.choropleth(data, {

            // Define what  property in the features to use
            valueProperty: "T_positive",

            // Set color scale
            scale: ["#ffffb2", "#b10026"],

            // Number of breaks in step range
            steps: 10,

            // "q" for quartile
            mode: "q",
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.6
            },

            // Binding a pop-up to each layer
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
                    },
                    // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                    click: function(event) {
                        myMap.fitBounds(event.target.getBounds());
                    }
                });
                layer.bindPopup("<h1>" + feature.properties.COUNTYNAME + 
                            "</h1> <hr> <h2>" + "<br>Positive Cases:<br>" + feature.properties.T_positive + 
                            "</h2>");

            }
        }).addTo(myMap);

        // Set up the legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = geojson.options.limits;
            var colors = geojson.options.colors;
            var labels = [];
        
            // Add min & max
            var legendInfo = "<p>Positive Cases</p>" +
                "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                "</div>";
        
            div.innerHTML = legendInfo;
        
            limits.forEach(function(limit, index) {
                labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
            });
        
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };

        // Adding legend to the map
        legend.addTo(myMap);
    });

});