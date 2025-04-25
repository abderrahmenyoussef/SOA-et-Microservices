const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
require('dotenv').config();

// Charger les fichiers proto pour les films et les séries TV
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à MongoDB');
}).catch((err) => {
  console.error('Erreur de connexion à MongoDB:', err);
});

// Initialisation Kafka
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS.split(',')
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

// Fonction pour envoyer un message à Kafka
const sendMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};

// Fonction pour consommer les messages Kafka
topics = ['movies_topic', 'tvshows_topic'];
const consumeMessages = async () => {
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message on ${topic}: ${message.value.toString()}`);
      // Traitez le message ici si besoin
    },
  });
};
consumeMessages();

// Créer une nouvelle application Express
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Ajout global du middleware CORS

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

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );
});

app.get('/movies', (req, res) => {
  const client = new movieProto.MovieService(`localhost:${process.env.MOVIE_GRPC_PORT}`,
    grpc.credentials.createInsecure());
  client.searchMovies({query: ''}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.movies);
    }
  });
});

app.get('/movies/:id', (req, res) => {
  const client = new movieProto.MovieService(`localhost:${process.env.MOVIE_GRPC_PORT}`,
    grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getMovie({ movie_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.movie);
    }
  });
});

app.post('/movies', async (req, res) => {
  const { id, title, description } = req.body;
  const client = new movieProto.MovieService(`localhost:${process.env.MOVIE_GRPC_PORT}`, grpc.credentials.createInsecure());
  client.createMovie({ id, title, description }, async (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Publier sur Kafka
      await sendMessage('movies_topic', response.movie);
      res.status(201).json(response.movie);
    }
  });
});

app.get('/tvshows', (req, res) => {
  const client = new tvShowProto.TVShowService(`localhost:${process.env.TVSHOW_GRPC_PORT}`,
    grpc.credentials.createInsecure());
  client.searchTvshows({query: ''}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_shows);
    }
  });
});

app.get('/tvshows/:id', (req, res) => {
  const client = new tvShowProto.TVShowService(`localhost:${process.env.TVSHOW_GRPC_PORT}`,
    grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getTvshow({ tv_show_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_show);
    }
  });
});

app.post('/tvshows', async (req, res) => {
  const { id, title, description } = req.body;
  const client = new tvShowProto.TVShowService(`localhost:${process.env.TVSHOW_GRPC_PORT}`, grpc.credentials.createInsecure());
  client.createTvshow({ id, title, description }, async (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Publier sur Kafka
      await sendMessage('tvshows_topic', response.tv_show);
      res.status(201).json(response.tv_show);
    }
  });
});

// Démarrer l'application Express
const port = process.env.API_PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});