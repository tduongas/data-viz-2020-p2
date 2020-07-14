// select the dropdown menu
var dropdownMenu = d3.select("#selDataset");

// select the panel body
var panel = d3.select("#sample-metadata");

// read in all of the data sources
Promise.all([
    d3.json("http://127.0.0.1:5000/api/v1.0/deaths"),
    d3.json("http://127.0.0.1:5000/api/v1.0/allCases"),
    d3.json("http://127.0.0.1:5000/api/v1.0/countyPopulation"),
    ]).then(function(files) {
        var deaths = files[0]
        var cases = files[1]
        var pop = files[2]

        console.log(cases)

    // add the county names to the drop-down menu
    pop.forEach(function(county) {
        var option = dropdownMenu.append("option");
        option.text(county.County_Name);
    });

    //format date to Month_day (zero padded Month_day of week) ex:July_04
    var formatTime = d3.timeFormat("%B_%d");

    // create variable to hold the counties and most recent number of cases
    var countyCases = cases.map(item => {
        // console.log(d)
        const updatedObject = {};
        Object.keys(item).forEach(key => {
            if (!key.includes("countyFIPS") && !key.includes("County_Name") && !key.includes("State") && !key
            .includes("stateFIPS")) {
                //update current key with the new key format(Month_day of week)
                updatedObject[formatTime(new Date(key))] = item[[key]];
            } else {
                //otherwise,key stays as is
                updatedObject[(key)] = item[[key]];
            }
        });
        return {
            county: item.County_Name,
            cases: updatedObject.July_05
        }
    });

    // create variable to hold the counties and most recent number of deaths
    var countyDeaths = deaths.map(item => {
        // console.log(d)
        const updatedObject = {};
        Object.keys(item).forEach(key => {
            if (!key.includes("countyFIPS") && !key.includes("County_Name") && !key.includes("State") && !key
            .includes("stateFIPS")) {
                //update current key with the new key format(Month_day of week)
                updatedObject[formatTime(new Date(key))] = item[[key]];
            } else {
                //otherwise,key stays as is
                updatedObject[(key)] = item[[key]];
            }
        });
        return {
            county: item.County_Name,
            deaths: updatedObject.July_05
        }
    });

    // console.log(countyDeaths)

    // identify the top 10 counties with the most cases
    // sort the cases in descending order
    var sortedCases = countyCases.sort(function (a,b) {
        return b.cases - a.cases
    });
    // console.log(sortedCases)

    // break out the top 10 counties, and split out the county name, number of cases, and number of deaths
    var mostCases = sortedCases.slice(0, 10)
    var mostCasesCounty = mostCases.map(d => d.county)
    var mostCasesNum = mostCases.map(d => d.cases)
    // console.log(mostCases)

    // loop through the countyDeaths array and pull out only the data for the counties that are in the top 10 list
    var topDeaths = []
    for (var i = 0; i < mostCasesCounty.length; i++) {
        // console.log("top 10 " + mostCasesCounty[i])
        for(var x = 0; x < countyDeaths.length; x++)
            if (countyDeaths[x].county.includes(mostCasesCounty[i])) {
                // console.log("County Death Names " + countyDeaths[x].county)
                topDeaths.push({"county": countyDeaths[x].county, "deaths": countyDeaths[x].deaths})
            }
    };

    // break the top deaths out into county name and number of deaths
    var topDeathsCounty = topDeaths.map(d => d.county)
    var topDeathsNum = topDeaths.map(d => d.deaths)

    console.log(topDeathsNum)

    var trace1 = {
        x: mostCasesCounty,
        y: mostCasesNum,
        name: 'Total Number of Cases',
        type: 'bar'
      };
      
      var trace2 = {
        x: topDeathsCounty,
        y: topDeathsNum,
        name: 'Number of Deaths',
        type: 'bar'
      };
      
      var data = [trace1, trace2];
      
      var layout = {barmode: 'stack'};
      
      Plotly.newPlot('bar', data, layout);

}).catch(function(error) {
    console.log(error);
});


