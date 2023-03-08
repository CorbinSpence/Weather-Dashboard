/*
Weather api returns temp in kelvin
*/
//This is for testing purposes. Contains a key to locally saved api search instance.
const positiveTestResultKey = "positiveResultKey"

var weatherURL = 'http://api.openweathermap.org/data/2.5/forecast'
var geoCoderURL = 'http://api.openweathermap.org/geo/1.0/direct?q=Atlanta&limit=1&appid=62818af10b1b70f3c94825ea2a5873f2'
var lat = 0
var lon = 0
var currentWeather = {
    temp: '',
    wind: '',
    humidity: '',
}

function convertKelvinToFahrinheit(tempK){
    let far = (tempK-273.15) * 9/5 + 32
    return far
}

async function getCordinates(){
    var raw = await fetch(geoCoderURL)
    var response = await raw.json()
    console.log(response)
    lat = await response[0].lat
    console.log(lat)
    lon = await response[0].lon
    console.log(lon)
}
async function getWeatherReport(baseURL){
    await getCordinates()
    var fullURL = baseURL+'?lat='+lat+'&lon='+lon+'&appid=62818af10b1b70f3c94825ea2a5873f2'
    console.log(fullURL)
    console.log(typeof fullURL)
    var raw = await fetch(fullURL, {
        method: 'GET',
        mode: 'cors',
        cashe: 'default',
    })
    var response = await raw.json()
    localStorage.setItem(positiveTestResultKey, JSON.stringify(response))
    console.log(response)
}
// if(localStorage.getItem(positiveTestResultKey)===null){
//     getWeatherReport('http://api.openweathermap.org/data/2.5/forecast')
// }

// getCordinates(geoCoderURL)
// console.log(lat)
// console.log(lon)

//getWeatherReport(weatherURL)
var example = JSON.parse(localStorage.getItem(positiveTestResultKey))
console.log(example)
var exampleDataList = example.list
console.log(exampleDataList)
for(i in exampleDataList){
    console.log(i)
    let dt = exampleDataList[i].dt
    let hour = dayjs(dt)
    console.log(hour)
}