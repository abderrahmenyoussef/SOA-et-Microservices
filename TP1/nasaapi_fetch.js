const API_KEY = "j8UtFijYHwrscEDcaAVf5igZDowExMmvcyEPaz0U"; 
const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

function getNasaData(callback) {
  fetch(BASE_URL)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
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
