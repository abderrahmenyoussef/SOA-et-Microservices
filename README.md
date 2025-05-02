# SOA et Microservices

Ce dépôt contient tous les travaux pratiques et le projet final du cours **SOA et Microservices**.

## Contenu du dépôt

### 📂 TP1 : Introduction aux APIs RESTful
- Tests d'APIs avec `request`, `fetch` et `axios`
- OpenWeatherMap, Open Library API, NASA API, RandomUser API

### 📂 TP2 : Création d'une API REST avec Express.js, SQLite, Keycloak et Docker
- Développement d'une API REST avec `Express.js` et `SQLite`
- Gestion des routes `CRUD` (Create, Read, Update, Delete)
- Intégration de `Keycloak` pour l'authentification et l'autorisation
- Conteneurisation du projet avec `Docker`
- Tests avec `Postman` et un client frontend

### 📂 TP2.5 : Gestion des CORS et Rate Limiting
- Mise en place de `CORS` pour permettre les requêtes multi-origines
- Ajout d'un `Rate Limiting` pour limiter le nombre de requêtes par IP
- Tests avec un fichier `HTML` et `Postman`

### 📂 TP3 : Création d'une API GraphQL avec Node.js et Apollo Server
- Développement d'une API GraphQL avec `Node.js`, `Express` et `Apollo Server`
- Création d'un schéma GraphQL pour gérer des tâches (`Task`)
- Implémentation des résolveurs pour les requêtes et mutations (`Query` et `Mutation`)
- Tests des requêtes et mutations avec `Apollo Sandbox`
- Gestion des opérations CRUD via GraphQL (Create, Read, Update, Delete)

### 📂 TP4 : Introduction à gRPC
- Mise en place d'un service gRPC avec `Node.js` et `protobuf`
- Création d'un fichier `.proto` pour définir le service et les messages
- Implémentation d'un serveur gRPC avec la méthode `SayHello`
- Tests du serveur gRPC avec `Postman`

### 📂 TP5 : Reverse Proxy WebSocket avec microservice gRPC
- Développement d'un système de chat en temps réel avec `gRPC` et `WebSocket`
- Mise en place d'un proxy WebSocket pour faire le lien entre les clients et le service gRPC
- Implémentation d'un serveur gRPC pour gérer les messages et l'historique du chat
- Développement d'une interface web pour envoyer et recevoir des messages en temps réel
- Tests de connexion WebSocket et communication client-serveur avec `Postman`

### 📂 TP6 : Système de Messagerie Apache Kafka avec MongoDB et API REST
- Mise en place d'une architecture de microservices basée sur `Apache Kafka`
- Développement d'un producteur Kafka qui envoie des messages à un topic
- Création d'un consommateur Kafka qui stocke les messages dans `MongoDB`
- Implémentation d'une API REST avec `Express` pour accéder aux messages stockés
- Développement d'une interface utilisateur web avec `Bootstrap 5` pour visualiser les messages en temps réel
- Tests de l'architecture complète : production de messages, consommation, stockage et affichage

### 📂 TP7 : Microservices Films & Séries avec gRPC, Kafka, MongoDB, GraphQL et API REST
- Architecture microservices complète pour la gestion de films et séries TV
- Communication inter-services avec `gRPC`
- Messagerie asynchrone avec `Apache Kafka`
- Stockage persistant avec `MongoDB` et `Mongoose`
- API REST et endpoint `GraphQL` via une API Gateway Express
- Interface web native (HTML/CSS/JS) pour ajouter et visualiser les films/séries
- Intégration de KafkaJS, dotenv, et gestion avancée des variables d'environnement
- Tests de bout en bout : ajout, consultation, persistance, messagerie et requêtes GraphQL

### 📂 TP8 : Microservices avec API Gateway Kong et Docker
- Implémentation d'une architecture microservices avec `Kong` comme API Gateway
- Configuration de Kong en mode DB-less avec fichier de configuration déclaratif (`kong.yml`)
- Développement de microservices `Node.js` simples pour la gestion des utilisateurs et produits
- Communication entre services via un réseau Docker dédié
- Orchestration complète avec `Docker Compose`
- Routage des requêtes HTTP via Kong (`/users` et `/products`)
- Tests des endpoints via l'API Gateway avec `curl` et `Postman`
- Administration de Kong via son API REST (port 8001)
- Résolution de problèmes d'accès à l'API d'administration de Kong (binding d'interfaces)
- Documentation complète du projet et des étapes de déploiement

## Objectif du dépôt
- Stocker et organiser les comptes rendus de tous les TPs
- Conserver le projet final du semestre
