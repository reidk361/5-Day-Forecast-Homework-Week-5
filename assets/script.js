const body = document.querySelector("body")
const weatherEl = document.createElement("h1")
const inputEl = document.getElementById("city-input");
const submitEl = document.getElementById("submit-button");

function getCity(city){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86caed8984442f53f479ce0a825d902d&units=imperial`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    weatherEl.textContent = (`The weather and temperature in ${data.name} is: ${data.weather[0].description} and ${data.main.temp} F`);
    body.append(weatherEl);
    console.log(data);
    let cityId = data.id;
        console.log(cityId);
        getForecast(cityId)
      })
    }
    
    function getForecast(id){
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
}

submitEl.addEventListener("click", handleSubmit);