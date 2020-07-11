// select the dropdown menu
var dropdownMenu = d3.select("#selDataset");

// select the panel body
var panel = d3.select("#sample-metadata");

var parseDate = d3.timeParse("%m/%d/%Y");
var formatDate = d3.timeFormat("%m/%d/%Y");

// read in all of the data sources
Promise.all([
    d3.json("http://127.0.0.1:5000/api/v1.0/deaths"),
    d3.csv("AllCases_FL.csv"),
    d3.csv("CountyPopulation.csv"),
    ]).then(function(files) {
        var deaths = files[0]
        var cases = files[1]
        var pop = files[2]

        console.log(deaths)

    // add the county names to the drop-down menu
    deaths.forEach(function(county) {
        var option = dropdownMenu.append("option");
        option.text(county.County_Name);
    });

    // create variable to hold all of the county names
    var countyCases = cases.map(function(d, i) {
        
        return {
            county: d.County_Name,
            cases: d.date
        }
    });

    console.log(countyCases)
    

    var trace1 = {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23],
        name: 'SF Zoo',
        type: 'bar'
      };
      
      var trace2 = {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [12, 18, 29],
        name: 'LA Zoo',
        type: 'bar'
      };
      
      var data = [trace1, trace2];
      
      var layout = {barmode: 'stack'};
      
      Plotly.newPlot('bar', data, layout);

    // create the event handler for when a county name is selected
    dropdownMenu.on("click", updatePlots);

    // define the function to update the plots after the county is selected
    function updatePlots() {
        // pull the selected county name from the drop-down
        var inputValue = dropdownMenu.property("value");
        console.log(inputValue)

    
    };
});


