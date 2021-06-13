const header = document.querySelector("header");
const currentWeather = document.getElementById("current-weather-container");
const fiveDayWeather = document.getElementById("5day-weather-container");
const fiveDayMorning = document.getElementById("5day-morning-container");
const fiveDayNoon = document.getElementById("5day-noon-container");
const fiveDayEvening = document.getElementById("5day-evening-container");
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
    currentWeatherEl.innerHTML = (`<h3>${timeConverter(data.current.dt)}</h3><br /> <img id="weather-icon" src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png" alt="Weather icon"><p>${data.current.weather[0].description.toUpperCase()} <br /> Wind: ${data.current.wind_speed} MPH <br /> Temp: ${data.current.temp} &#730;F <br /> Humidity: ${data.current.humidity}% <br /> <span id = UV-container>UV Index: ${data.daily[data.daily.length-1].uvi}</span> <br /></p>`);
    currentWeather.append(currentWeatherEl);
  })
}

function get5DayForecast(id){
  let fiveDayMorningArr = [];
  let fiveDayNoonArr = [];
  let fiveDayEveningArr = [];
  fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
     return response.json();
  })
  .then(function (data) {
    console.log(data);
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i].dt_txt.includes("06:00:00")){
        fiveDayMorningArr.push(data.list[i]);
      }
      if (data.list[i].dt_txt.includes("12:00:00")){
        fiveDayNoonArr.push(data.list[i]);
      }
      if (data.list[i].dt_txt.includes("18:00:00")){
        fiveDayEveningArr.push(data.list[i]);
      }
    }
    console.log(fiveDayMorningArr);
    morningFiveDay(fiveDayMorningArr);
    console.log(fiveDayNoonArr);
    noonFiveDay(fiveDayNoonArr);
    console.log(fiveDayEveningArr);
    eveningFiveDay(fiveDayEveningArr);
  })
}

function morningFiveDay (array){
  for (var i = 0; i < 5; i++) {
    let singleMorningContainer = document.createElement("div");
    singleMorningContainer.setAttribute("id","single-morning-container")
    let morningEl = document.createElement("p");
    morningEl.innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><br /> <img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p>${array[i].weather[0].description.toUpperCase()} <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
    fiveDayMorning.append(singleMorningContainer);
    singleMorningContainer.append(morningEl);
  }
}

function noonFiveDay (array){
  for (var i = 0; i < 5; i++) {
    let singleNoonContainer = document.createElement("div");
    singleNoonContainer.setAttribute("id","single-noon-container")
    let noonEl = document.createElement("p");
    noonEl.innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><br /> <img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p>${array[i].weather[0].description.toUpperCase()} <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
    fiveDayNoon.append(singleNoonContainer);
    singleNoonContainer.append(noonEl);
  }
}

function eveningFiveDay (array){
  for (var i = 0; i < 5; i++) {
    let singleEveningContainer = document.createElement("div");
    singleEveningContainer.setAttribute("id","single-evening-container")
    let eveningEl = document.createElement("p");
    eveningEl.innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><br /> <img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p>${array[i].weather[0].description.toUpperCase()} <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
    fiveDayEvening.append(singleEveningContainer);
    singleEveningContainer.append(eveningEl);
  }
}

function timeConverter(UNIX_timestamp){
  let newDate = new Date(UNIX_timestamp * 1000);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = newDate.getFullYear();
  let month = months[newDate.getMonth()];
  let date = newDate.getDate();
  let hour = newDate.getHours();
  if (hour<10){
    hour = `0${newDate.getHours()}`;
  } else {
    hour = newDate.getHours();
  }
  let min = newDate.getMinutes();
  if (min<10){
    min = `0${newDate.getMinutes()}`;
  } else {
    min = newDate.getMinutes();
  }
  let time = `${date} ${month}, ${year} ${hour}:${min}`;
  return time;
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