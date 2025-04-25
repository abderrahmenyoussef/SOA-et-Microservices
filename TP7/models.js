const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const tvShowSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const Movie = mongoose.model('Movie', movieSchema);
const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = { Movie, TVShow };