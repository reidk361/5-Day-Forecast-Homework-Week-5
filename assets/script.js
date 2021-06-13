const header = document.querySelector("header");
const currentWeather = document.getElementById("current-weather-container");
const fiveDayWeather = document.getElementById("5day-weather-container");
const currentWeatherEl = document.createElement("p")
const prevInput = document.getElementById("prev-input-container");
const inputEl = document.getElementById("city-input");
const submitEl = document.getElementById("submit-button");
const uvContainer = document.getElementById("UV-container");
const cityNameEl = document.createElement("h2");
const cityNameContainer = document.getElementById("city-name-container");

function getCity(city){
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    cityNameEl.textContent = (`${data.name}, ${data.sys.country}`);
    cityNameContainer.append(cityNameEl);
    console.log(data);
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    getCurrentForecast(lat,lon);
    let cityId = data.id;
    get5DayForecast(cityId)
  })
}

function getCurrentForecast (latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    currentWeatherEl.innerHTML = (`<h3>Current Weather:</h3><p>${data.current.weather[0].description} <br /> Wind: ${data.current.wind_speed} MPH <br /> Temp: ${data.current.temp} &#730;F <br /> Humidity: ${data.current.humidity}% <br /> <span id = UV-container>UV Index: ${data.daily[data.daily.length-1].uvi}</span> <br /></p>`);
    currentWeather.append(currentWeatherEl);
  })
}

function get5DayForecast(id){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
     return response.json();
  })
  .then(function (data) {
    console.log(data)
  })
}

function handleSubmit (event){
  event.preventDefault();
  getCity(inputEl.value);
  inputEl.value = '';
}

function handleButton (){
  getCity(inputEl.value);
}

submitEl.addEventListener("click", handleSubmit);