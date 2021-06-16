//Get elements from the DOM
const header = document.querySelector("header");
const currentWeather = document.getElementById("current-weather-container");
const fiveDayWeather = document.getElementById("5day-weather-container");
const fiveDayMorning = document.getElementById("5day-morning-container");
const fiveDayNoon = document.getElementById("5day-noon-container");
const fiveDayEvening = document.getElementById("5day-evening-container");
const currentWeatherEl = document.createElement("div")
const prevInputContainer = document.getElementById("prev-input-container");
const inputEl = document.getElementById("city-input");
const submitEl = document.getElementById("button-addon2");
const clearEl = document.querySelector(".btn-danger");
const cityNameEl = document.createElement("h2");
const cityNameContainer = document.getElementById("city-name-container");

//Set Global variables that will be used in functions.
let buttonEl = document.createElement("button");
let singleMorningContainer = document.createElement("div");
let morningEl = document.createElement("p");
let singleNoonContainer = document.createElement("div");
let noonEl = document.createElement("p");
let singleEveningContainer = document.createElement("div");
let eveningEl = document.createElement("p");
let timezoneOffset = 0

//Makes Buttons for previous searches. 
function makeButton(city){
  clearEl.setAttribute("style","visibility: visible")
  let buttonArr = Array.from(document.querySelectorAll("button"));
  let buttonTextArr = [];
  if (buttonArr.length>0){
    for (let i=0; i < buttonArr.length; i++) {
      if (buttonArr[i].innerText!="Search"&&
          buttonArr[i].innerText!="Clear"){
        buttonTextArr.push(buttonArr[i].innerText.toLowerCase());
      }
    }
  }
  buttonEl = document.createElement("button");
  buttonEl.classList.add("btn", "btn-primary", "text-capitalize");
  buttonEl.setAttribute("type", "button");

  //Prevents button with repeat cities being made.
  if (!buttonTextArr.includes(city.toLowerCase())){
    buttonEl.textContent = city;
    prevInputContainer.append(buttonEl);
    
    //Allows all buttons made in this function to be clickable. 
    buttonEl.addEventListener("click", handleButton);
  }

  //Deletes oldest button after 8.
  if (prevInputContainer.childNodes.length>8){
    prevInputContainer.removeChild(prevInputContainer.childNodes[0])
  }

  //Saves button values for localStorage.
  handleSave();

  //Allows button text to search for weather. 
  function handleButton (event){
    getCity(event.target.textContent);
  }
}

//Puts button text for all present buttons to local storage.
function handleSave(){
  let buttonElArr = prevInputContainer.children;
  let arr = []
  for (let i=0; i<buttonElArr.length; i++){
    arr.push(buttonElArr[i].textContent);
  }
  localStorage.setItem("buttonText", arr.toString());
}

//Loads buttons onto page.
function handleLocalStorage(){
  let storage = localStorage.getItem("buttonText");
  let storageArr = []
  if (storage){
    storageArr = storage.split(",");
  }

  //If there are more than 8 strings, this will make sure only 8 buttons are made.
  while (storageArr.length > 8){
    storageArr.pop();
  }

  //Prevents making empty buttons.
  if (storageArr.length>0){  
    for (let i = 0; i <storageArr.length; i++) {
      makeButton(storageArr[i]);
    }
  }
}

//Gets data from search and places it into the button. 
//Returns latitude & longitude and cityID data to pass onto other functions.  
function getCity(city){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {

    //Prevents a button being made if the city does not exist in their database.
    if (response.ok){
      makeButton(city);
    }
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
    timezoneOffset = data.timezone;
    console.log(timezoneOffset);
  })
}

