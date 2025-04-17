require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Kafka } = require('kafkajs');
const Message = require('./db');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de Kafka
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'web-client',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kafka_messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Route API pour récupérer tous les messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Erreur lors de la récupération des messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route API pour envoyer un message via Kafka
app.post('/api/messages', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Le contenu du message est requis' });
    }

    // Connecter le producteur Kafka si ce n'est pas déjà fait
    if (!producer.isConnected()) {
      await producer.connect();
    }

    // Envoyer le message au topic Kafka
    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'messages-topic',
      messages: [{ value: message }]
    });

    res.status(201).json({ success: true, message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du message:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route par défaut qui sert l'application frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(port, async () => {
  // Connecter le producteur Kafka au démarrage du serveur
  try {
    await producer.connect();
    console.log('Producteur Kafka connecté');
  } catch (err) {
    console.error('Erreur de connexion au producteur Kafka:', err);
  }
  
  console.log(`Serveur Express lancé sur http://localhost:${port}`);
});

// Gérer la fermeture propre des connexions
process.on('SIGINT', async () => {
  try {
    await producer.disconnect();
    console.log('Producteur Kafka déconnecté');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la déconnexion:', err);
    process.exit(1);
  }
});
