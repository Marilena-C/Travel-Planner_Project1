
$(function(){
    var str = '#len'; //increment by 1 up to 1-nelemnts
    $(document).ready(function(){
      var i, stop;
      i = 1;
      stop = 4; //num elements
      setInterval(function(){
        if (i > stop){
          return;
        }
        $('#len'+(i++)).toggleClass('bounce');
      }, 500)
    });
  });

 // Global id selectors for element
 var todayWhetherContEl = $('#today')
var firstForecastCont = $('#forecast-1')
var secForecastCont = $('#forecast-2')
var trdForecastCont = $('#forecast-3')

// // Form inputs grabs
$('#form').on('submit', function(event) {
    event.preventDefault()
    var cityFrom = $('#from').val()
    var cityTo = $('#to').val()
    var waysInput = $('#ways').val()
    var peopleInput = $('#people').val()
    var transportInput = $('#transport').val().trim().split(" ")
    var titleInput = $('#title').val()

    console.log(cityFrom,cityTo)
    console.log(waysInput,peopleInput, transportInput)


    // const data = { username: 'example' };
    var data = {from:cityFrom,
        to:cityTo,
        ways:waysInput,
        people:peopleInput,
        language:"en",
        title:titleInput,
        transport_types:transportInput
    }
    

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'f72fd1513cmshccbbe39f6137af5p1ba8a9jsn6de3b4413c0d',
            'X-RapidAPI-Host': 'travel-co2-climate-carbon-emissions.p.rapidapi.com'
        },
        // body: '{"from":"Berlin, Germany","to":"Stockholm, Sweden","ways":2,"people":2,"language":"en","title":"Comparing flying and public transport from Berlin to Stockholm.","transport_types":["flying","public-transport","driving"]}' 
        body: JSON.stringify(data) 
    };

    fetch('https://travel-co2-climate-carbon-emissions.p.rapidapi.com/api/v1/simpletrips', options)
        .then(response => response.json())
        .then(response => {console.log(response)
            console.log("CO2 Emission (Flight) = "+response.trips[0].co2e)
            console.log("CO2 Emission (Flight) = "+response.trips[0].steps[0].transport.type)
            // console.log("CO2 Emission (Public Transport) = "+response.trips[1].co2e)
            // remove dashboard animation
            $('#dashboard-anim').hide()

            $('#emissionData').html(
                `<p class="dataTitle"> CO2 Emission (${response.trips[0].steps[0].transport.type})
                <p class ="mainTextToformat" data-value="${response.trips[0].co2e}"> => ${response.trips[0].co2e} kg</p>`
                )
            
            // sendToLocal()
            // renderSearchHistoryBar()
            //  MODIFICATION STARTS HERE!!!!
            var searchId = `${$('#from').val().trim()} to ${$('#to').val().trim()} | ${$('#transport').val().trim()}: Journey of ${$('#people').val()} person(s) for ${$('#ways').val()} trip(s)`
            sendToLocal();
            renderSearchHistoryBar();
            printWeatherForecast(response)
            // outerContentCont.html(
            // `<div class="card card-body">
            //     <p>CO2 Emission (Transport) = ${sumOfTransport} kg</p>
            //     <p>CO2 Emission (accommodation) = ${sumOfAccomodation} kg</p>
            //                     ---------------------------
            //     <p>CO2 Emission (TOTAL) = ${response.trips[0].co2e} kg</p>
            //     <p>CO2 Emission (TOTAL) = ${sumOfTransport+sumOfAccomodation} kg</p>
            // </div>`
            // )


        
            // Function to send to Local storage
            function sendToLocal() {
                // var arrayUpdating = JSON.parse(localStorage.getItem("searchHistory")) || []
                var localStoObjectItem = {
                    emissionData: $('#emissionData').html().trim(),
                    locationFrom: $('#from').val(),
                    locationTo: $('#to').val(),
                    transportType: $('#transport').val(),
                    numOfpeopleTrans: $('#people').val(),
                    numOfWays: $('#ways').val().trim()
                }
                // arrayUpdating.push(localStoObjectItem)
                
                localStorage.setItem(searchId, JSON.stringify(localStoObjectItem))
                // localStorage.setItem('searchHistory',JSON.stringify(localStoObjectItem))

            }



            // function to render search history unto page
            function renderSearchHistoryBar() {
                var getHistoryObj = JSON.parse(localStorage.getItem(searchId)) || []
                console.log(getHistoryObj)
                // sort array of objects by CO2 estimate
                // var byCarbonValue = getHistoryObj.slice(0);
                // byCarbonValue.sort(function(a,b) {

                //     return a.emissionData.children().eq(1).attr("data-value") - b.emissionData.children().eq(1).attr("data-value")   ////attributte value
                // })
                // var searchId = `${$('#from').val().trim()} to ${$('#to').val().trim()} | ${$('#transport').val().trim()}: Journey of ${$('#people').val()} person(s) for ${$('#ways').text()} trip`
                var newBtn = $('<button>').text(`${getHistoryObj.locationFrom} to ${getHistoryObj.locationTo} | ${getHistoryObj.transportType}: Journey of ${getHistoryObj.numOfpeopleTrans} person(s) for ${getHistoryObj.numOfWays} trip(s)`).addClass("btn-block btn-outline-success btn-render-form-2 active").attr("aria-pressed","true")
                $('#history').append(newBtn);



                // Create new btn element and append
                // getHistoryObj.forEach(function(objParam) {
                //     var newBtn = $('<button>').text(`${objParam.locationFrom} => ${objParam.locationTo}:`)
                //     $('#history').append(newBtn);
                // })



                
            }
            
            




        })
        .catch(err => console.error(err));


})

