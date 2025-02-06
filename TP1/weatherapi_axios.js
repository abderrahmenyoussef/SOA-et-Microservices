const axios = require("axios");

const API_KEY = "38f9264b8e345e5059d64b5e08c19663";
const BASE_URL =
  "http://api.openweathermap.org/data/2.5/weather?appid=" +
  API_KEY +
  "&units=metric&lang=fr&q=";

function getWeatherData(city, callback) {
  const url = BASE_URL + city;
  axios.get(url).then((response) => callback(null, response.data));
}

getWeatherData("Msaken", (error, data) => {
    if (!error) {
      // console.log(data);
      console.log("Description :" + data.weather[0].description);
      console.log("Temperature :" + data.main.temp + "°C");
      console.log("Humidiy :" + data.main.humidity + "%");
    }
  });