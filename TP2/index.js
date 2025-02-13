const express = require('express');
const db = require('./database');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const memoryStore = new session.MemoryStore();

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration de la session
app.use(session({
  secret: 'api-secret',  // Clé secrète pour la session
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Configuration de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');
app.use(keycloak.middleware());

// Route pour la page d'accueil
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

// Récupérer une personne par ID (sécurisée avec Keycloak)
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

// Créer une nouvelle personne (sécurisée avec Keycloak)
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

// Mettre à jour une personne (sécurisée avec Keycloak)
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

// Supprimer une personne (sécurisée avec Keycloak)
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

// Route sécurisée supplémentaire
app.get('/secure', keycloak.protect(), (req, res) => {
  res.json({ message: 'Vous êtes authentifié !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});