//Uses latitude and longitude to get the current weather. 
function getCurrentForecast (latitude, longitude) {

  currentWeather.setAttribute("style","");
  currentWeatherEl.setAttribute("id","current-container");
  currentWeatherEl.classList.add("col-md-4", "col-6");
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  //Creates current weather block and adds all applicable data. 
  .then(function (data) {
    currentWeatherEl.innerHTML = (`<h3>${timeConverter((data.current.dt)+(timezoneOffset))}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${data.current.weather[0].description}</span> <br /> Wind: ${data.current.wind_speed} MPH <br /> Temp: ${data.current.temp} &#730;F <br /> Humidity: ${data.current.humidity}% <br /> <span id = UV-container>UV Index: ${(Math.trunc(data.daily[0].uvi))}</span> <br /></p>`);
    currentWeather.append(currentWeatherEl);

    //Changes current weather background based on time of day.
    if (timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))>=06&&
      timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))<12){
      currentWeatherEl.setAttribute("style","background-image: linear-gradient(rgb(206, 111, 3) 0%,rgb(0, 132, 255) 100%");
    } else if (timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))>=12&&
      timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))<18){
      currentWeatherEl.setAttribute("style", "background-color: rgb(0, 132, 255);");
    } else if (timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))>=18&&
      timeConvertHourOnly((data.current.dt)
    +(timezoneOffset))<21){
      currentWeatherEl.setAttribute("style","background-image: linear-gradient(rgb(0, 132, 255) 0%,rgb(10, 0, 151) 100%");
    } else {
      currentWeatherEl.setAttribute("style", "background-color: rgb(10, 0, 151);");
    }


    //Gets element that controls just UV data.
    let uvContainer = document.getElementById("UV-container");
    let uvNum = (Math.trunc(data.daily[0].uvi));

    //Changes UV data's color based on UV charts for severity. 
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

//Places forecasts for morning, noon, and evening into their own array to be passed on later.  
function get5DayForecast(id){
  fiveDayWeather.setAttribute("style","");
  let fiveDayMorningArr = [];
  let fiveDayNoonArr = [];
  let fiveDayEveningArr = [];
  fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
     return response.json();
  })

  //Grabs only the applicable arrays.
  .then(function (data) {
    console.log(timezoneOffset);
    console.log(data);
    for (var i = 0; i < data.list.length; i++) {
      console.log(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset)));
      //console.log(["05","06","07"].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset))));
      //console.log([11,12,13].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset))));
      //console.log([17,18,19].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset))));
      if (["05","06","07"].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset)))){
        fiveDayMorningArr.push(data.list[i]);
      }
      if ([11,12,13].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset)))){
        fiveDayNoonArr.push(data.list[i]);
      }
      if ([17,18,19].includes(timeConvertHourOnly((data.list[i].dt)+(timezoneOffset)))){
        fiveDayEveningArr.push(data.list[i]);
      }
    }
    console.log(fiveDayMorningArr);
    morningFiveDay(fiveDayMorningArr);
    noonFiveDay(fiveDayNoonArr);
    eveningFiveDay(fiveDayEveningArr);
  })
}

//Like current weather, but pulling from 06:00 array. 
function morningFiveDay (array){

  //Makes containers for each day only if there are none. 
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
  //Places applicable data into those blocks.
  for (var i = 0; i < 5; i++){
    fiveDayMorning.children[i+1].children[0].innerHTML = (`<h3>${timeConverter((array[i].dt)+(timezoneOffset))}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
  } 
}

//Same as morningFiveDay, but pulling from 12:00 array.
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
    fiveDayNoon.children[i+1].children[0].innerHTML = (`<h3>${timeConverter((array[i].dt)+(timezoneOffset))}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
  }
}

//Same as morningFiveDay and noonFiveDay, but pulling from 18:00 array.
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
    fiveDayEvening.children[i+1].children[0].innerHTML = (`<h3>${timeConverter((array[i].dt)+(timezoneOffset))}</h3><img id="weather-icon" src="http://openweathermap.org/img/w/${array[i].weather[0].icon}.png" alt="Weather icon"><p><span class="text-capitalize">${array[i].weather[0].description}</span> <br /> Wind: ${array[i].wind.speed} MPH <br /> Temp: ${array[i].main.temp} &#730;F <br /> Humidity: ${array[i].main.humidity}%</p>`);
  }
}