{/* <p>CO2 Emission (Public Transport) = ${response.trips[1].co2e} kg</p>
<p>CO2 Emission (driving) = ${response.trips[2].co2e} kg</p> */}


// Intra city emission estimation
// FORM inputs grab
$('#form-2').on('submit', function(event) {
    event.preventDefault()
    var startLocation = $('#placename-1').val().trim()
    var endLocation = $('#placename-2').val().trim()
    var typeOfTransport = $('#trans-type').val().trim()
    var numWays = $('#trans-ways').val().trim()
    var numOfPeopleInTransit = $('#trans-people').val().trim()
    var typeOfAccomodation = $('#acco-type').val().trim()
    var numOfNightsInAccom = $('#acco-night').val().trim()
    var numOfPeopleInAccom = $('#acco-people').val().trim()
    console.log(startLocation)

    var data1 = {
        trips: [
            {
                steps: [
                    {
                        discovery: true,
                        location: {
                            placename: startLocation
                        },
                        transport: {
                            type: typeOfTransport,
                            ways: numWays,
                            people: numOfPeopleInTransit,
                            vehicle: {
                                type: "car-large",
                                fuel: {
                                    "type": "gasoline"
                                }
                            }
                        }
                    },
                    {
                        discovery: true,
                        location: {
                            placename: endLocation
                        },
                        accommodation: {
                            type: typeOfAccomodation,
                            nights: numOfNightsInAccom,
                            people: numOfPeopleInAccom
                        }
                    }
                ]
            }
        ],
        save: false,
        language: "en"
    }

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer {YOUR_API_KEY}',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-RapidAPI-Key': '6de818783cmsh58e607b66aa2a55p186051jsn8a1383893f77',
            'X-RapidAPI-Host': 'travel-co2-climate-carbon-emissions.p.rapidapi.com'
        },
        body: JSON.stringify(data1)
    };

    fetch('https://travel-co2-climate-carbon-emissions.p.rapidapi.com/api/v1/trips', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            // remove dashboard animation
            $('#dashboard-anim').hide()

            arrayOfSteps = response.trips[0].steps
            var sumOfTransport = 0
            var sumOfAccomodation = 0
            for (var i = 0; i < arrayOfSteps.length; i++) {
                if (arrayOfSteps[i].transport !=null) {
                    sumOfTransport = sumOfTransport + arrayOfSteps[i].transport.co2e
                }
                if (arrayOfSteps[i].accommodation !=null) {
                    sumOfAccomodation = sumOfAccomodation + arrayOfSteps[i].accommodation.co2e
                }
            }

            $('#emissionData').html(
                `<p class="dataTitle">CO2 Emission (Total)</p>
                 <p class="mainTextToformat" data-value="${response.trips[0].co2e.toFixed(2)}">=> ${response.trips[0].co2e.toFixed(2)} kg</p>`

            )
            var collapseIcon = $('<p class="float-right", style="position:relative; bottom:40px;">').append('<a class="btn btn-primary" data-toggle="collapse" href="#collapseIcon" role="button" aria-expanded="false" aria-controls="collapseExample">+</a>')
            $('#emissionData').append(collapseIcon)
            // var outerContentCont = $("<div>").attr({class:"collapse", id:"collapseIcon" })
            $('#SmallcollapseText').html(
                `<p>CO2 Emission (Transport) = ${sumOfTransport} kg</p>
                <p>CO2 Emission (accommodation) = ${sumOfAccomodation} kg</p>`
            )
            // remove prev weather data on screen
            // $('#today').empty()
            // $('.forecast-box').text('')
            printWeatherForecast(response);   // I removed from here
            // // var searchId = `${$('#placename-1').val().trim()} +${$('#placename-2').val().trim()} +${$('#trans-type').val().trim()} +${$('#acco-type').val().trim()} +${$('#trans-people').val()} +${$('#acco-people').val()} +${$('#acco-night').val()}`
            var searchId = `${$('#placename-1').val().trim()} to ${$('#placename-2').val().trim()} | ${$('#trans-type').val().trim()}: Journey of ${$('#trans-people').val()} person(s) for ${$('#acco-night').val()} nights in a ${$('#acco-type').val().trim()}`
            
            

            
            sendToLocal();
            renderSearchHistoryBar();
            
            // Function to send to Local storage
            function sendToLocal() {
                // var arrayUpdating = JSON.parse(localStorage.getItem("searchHistory")) || []
                var localStoObjectItem = {
                    emissionData: $('#emissionData').html().trim(),
                    locationFrom: $('#placename-1').val(),
                    locationTo: $('#placename-2').val(),
                    transportType: $('#trans-type').val(),
                    accoType: $('#acco-type').val(),
                    numOfpeopleTrans: $('#trans-people').val(),
                    numOfpeopleAcco: $('#acco-people').val(),
                    numOfnights: $('#acco-night').val(),
                    smallTextinCollapsebtn: $('#SmallcollapseText').html().trim(),    ///edit start hers
                    current: $('#today').html().trim(),
                    first: $('#forecast-1').html().trim(),
                    second: $('#forecast-2').html().trim(),
                    third: $('#forecast-3').html().trim()
                    // fouth: fthForecastCont.html().trim(),
                    // fifth: fifthForecastCont.html().trim()
                }
                // arrayUpdating.push(localStoObjectItem)
                
                localStorage.setItem(searchId, JSON.stringify(localStoObjectItem))
                // localStorage.setItem('searchHistory',JSON.stringify(localStoObjectItem))

            }



            // function to render search history unto page
            function renderSearchHistoryBar() {
                var getHistoryObj = JSON.parse(localStorage.getItem(searchId)) || []
                console.log(getHistoryObj)
                // sort array of objects by CO2 estimate
                // var byCarbonValue = getHistoryObj.slice(0);
                // byCarbonValue.sort(function(a,b) {

                //     return a.emissionData.children().eq(1).attr("data-value") - b.emissionData.children().eq(1).attr("data-value")   ////attributte value
                // })
                var newBtn = $('<button>').text(`${getHistoryObj.locationFrom} to ${getHistoryObj.locationTo} | ${getHistoryObj.transportType}: Journey of ${getHistoryObj.numOfpeopleTrans} person(s) for ${getHistoryObj.numOfnights} nights in a ${getHistoryObj.accoType}`).addClass("btn-block btn-outline-success btn-render-form-2 active").attr("aria-pressed","true")
                $('#history').append(newBtn);



                // Create new btn element and append
                // getHistoryObj.forEach(function(objParam) {
                //     var newBtn = $('<button>').text(`${objParam.locationFrom} => ${objParam.locationTo}:`)
                //     $('#history').append(newBtn);
                // })



                
            }
        })
        .catch(err => console.error(err));
    // put your send to local here
    
})


