# TP2.5 - Gestion des CORS et Rate Limiting dans une API REST

Ce projet consiste à ajouter la gestion des **CORS** (Cross-Origin Resource Sharing) et un mécanisme de **Rate Limiting** (limitation du nombre de requêtes) à une API REST existante, développée avec **Express.js** et **SQLite**.

## Objectifs
- Autoriser les requêtes multi-origines avec CORS.
- Limiter le nombre de requêtes par IP avec un mécanisme de Rate Limiting.
- Tester les fonctionnalités avec un fichier HTML et Postman.

## Technologies utilisées
- **Node.js** : Environnement d'exécution JavaScript.
- **Express.js** : Framework pour créer des APIs REST.
- **SQLite** : Base de données légère et facile à utiliser.
- **CORS** : Middleware pour gérer les requêtes multi-origines.
- **Express Rate Limit** : Middleware pour limiter le nombre de requêtes.

## Étapes du projet

### 1. Installation des modules nécessaires
- Installer les modules cors et express-rate-limit :
  
  npm install cors express-rate-limit

### 2. Configuration de CORS
- Autoriser toutes les origines avec le middleware cors() :
  
  app.use(cors());
  
- Pour restreindre aux domaines autorisés, utilisez :
  
  app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4200'] }));

### 3. Configuration du Rate Limiting
- Limiter les requêtes à 100 par IP toutes les 15 minutes :
  
  const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par fenêtre
      message: 'Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes.'
  });
  app.use(limiter);

### 4. Test des fonctionnalités

#### Tester CORS
- Créez un fichier HTML pour effectuer une requête vers l'API 
  
- Ouvrez ce fichier dans un navigateur et vérifiez que les données sont bien récupérées.

#### Tester Rate Limiting
- Utilisez Postman pour envoyer plus de 100 requêtes en moins de 15 minutes depuis la même IP.
- Une fois la limite atteinte, vous devriez recevoir un message d'erreur :
  
  {
    "message": "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes."
  }

## Structure du projet
- `index.js` : Point d'entrée de l'API avec les configurations CORS et Rate Limiting.
- `database.js` : Configuration de la base de données SQLite.
- `test-cors.html` : Fichier HTML pour tester les requêtes CORS.

## Comment exécuter le projet
1. Cloner le dépôt :
   
   git clone <url-du-dépôt>
   
2. Installer les dépendances :
   
   npm install
   
3. Démarrer l'API :
   
   node index.js
   
4. Tester les routes avec Postman ou un fichier HTML.


