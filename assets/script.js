const header = document.querySelector("header");
const currentWeather = document.getElementById("current-weather-container");
const fiveDayWeather = document.getElementById("5day-weather-container");
const fiveDayMorning = document.getElementById("5day-morning-container");
const fiveDayNoon = document.getElementById("5day-noon-container");
const fiveDayEvening = document.getElementById("5day-evening-container");
const currentWeatherEl = document.createElement("div")
const prevInputContainer = document.getElementById("prev-input-container");
const inputEl = document.getElementById("city-input");
const submitEl = document.getElementById("submit-button");
const cityNameEl = document.createElement("h2");
const cityNameContainer = document.getElementById("city-name-container");

let buttonEl = document.createElement("button");
let singleMorningContainer = document.createElement("div");
let morningEl = document.createElement("p");
let singleNoonContainer = document.createElement("div");
let noonEl = document.createElement("p");
let singleEveningContainer = document.createElement("div");
let eveningEl = document.createElement("p");


function makeButton(city){
  let buttonArr = Array.from(document.querySelectorAll("button"));
  let buttonTextArr = [];
  if (buttonArr.length>0){
    for (let i=0; i < buttonArr.length; i++) {
      buttonTextArr.push(buttonArr[i].innerText)}
  }
  buttonEl = document.createElement("button");
  let arr = [];
  arr.unshift(city);
  while (arr.length > 4){
    arr.pop();
  }
  console.log(arr);
  if (!buttonTextArr.includes(city)){
    for (var i = 0; i <arr.length; i++) {
      buttonEl.textContent = arr[i];
      prevInputContainer.append(buttonEl);
      buttonEl.addEventListener("click", handleButton);
    }
  }
  function handleButton (event){
    getCity(event.target.textContent);
  }
}


function getCity(city){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    cityNameEl.textContent = (`${data.name}, ${data.sys.country}`);
    cityNameContainer.append(cityNameEl);
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    getCurrentForecast(lat,lon);
    let cityId = data.id;
    get5DayForecast(cityId)
  })
}

function getCurrentForecast (latitude, longitude) {
  currentWeatherEl.setAttribute("id","current-container")
  currentWeatherEl.classList.add("col-md-4", "col-6")
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    currentWeatherEl.innerHTML = (`<h3>${timeConverter(data.current.dt)}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${data.current.weather[0].description}</span> <br /> Wind: ${data.current.wind_speed} MPH <br /> Temp: ${data.current.temp} &#730;F <br /> Humidity: ${data.current.humidity}% <br /> <span id = UV-container>UV Index: ${data.daily[data.daily.length-1].uvi}</span> <br /></p>`);
    currentWeather.append(currentWeatherEl);
    let uvContainer = document.getElementById("UV-container");
    let uvNum = data.daily[data.daily.length-1].uvi;
    if (uvNum>=11){
      uvContainer.setAttribute("style","background-color:purple; padding:1%; border-radius: 5rem;");
    } else if (uvNum<11&&uvNum>=8) {
      uvContainer.setAttribute("style","background-color:red; padding:1%; border-radius: 5rem;");
    } else if (uvNum<8&&uvNum>=6) {
      uvContainer.setAttribute("style","background-color:orange; padding:1%; border-radius: 5rem;");
    } else if (uvNum<6&&uvNum>=3) {
      uvContainer.setAttribute("style","background-color:yellow; padding:1%; border-radius: 5rem;");
    } else if (uvNum<3&&uvNum>=0) {
      uvContainer.setAttribute("style","background-color:green; padding:1%; border-radius: 5rem;");
    }
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
  if (!fiveDayMorning.contains(singleMorningContainer)){
    for (var i = 0; i < 5; i++) {
      singleMorningContainer = document.createElement("div");
      singleMorningContainer.setAttribute("id","single-morning-container")
      singleMorningContainer.classList.add("col-lg-2" , "col-4")
      morningEl = document.createElement("p");
      fiveDayMorning.append(singleMorningContainer);
      singleMorningContainer.append(morningEl);
    }
  }
  for (var i = 0; i < 5; i++){
    fiveDayMorning.children[i+1].children[0].innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
  } 
}

function noonFiveDay (array){
  if (!fiveDayNoon.contains(singleNoonContainer)){
    for (var i = 0; i < 5; i++) {
      singleNoonContainer = document.createElement("div");
      singleNoonContainer.setAttribute("id","single-noon-container")
      singleNoonContainer.classList.add("col-lg-2", "col-4")
      noonEl = document.createElement("p");
      fiveDayNoon.append(singleNoonContainer);
      singleNoonContainer.append(noonEl);
    }
  }
  for (var i = 0; i < 5; i++){
    fiveDayNoon.children[i+1].children[0].innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
  }
}

function eveningFiveDay (array){
  if (!fiveDayEvening.contains(singleEveningContainer)){
    for (var i = 0; i < 5; i++) {
      singleEveningContainer = document.createElement("div");
      singleEveningContainer.setAttribute("id","single-evening-container")
      singleEveningContainer.classList.add("col-lg-2" , "col-4")
      eveningEl = document.createElement("p");
      fiveDayEvening.append(singleEveningContainer);
      singleEveningContainer.append(eveningEl);
    }
  }
  for (var i = 0; i < 5; i++){
    fiveDayEvening.children[i+1].children[0].innerHTML = (`<h3>${timeConverter(array[i].dt+25200)}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
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
  if (inputEl.value !=''){
    getCity(inputEl.value);
    makeButton(inputEl.value);
  }  
  inputEl.value = '';
}



submitEl.addEventListener("click", handleSubmit);