//Converts unix time to a readable UTC date and time. 
function timeConverter(UNIX_timestamp){
  let newDate = new Date(UNIX_timestamp * 1000);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = newDate.getUTCFullYear();
  let month = months[newDate.getUTCMonth()];
  let date = newDate.getUTCDate();
  let hour = newDate.getUTCHours();

  //Places 0 in front of all hours less than 10. (i.e. 06:00 vice 6:00).
  if (hour<10){
    hour = `0${newDate.getUTCHours()}`;
  } else {
    hour = newDate.getUTCHours();
  }
  let min = newDate.getUTCMinutes();

  //Places 0 in front of all minutes less than 10. (i.e. 06:00 vice 06:0).
  if (min<10){
    min = `0${newDate.getUTCMinutes()}`;
  } else {
    min = newDate.getUTCMinutes();
  }
  let time = `${date} ${month}, ${year} ${hour}:${min}`;
  return time;
}

//Converts unix time to a readable local system date and time. 
function localTimeConverter(UNIX_timestamp){
  let newDate = new Date(UNIX_timestamp * 1000);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = newDate.getFullYear();
  let month = months[newDate.getMonth()];
  let date = newDate.getDate();
  let hour = newDate.getHours();

  //Places 0 in front of all hours less than 10. (i.e. 06:00 vice 6:00).
  if (hour<10){
    hour = `0${newDate.getHours()}`;
  } else {
    hour = newDate.getHours();
  }
  let min = newDate.getMinutes();

  //Places 0 in front of all minutes less than 10. (i.e. 06:00 vice 06:0).
  if (min<10){
    min = `0${newDate.getMinutes()}`;
  } else {
    min = newDate.getMinutes();
  }
  let time = `${date} ${month}, ${year} ${hour}:${min}`;
  return time;
}

function localTimeAppend(){
  let newDate = new Date();
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = newDate.getFullYear();
  let month = months[newDate.getMonth()];
  let date = newDate.getDate();
  let hour = newDate.getHours();

  //Places 0 in front of all hours less than 10. (i.e. 06:00 vice 6:00).
  if (hour<10){
    hour = `0${newDate.getHours()}`;
  } else {
    hour = newDate.getHours();
  }
  let min = newDate.getMinutes();

  //Places 0 in front of all minutes less than 10. (i.e. 06:00 vice 06:0).
  if (min<10){
    min = `0${newDate.getMinutes()}`;
  } else {
    min = newDate.getMinutes();
  }
  let time = `${date} ${month}, ${year} ${hour}:${min}`;
  let headerLocalTime = document.createElement("h2");
  headerLocalTime.textContent = (`Your local time is: ${time}`);
  header.append(headerLocalTime);
}

//Used for time of day comparisons for current weather. 
function timeConvertHourOnly(UNIX_timestamp){
  let newDate = new Date(UNIX_timestamp * 1000);
  let hour = newDate.getUTCHours();

  //Places 0 in front of all hours less than 10. (i.e. 06:00 vice 6:00).
  if (hour<10){
    hour = `0${newDate.getUTCHours()}`;
  } else {
    hour = newDate.getUTCHours();
  }
  let justHour = hour;
  return justHour;
} 

//Submits search and clears search bar. Prevents search if search bar is blank.
function handleSubmit (event){
  event.preventDefault();
  if (inputEl.value !=''){
    getCity(inputEl.value);
  }  
  inputEl.value = '';
}

//Clears local storage, removes search buttons, and reloads page. 
function handleClear (event){
  event.preventDefault();
  while (prevInputContainer.childNodes.length>0){
    prevInputContainer.removeChild(prevInputContainer.childNodes[0]);
  }
  clearEl.setAttribute("style","visibility:hidden")
  localStorage.setItem("buttonText","");
  location.reload();
  return;
}

//Allows you to press Enter in the search bar instead of clicking Search. 
function handleEnter(event){
  if (event.key === 'Enter'){
    handleSubmit(event);
  } else {
    return;
  }
}

//Loads buttons when page loads.
document.onload = handleLocalStorage();

//Appends current system time to header when page loads.
document.onload = localTimeAppend();

//Event Listeners. 
clearEl.addEventListener("click", handleClear);
submitEl.addEventListener("click", handleSubmit);
inputEl.addEventListener("keydown", handleEnter);