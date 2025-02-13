const request = require("request");

const API_KEY = "j8UtFijYHwrscEDcaAVf5igZDowExMmvcyEPaz0U"; 
const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

function getNasaData(callback) {
  request(BASE_URL, (error, response, body) => {
    if (error) {
      callback(error, null);
    } else {
      const data = JSON.parse(body);
      callback(null, data);
    }
  });
}

getNasaData((error, data) => {
  if (!error) {
    console.log("Title:", data.title);
    console.log("Date:", data.date);
    console.log("Explanation:", data.explanation);
    console.log("Image URL:", data.url);
  } else {
    console.error("Error:", error);
  }
});
