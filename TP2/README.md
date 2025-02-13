# TP2 - Création d'une API REST sécurisée avec Express, SQLite et Keycloak

Ce projet consiste à créer une API REST sécurisée en utilisant **Express.js**, **SQLite** pour la base de données, et **Keycloak** pour l'authentification OAuth 2.0.

## Objectifs
- Créer une API REST avec Express.js.
- Utiliser SQLite pour stocker les données.
- Sécuriser l'API avec Keycloak en utilisant OAuth 2.0.
- Tester les routes sécurisées avec Postman.

## Technologies utilisées
- **Node.js** : Environnement d'exécution JavaScript.
- **Express.js** : Framework pour créer des APIs REST.
- **SQLite** : Base de données légère et facile à utiliser.
- **Keycloak** : Solution open-source pour la gestion de l'authentification et de l'autorisation.
- **Postman** : Outil pour tester les APIs.

## Étapes du projet

### 1. Initialisation du projet
- Créer un nouveau projet Node.js avec \`npm init -y\`.
- Installer les dépendances nécessaires :
  \`\`\`bash
  npm install express sqlite3 keycloak-connect express-session
  \`\`\`

### 2. Configuration de SQLite
- Créer une base de données SQLite et une table \`personnes\` pour stocker les données.
- Insérer des données initiales dans la table.

### 3. Création de l'API REST
- Créer les routes CRUD pour gérer les personnes :
  - \`GET /personnes\` : Récupérer toutes les personnes.
  - \`GET /personnes/:id\` : Récupérer une personne par son ID.
  - \`POST /personnes\` : Ajouter une nouvelle personne.
  - \`PUT /personnes/:id\` : Mettre à jour une personne existante.
  - \`DELETE /personnes/:id\` : Supprimer une personne.

### 4. Intégration de Keycloak
- Configurer Keycloak pour gérer l'authentification OAuth 2.0.
- Protéger les routes de l'API avec \`keycloak.protect()\`.

### 5. Test des routes sécurisées avec Postman
- Obtenir un token d'accès en envoyant une requête POST à Keycloak.
- Utiliser le token pour accéder aux routes sécurisées de l'API.

## Structure du projet
- \`index.js\` : Point d'entrée de l'API.
- \`database.js\` : Configuration de la base de données SQLite.
- \`keycloak-config.json\` : Configuration de Keycloak.

## Comment exécuter le projet
1. Cloner le dépôt :
   \`\`\`bash
   git clone <url-du-dépôt>
   \`\`\`
2. Installer les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
3. Démarrer Keycloak avec Docker :
   \`\`\`bash
   docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -v keycloak_data:/opt/keycloak/data quay.io/keycloak/keycloak:latest start-dev
   \`\`\`
4. Configurer Keycloak :
   - Créer un Realm, un Client et des utilisateurs.
   - Récupérer le Client Secret.
5. Démarrer l'API :
   \`\`\`bash
   node index.js
   \`\`\`
6. Tester les routes avec Postman.

## Exemple de requêtes Postman
- **Obtenir un token d'accès** :
  - Méthode : \`POST\`
  - URL : \`http://localhost:8080/realms/api-realm/protocol/openid-connect/token\`
  - Body (x-www-form-urlencoded) :
    - \`grant_type\` : \`password\`
    - \`client_id\` : \`api-personne\`
    - \`client_secret\` : \`<votre-client-secret>\`
    - \`username\` : \`user1\`
    - \`password\` : \`password123\`

- **Accéder à une route sécurisée** :
  - Méthode : \`GET\`
  - URL : \`http://localhost:3000/personnes\`
  - Header :
    - \`Authorization\` : \`Bearer <votre-token>\`
