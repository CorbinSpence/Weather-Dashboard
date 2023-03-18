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
    let city = response.city.name
    if(!searchedCities.includes(city)){
        let list = response.list
        let currentStats = {"temp":convertKelvinToFahrinheit(list[0].main.temp), "wind":list[0].wind.speed, "humidity":list[0].main.humidity}
        let fiveDayStats = []
        let dayIndex = 1
        for(l in list){
            //console.log(list[l].dt)
            //console.log(dayjs(list[l].dt*1000))
            if(dayjs(list[l].dt*1000).isSame(dayjs(list[0].dt*1000).add(dayIndex, "day"))){
                dayIndex++
                fiveDayStats.push({"temp":convertKelvinToFahrinheit(list[l].main.temp), "wind":list[l].wind.speed, "humidity":list[l].main.humidity})
                console.log(dayjs(list[l].dt*1000).format('D-H'))
            }
        }
        let data = {"city":city, "currentStats":currentStats, "fiveDayStats":fiveDayStats}
        console.log(previousResults)
        previousResults.push(data)
        searchedCities.push(city)
        localStorage.setItem(previousResultsKey, JSON.stringify(previousResults))
        localStorage.setItem(searchedCitiesKey, JSON.stringify(searchedCities))
        console.log(data)
    }
    let cityButtons = $('#city-list')
    cityButtons.children().remove()
    for(i in searchedCities){
        cityButtons.append('<input type="button" value="'+searchedCities[i]+'" id="'+searchedCities[i]+'" class="bg-gray-400 rounded hover:bg-gray-300 mb-1 city-button">')
    }
}



const searchCity = function (event){
    event.preventDefault
    searchedCity = $('#search-input').val()
    console.log(searchedCity)
    getWeatherReport(weatherURL)
}

const showPreviousCity = function (event){
    event.preventDefault
    let city = $(event.target).val()
    console.log("setting up "+city)
}
const submitButton = $('#submit-search')
submitButton.on('click', searchCity)
$('#city-list').on('click', '.city-button', showPreviousCity)
