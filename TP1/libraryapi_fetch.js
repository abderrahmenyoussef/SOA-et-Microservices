const BASE_URL = "https://openlibrary.org/search.json?q=";

function getBookData(query, callback) {
  const url = BASE_URL + encodeURIComponent(query); 
  
  fetch(url)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
}

getBookData("game of thrones", (error, data) => {
  if (!error) {
    console.log("Total Results:", data.numFound);
    console.log("First Book Title:", data.docs[0]?.title);
    console.log("First Author:", data.docs[0]?.author_name?.join(", "));
  } else {
    console.error("Error:", error);
  }
});
