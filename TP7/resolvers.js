const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';

const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

const resolvers = {
    Query: {
        movie: (_, { id }) => {
            const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getMovie({ movie_id: id }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.movie);
                });
            });
        },
        movies: () => {
            const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchMovies({ query: '' }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.movies);
                });
            });
        },
        tvShow: (_, { id }) => {
            const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getTvshow({ tv_show_id: id }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.tv_show);
                });
            });
        },
        tvShows: () => {
            const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchTvshows({ query: '' }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.tv_shows);
                });
            });
        },
    },
    Mutation: {
        createMovie: (_, { id, title, description }) => {
            const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.createMovie({ id, title, description }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.movie);
                });
            });
        },
        createTVShow: (_, { id, title, description }) => {
            const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.createTvshow({ id, title, description }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.tv_show);
                });
            });
        }
    }
};

module.exports = resolvers;