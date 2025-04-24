const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const tvShowProtoPath = 'tvShow.proto';
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

const tvShowService = {
    getTvshow: (call, callback) => {
        const tv_show = {
            id: call.request.tv_show_id,
            title: 'Exemple de série TV',
            description: 'Ceci est un exemple de série TV.',
        };
        callback(null, { tv_show });
    },
    searchTvshows: (call, callback) => {
        const tv_shows = [
            {
                id: '1',
                title: 'Série 1',
                description: 'Description de la série 1',
            },
            {
                id: '2',
                title: 'Série 2',
                description: 'Description de la série 2',
            },
        ];
        callback(null, { tv_shows });
    },
    createTvshow: (call, callback) => {
        // Dans un environnement de production, cette méthode devrait persister les données dans une base de données
        const newTvShow = {
            id: call.request.id,
            title: call.request.title,
            description: call.request.description
        };
        console.log('Nouvelle série TV créée:', newTvShow);
        callback(null, { tv_show: newTvShow });
    }
};

const server = new grpc.Server();
server.addService(tvShowProto.TVShowService.service, tvShowService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});