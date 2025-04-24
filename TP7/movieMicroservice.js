const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const movieProtoPath = 'movie.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

const movieService = {
    getMovie: (call, callback) => {
        const movie = {
            id: call.request.movie_id,
            title: 'Exemple de film',
            description: 'Ceci est un exemple de film.',
        };
        callback(null, { movie });
    },
    searchMovies: (call, callback) => {
        const movies = [
            {
                id: '1',
                title: 'Film 1',
                description: 'Description du film 1',
            },
            {
                id: '2',
                title: 'Film 2',
                description: 'Description du film 2',
            },
        ];
        callback(null, { movies });
    },
    createMovie: (call, callback) => {
        // Dans un environnement de production, cette méthode devrait persister les données dans une base de données
        const newMovie = {
            id: call.request.id,
            title: call.request.title,
            description: call.request.description
        };
        console.log('Nouveau film créé:', newMovie);
        callback(null, { movie: newMovie });
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