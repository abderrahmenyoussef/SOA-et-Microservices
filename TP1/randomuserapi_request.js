const request = require("request");

const BASE_URL = "https://randomuser.me/api/";

function getRandomUser(callback) {
  request(BASE_URL, (error, response, body) => {
    if (error) {
      callback(error, null);
    } else {
      const data = JSON.parse(body);
      callback(null, data.results[0]);
    }
  });
}

getRandomUser((error, user) => {
  if (!error) {
    console.log("Nom :", user.name.first, user.name.last);
    console.log("Email :", user.email);
    console.log("Genre :", user.gender);
    console.log("Pays :", user.location.country);
    console.log("Photo :", user.picture.large);
  } else {
    console.error("Erreur :", error);
  }
});
