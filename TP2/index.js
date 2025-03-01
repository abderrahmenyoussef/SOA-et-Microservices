require('dotenv').config(); // Charger les variables d'environnement

const express = require('express');
const db = require('./database');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const fs = require('fs');

const memoryStore = new session.MemoryStore();
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration de la session avec la clé secrète depuis .env
app.use(session({
  secret: process.env.SESSION_SECRET,  // Utilisation de la variable d'environnement
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Charger la configuration Keycloak depuis le fichier JSON
const keycloakConfig = JSON.parse(fs.readFileSync('./keycloak-config.json', 'utf8'));
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware());

// Route principale
app.get('/', (req, res) => {
  res.json("Registre de personnes! Choisissez le bon routage!!");
});

// Récupérer toutes les personnes (sécurisée avec Keycloak)
app.get('/personnes', keycloak.protect(), (req, res) => {
  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": rows });
  });
});

// Récupérer une personne par ID
app.get('/personnes/:id', keycloak.protect(), (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": row });
  });
});

// Ajouter une nouvelle personne
app.post('/personnes', keycloak.protect(), (req, res) => {
  const { nom, adresse } = req.body;
  db.run('INSERT INTO personnes (nom, adresse) VALUES (?, ?)', [nom, adresse], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": { id: this.lastID } });
  });
});

// Mettre à jour une personne
app.put('/personnes/:id', keycloak.protect(), (req, res) => {
  const id = req.params.id;
  const { nom, adresse } = req.body;
  db.run('UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?', [nom, adresse, id], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

// Supprimer une personne
app.delete('/personnes/:id', keycloak.protect(), (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM personnes WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

// Route sécurisée pour tester Keycloak
app.get('/secure', keycloak.protect(), (req, res) => {
  res.json({ message: 'Vous êtes authentifié !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
