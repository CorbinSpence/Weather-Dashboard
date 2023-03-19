/*
Weather api returns temp in kelvin
*/


const previousResultsKey = "previousResultsKey"
var previousResults = JSON.parse(localStorage.getItem(previousResultsKey))
if(previousResults === null){
    previousResults = []
    localStorage.setItem(previousResultsKey, JSON.stringify(previousResults))
}

const searchedCitiesKey = "searchedCitiesKey"
var searchedCities = JSON.parse(localStorage.getItem(searchedCitiesKey))
if(searchedCities === null){
    searchedCities = []
    localStorage.setItem(searchedCitiesKey, JSON.stringify(searchedCities))
}

var searchedCity = "boston"
const weatherURL = 'http://api.openweathermap.org/data/2.5/forecast'
const geoCoderURL = 'http://api.openweathermap.org/geo/1.0/direct'
var lat = 0
var lon = 0

function convertKelvinToFahrinheit(tempK){
    let far = (tempK-273.15) * 9/5 + 32
    return far
}

async function getCordinates(baseURL){
    let geoSearchURL = baseURL+'?q='+searchedCity+'&limit=1&appid=62818af10b1b70f3c94825ea2a5873f2'
    console.log(geoSearchURL)
    var raw = await fetch(geoSearchURL)
    var response = await raw.json()
    console.log(response)
    lat = await response[0].lat
    console.log(lat)
    lon = await response[0].lon
    console.log(lon)
}
async function getWeatherReport(baseURL){
    await getCordinates(geoCoderURL)
    var fullURL = baseURL+'?lat='+lat+'&lon='+lon+'&appid=62818af10b1b70f3c94825ea2a5873f2'
    console.log(fullURL)
    console.log(typeof fullURL)
    var raw = await fetch(fullURL, {
        method: 'GET',
        mode: 'cors',
        cashe: 'default',
    })
    var response = await raw.json()
    console.log(response.list)
    let city = response.city.name
    
    let list = response.list
    let currentStats = {"time": dayjs(list[0].dt*1000).format('(MM-DD-YYYY)'), "temp":convertKelvinToFahrinheit(list[0].main.temp), "wind":list[0].wind.speed, "humidity":list[0].main.humidity}
    let fiveDayStats = []
    for(l in list){
        //console.log(list[l].dt)
        //console.log(dayjs(list[l].dt*1000))
        if(parseInt(l) === 0){
            continue
        }
        if(dayjs(list[l].dt*1000).hour() === 11){
            fiveDayStats.push({"time": dayjs(list[l].dt*1000).format('(MM-DD-YYYY)'), "temp":convertKelvinToFahrinheit(list[l].main.temp), "wind":list[l].wind.speed, "humidity":list[l].main.humidity})
            console.log(dayjs(list[l].dt*1000).format('D-H'))
        }
    }
    let data = {"city":city, "currentStats":currentStats, "fiveDayStats":fiveDayStats}
    console.log(previousResults)
    if(!searchedCities.includes(city)){
        previousResults.push(data)
        searchedCities.push(city)
        localStorage.setItem(previousResultsKey, JSON.stringify(previousResults))
        localStorage.setItem(searchedCitiesKey, JSON.stringify(searchedCities))
    }
    console.log(data)
    let cityButtons = $('#city-list')
    cityButtons.children().remove()
    // resets city buttons
    for(i in searchedCities){
        cityButtons.append('<input type="button" value="'+searchedCities[i]+'" id="'+searchedCities[i]+'" class="bg-gray-400 rounded hover:bg-gray-300 mb-1 city-button">')
    }
    // sets current weather
    let currentForcast = $('#city-current-forcast')
    console.log(currentForcast.children('.temp'))
    currentForcast.children('h2').text(city+' '+currentStats.time)
    currentForcast.children('.temp').text('Temp: '+currentStats.temp)
    currentForcast.children('.wind').text('Wind: '+currentStats.wind)
    currentForcast.children('.humidity').text('Humidity: '+currentStats.humidity)
    // sets 5-day weather
    for(i in fiveDayStats){
        let index = 1+parseInt(i)
        let temp = $('#'+index+'-days-after')
        console.log('#'+index+'-days-after')
        console.log(typeof i)
        temp.children('h4').text(fiveDayStats[i].time)
        temp.children('.temp').text('Temp: '+fiveDayStats[i].temp)
        temp.children('.wind').text('Wind: '+fiveDayStats[i].wind)
        temp.children('.humidity').text('Humidity: '+fiveDayStats[i].humidity)
    }
}

function displayWeather(city){
    if(!searchedCities.includes(city)){
        return
    }
    let data = JSON.parse(localStorage.getItem(previousResultsKey))
    data = data[searchedCities.indexOf(city)]
    
    // sets current weather
    let currentForcast = $('#city-current-forcast')
    console.log(currentForcast.children('.temp'))
    currentForcast.children('h2').text(city+' '+data.currentStats.time)
    currentForcast.children('.temp').text('Temp: '+data.currentStats.temp)
    currentForcast.children('.wind').text('Wind: '+data.currentStats.wind)
    currentForcast.children('.humidity').text('Humidity: '+data.currentStats.humidity)
    // sets 5-day weather
    for(i in data.fiveDayStats){
        let index = 1+parseInt(i)
        let temp = $('#'+index+'-days-after')
        console.log('#'+index+'-days-after')
        console.log(typeof i)
        temp.children('h4').text(data.fiveDayStats[i].time)
        temp.children('.temp').text('Temp: '+data.fiveDayStats[i].temp)
        temp.children('.wind').text('Wind: '+data.fiveDayStats[i].wind)
        temp.children('.humidity').text('Humidity: '+data.fiveDayStats[i].humidity)
    }
}

const searchCity = function (event){
    event.preventDefault()
    searchedCity = $('#search-input').val()
    console.log(searchedCity)
    getWeatherReport(weatherURL)
}

const showPreviousCity = function (event){
    event.preventDefault()
    let city = $(event.target).val()
    console.log("setting up "+city)
    displayWeather(city)
}
const submitButton = $('#submit-search')
submitButton.on('click', searchCity)
$('#city-list').on('click', '.city-button', showPreviousCity)
