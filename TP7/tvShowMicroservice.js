const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { TVShow } = require('./models');

const tvShowProtoPath = 'tvShow.proto';
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/tp7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const tvShowService = {
    getTvshow: async (call, callback) => {
        try {
            const tv_show = await TVShow.findOne({ id: call.request.tv_show_id });
            if (!tv_show) return callback(null, { tv_show: null });
            callback(null, { tv_show });
        } catch (err) {
            callback(err);
        }
    },
    searchTvshows: async (call, callback) => {
        try {
            const tv_shows = await TVShow.find();
            callback(null, { tv_shows });
        } catch (err) {
            callback(err);
        }
    },
    createTvshow: async (call, callback) => {
        try {
            const newTvShow = new TVShow({
                id: call.request.id,
                title: call.request.title,
                description: call.request.description
            });
            await newTvShow.save();
            callback(null, { tv_show: newTvShow });
        } catch (err) {
            callback(err);
        }
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