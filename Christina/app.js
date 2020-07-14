// select the dropdown menu 
var dropdownMenu = d3.select("#selDataset");

// read in all of the data sources
Promise.all([
    d3.csv("Deaths_FL.csv"),
    d3.csv("AllCases_FL.csv"),
    d3.csv("Florida_COVID19_Cases_by_County.csv"),
    ]).then(function(files) {
        var deaths = files[0]
        var cases = files[1]
        var ages = files[2]



    // FILL IN THE DROP-DOWN MENU
    // -----------------------------
    // Use the Cases file to populate the items in the drop-down menu
    cases.forEach(function(county) {
        var option = dropdownMenu.append("option");
        option.text(county.County_Name);
    });



    // PULL THE DATA WE NEED FROM EACH OF THE DATA SOURCES
    // -----------------------------
    // Create a variable to format date to Month_day (zero padded Month_day of week) ex:July_04
    var formatTime = d3.timeFormat("%B_%d");

    // Create an array to hold the counties and most recent number of cases
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

    // Create an array to hold the counties and most recent number of deaths
    var countyDeaths = deaths.map(item => {
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

    // Create an array to hold the counties and the number of cases in each age range
    var ageCases = ages.map(item => {
        return {
            county: item.County_1,
            age_0_4: item.Age_0_4,
            age_5_14: item.Age_5_14,
            age_15_24: item.Age_15_24,
            age_25_34: item.Age_25_34,
            age_35_44: item.Age_35_44,
            age_45_54: item.Age_45_54,
            age_55_64: item.Age_55_64,
            age_65_74: item.Age_65_74,
            age_75_84: item.Age_75_84,
            age_85plus: item.Age_85plus,
            age_Unkn: item.Age_Unkn
        }
    });
    


    // IDENTIFY THE TOP 10 COUNTIES WITH THE MOST CASES, CREATE VARIABLES TO HOLD THE DATA FOR THOSE COUNTIES
    // -----------------------------
    // Sort the cases in descending order
    var sortedCases = countyCases.sort(function (a,b) {
        return b.cases - a.cases
    });
    var allCounties = sortedCases.map(d => d.county)

    // break out the top 10 counties, and split out the county name, number of cases, and number of deaths
    var mostCases = sortedCases.slice(0, 10)
    var mostCasesCounty = mostCases.map(d => d.county)
    var mostCasesNum = mostCases.map(d => d.cases)

    // loop through the countyDeaths array and pull out only the data for the counties that are in the top 10 list of counties with most cases overall
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

    // Create the stacked bar plot that shows the number of cases and deaths in the top 10 counties
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
    Plotly.newPlot('stacked-bar', data, layout);



    // CREATE THE CASES/DEATHS CHART AND INITIALIZE IT WITH DATA
    // -----------------------------
    // Pull the value from the dropdown menu
    var initalValue = dropdownMenu.property("value"); 

    // Create a function to use when filtering the data by the selected county
    var initialCounty = function filteredCounty (county) {
        return county.county == initalValue;
    };

    // Filter the cases by the initial county
    var initCases = countyCases.filter(initialCounty);
    var initCaseName = initCases.map(d => d.county)
    var initCaseNum = initCases.map(d => d.cases)

    // Filter the deaths by the initial county
    var initDeaths = countyDeaths.filter(initialCounty);
    var initDeathsName = initDeaths.map(d => d.county)
    var initDeathsNum = initDeaths.map(d => d.deaths)

    // Initialize the Cases/Deaths bar chart
    function initCaseDeath () {
        var data = [
            {
            x: initCaseName,
            y: initCaseNum,
            name: 'Number of Cases',
            type: 'bar'
            }, 
            {
            x: initDeathsName,
            y: initDeathsNum,
            name: 'Number of Deaths',
            type: 'bar'
            }];

        var layout = {barmode: 'group'};
        Plotly.newPlot('case-death-bar', data, layout);
    };

    // console.log(allCounties[1])

    // CREATE THE AGES CHART AND INITIALIZE IT WITH DATA
    // -----------------------------
    // 
    // var initCounty = function ageFilter () {
        for (var x = 0; x < allCounties.length; x++) {
            // console.log("All counties " + allCounties[i])
            for(var i = 0; i < ageCases.length; i++)
                if (allCounties[x].contains(ageCases[i].county)) {
                    // console.log("County Death Names " + countyDeaths[x].county)
                    var initCounty =  allCounties[x]
                }
        };    
    // };
    console.log(initCounty)

    // Filter the ages by the initial county
    // var initAges = ageCases.filter(initialCounty);
    // var initCaseName = initCases.map(d => d.county)
    // var initCaseNum = initCases.map(d => d.cases)
    // var initDeaths = countyDeaths.filter(initialCounty);
    // var initDeathsName = initDeaths.map(d => d.county)
    // var initDeathsNum = initDeaths.map(d => d.deaths)

    // initialize the Ages bar chart
    var data = [
        {
          x: ["Age 0-4", "Age 5-14", "Age 15-24", "Age 25-34", "Age 35-44", "Age 45-54", "Age 55-64", "Age 65-74", "Age 75-84", "Age 85+", "Age Unknown"],
          y: [20, 14, 23],
          type: 'bar'
        }
    ];
      
    Plotly.newPlot('age-bar', data);



    // UPDATE THE PLOTS WHEN A NEW COUNTY IS SELECTED FROM THE DROP-DOWN MENU
    // -----------------------------
    // direct the dropdown menu to the updatePlots function when clicked
    dropdownMenu.on("click", updatePlots);
    
    // create the function that will update the charts based on the county selected in the drop-down
    function updatePlots () {
        var inputValue = dropdownMenu.property("value");
        console.log(inputValue) 

        // create a function to use when filtering the data by the selected county
        var selectedCounty = function filteredCounty (county) {
            return county.county == inputValue;
        };

        // filter the cases by the selected county
        var selectedCases = countyCases.filter(selectedCounty);
        // console.log(selectedCases)
        var selectCaseName = selectedCases.map(d => d.county)
        var selectCaseNum = selectedCases.map(d => d.cases)

        // filter the deaths by the selected county
        var selectedDeaths = countyDeaths.filter(selectedCounty);
        // console.log(selectedDeaths)
        var selectDeathsName = selectedDeaths.map(d => d.county)
        var selectDeathsNum = selectedDeaths.map(d => d.deaths)

        var newData = [
            {
            x: selectCaseName,
            y: selectCaseNum,
            }, 
            {
            x: selectDeathsName,
            y: selectDeathsNum,
            }
        ];
        Plotly.restyle("case-death-bar", newData);
    }
// }).catch(function(error) {
//     console.log(error);
initCaseDeath ()
});

