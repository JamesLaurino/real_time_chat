# ChatOne – Chat Temps Réel (Backend MVP)

## Description
ChatOne est une application backend Node.js pour un chat temps réel **one-to-one**, avec persistance MySQL et authentification JWT.
Elle permet à deux utilisateurs de communiquer instantanément, de conserver l’historique des messages et de connaître le statut online/offline des utilisateurs.

---

## Objectifs
- Authentification sécurisée via JWT.
- Envoi et réception instantanée de messages.
- Persistance des conversations et messages dans MySQL.
- Historique des messages accessible à tout moment.
- Statut online/offline visible en temps réel.

---

## Fonctionnalités Principales

### Authentification
- Inscription et connexion sécurisées.
- Hashage des mots de passe avec bcrypt.
- Génération de JWT pour sécuriser les routes et les connexions temps réel.

### Gestion des Conversations
- Création automatique de conversation entre deux utilisateurs.
- Stockage et récupération de l’historique des messages.
- Pagination des messages pour consulter les anciens échanges.

### Chat Temps Réel
- Envoi et réception de messages instantanés via Socket.io.
- Gestion des connexions utilisateurs avec un registre en mémoire (`userId → socketId`).
- Notification en temps réel des changements de statut online/offline.

### API REST
- Routes sécurisées pour récupérer les utilisateurs, conversations et messages.
- Réponses JSON standardisées avec succès ou erreur.

---

## Architecture Backend

/src
/config → configuration DB, JWT, Socket.io
/models → User, Conversation, Message (accès DB)
/services → logique métier (auth, messages, conversations)
/controllers → gestion des requêtes HTTP
/routes → endpoints REST (auth, conversations, messages, users)
/sockets → gestion temps réel et événements Socket.io
index.js → serveur Express + Socket.io

- Les controllers appellent les services, qui appellent les models → séparation claire des responsabilités.
- Socket.io utilise les services pour gérer messages et statut online, sans SQL direct dans les handlers socket.

---

## MVP Atteint
- Les utilisateurs peuvent créer un compte, se connecter et échanger des messages en temps réel.
- Historique des conversations sauvegardé et accessible via l’API.
- Statut online/offline visible en temps réel.

---

## Extension Future
- Passage à des **chat rooms multi-utilisateurs** : plusieurs participants dans une même conversation avec broadcast temps réel à tous.

---

## Tech Stack

- **Backend** : Node.js + Express
- **Temps réel** : Socket.io
- **Base de données** : MySQL
- **Authentification** : JWT
- **Tests** : Jest, Supertest