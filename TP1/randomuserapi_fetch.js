const BASE_URL = "https://randomuser.me/api/";

function getRandomUser(callback) {
  fetch(BASE_URL)
    .then(response => response.json())
    .then(data => callback(null, data.results[0])) 
    .catch(error => callback(error, null));
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