// var contForEmissionData = $('#emissionData')
// function that re-renders searched info on click of the search history buttons 
$('#history').on('click', '.btn-render-form-2', function(){
    // clear dashboard screen
    // $('#today').empty()
    // $('.forecast-box').html('')

    console.log("I'm working")
    
    var fromLocal = JSON.parse(localStorage.getItem($(this).text())) || []
    // append the dashboard elements 
    $('#emissionData').html(fromLocal.emissionData);
    $('#SmallcollapseText').html(fromLocal.smallTextinCollapsebtn)
    todayWhetherContEl.html(fromLocal.current)
    firstForecastCont.html(fromLocal.first)
    secForecastCont.html(fromLocal.second)
    trdForecastCont.html(fromLocal.third)
    

})



// function for printing weather forecast for destination city
function printWeatherForecast (travelAPIresponse) {
    // grab long and latitude from the object
         //rmove previous render
    // construct an ajax reaquest to open waether API
    var cityLongitude = travelAPIresponse.trips[0].steps[1].location.longitude
    var cityLatitude = travelAPIresponse.trips[0].steps[1].location.latitude

    console.log(cityLatitude, cityLongitude)   //////
    // constructing a GET request to openweather API
    var unit = "metric"
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLatitude + "&lon="+ cityLongitude + "&units="+ unit + "&appid=6ba0b25bc07a2f8bbcb23b35a7bf0c21"    

    
    // An asynchronous fetch call
    // async function doRequest() {
    //     let url = queryURL2;
    //     let res = await fetch(url);

    //     if (res.ok) {

    //         let text = await res.json();

    //         return text;
    //     } else {
    //         return `HTTP error: ${res.status}`;
    //     }
    // }
    // doRequest().then()
    
    
    
    $.ajax({
        url:queryURL2,
        method: 'GET'
    }).then(function(result) {
        console.log(result)

        // $('#today').removeClass('hide')
        // $('#forecast').removeClass('hide')
        // $('#forecastHeading').removeClass('hide')
        // Today's weather data
        var arrayOfData = result.list  //array of useful data
    

        var baseDtTxt = arrayOfData[0].dt_txt
        console.log("base = "+baseDtTxt)

    
        var date = baseDtTxt.split(" ")[0]
        var time = baseDtTxt.split(" ")[1]
   
        var formatTime = moment(time, 'HH:mm:ss').add(3,'d').subtract(3, 'h').toString()   //change 5 to 4

        var lastTime = formatTime.split(' ')[4]
    
        console.log(lastTime)
    
        var nameOfcity = result.city.name
        console.log(arrayOfData)
        console.log(moment().add(3, 'd').format('YYYY-MM-DD'))

       



        for (var i = 0; i < arrayOfData.length; i++) {
            if (arrayOfData[i].dt_txt == moment(date).add(0,'d').format('YYYY-MM-DD') + ` ${time}`) {
                var item = arrayOfData[0]
                displayTodayData(item, nameOfcity,todayWhetherContEl,0)
            }

            if (arrayOfData[i].dt_txt == moment(date).add(1,'d').format('YYYY-MM-DD') + ` ${time}`) {
                console.log("This is the 1st day forecast")
                var item = arrayOfData[i]
                displaythisData(item, nameOfcity,firstForecastCont,1)
            
            }

            if (arrayOfData[i].dt_txt == moment(date).add(2,'d').format('YYYY-MM-DD') + ` ${time}`) {
                console.log("This is the 2nd day forecast")
                var item = arrayOfData[i]
                displaythisData(item, nameOfcity,secForecastCont,2)
            
            }

            if (arrayOfData[i].dt_txt == moment(date).add(3,'d').format('YYYY-MM-DD') + ` ${lastTime}`) {
                console.log("This is the 3rd day forecast")
                var item = arrayOfData[i]
                displaythisData(item, nameOfcity,trdForecastCont,3)
            
            }

             
        }

        // Append dynamically new button unto the history div and send to client local storage
        // send to local from here

    //    var testObj = {
    //         current: $('#today').html().trim(),
    //         first: $('#forecast-1').html().trim(),
    //         second: $('#forecast-2').html().trim(),
    //         third: $('#forecast-3').html().trim()
    //     }
        
    })
}


// A function that grabs and display the current day weather data
function displayTodayData(arrayItem, cityName, placementId,n) {
var todayDataWrap = $('<div>')
todayDataWrap.html(`
<h5> ${cityName} ${moment().add(n,'d').format('l')}  <img src= "https://openweathermap.org/img/wn/${arrayItem.weather[0].icon}@2x.png"></h5>
<p> Temp: ${arrayItem.main.temp}</p>
<p> Wind: ${arrayItem.wind.speed}
<p> Humidity: ${arrayItem.main.humidity}
`)
placementId.html(todayDataWrap)

}

// A function that grabs and display 3 day forecast weather data
function displaythisData(arrayItem, cityName, placementId,n) {
var todayDataWrap = $('<div class = "forecast-box">')
todayDataWrap.html(`
<h5> ${moment().add(n,'d').format('l')}</h5>
<img src= "https://openweathermap.org/img/wn/${arrayItem.weather[0].icon}@2x.png">
<p> Temp: ${arrayItem.main.temp}</p>
<p> Wind: ${arrayItem.wind.speed}
<p> Humidity: ${arrayItem.main.humidity}
`)
placementId.html(todayDataWrap)
}









 



 






 



