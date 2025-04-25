const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { Movie } = require('./models');

const movieProtoPath = 'movie.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/tp7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const movieService = {
    getMovie: async (call, callback) => {
        try {
            const movie = await Movie.findOne({ id: call.request.movie_id });
            if (!movie) return callback(null, { movie: null });
            callback(null, { movie });
        } catch (err) {
            callback(err);
        }
    },
    searchMovies: async (call, callback) => {
        try {
            const movies = await Movie.find();
            callback(null, { movies });
        } catch (err) {
            callback(err);
        }
    },
    createMovie: async (call, callback) => {
        try {
            const newMovie = new Movie({
                id: call.request.id,
                title: call.request.title,
                description: call.request.description
            });
            await newMovie.save();
            callback(null, { movie: newMovie });
        } catch (err) {
            callback(err);
        }
    }
};

const server = new grpc.Server();
server.addService(movieProto.MovieService.service, movieService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});