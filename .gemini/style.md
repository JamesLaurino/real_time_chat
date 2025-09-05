# 🎯 Style de code pour mon projet Chat Backend (Node.js, Express, MySQL, Socket.io)

## 1. Architecture & Organisation
- Suivre une architecture **propre et modulaire** :
    - `/config` : configuration (DB, JWT, etc.)
    - `/models` : définitions des modèles et accès DB
    - `/services` : logique métier (auth, user, messages, conversation)
    - `/controllers` : réception des requêtes HTTP, validation, appel aux services
    - `/routes` : routes Express, appellent uniquement les controllers
    - `/sockets` : logique temps réel (Socket.io), utilise aussi les services
- **Pas de logique SQL ou métier dans les routes** → routes → controllers → services → models
- Toujours séparer clairement les responsabilités.

## 2. Qualité & Lisibilité
- Utiliser **ES Modules** (`import/export`) et non `require`.
- Utiliser **async/await** (jamais de .then/.catch chaînés).
- Respecter la convention de nommage :
    - Fichiers : kebab-case (`user.service.js`)
    - Classes : PascalCase (`UserModel`)
    - Fonctions/variables : camelCase (`getUserById`)
- Indenter avec **2 espaces**.
- Garder un style **sobre, lisible, pro** (pas de console.log de debug sauf explicite).
- Ajouter **commentaires pédagogiques** courts pour expliquer la logique clé.

## 3. Sécurité
- Utiliser **bcryptjs** pour hasher les mots de passe.
- Utiliser **jsonwebtoken (HS256)** pour l’auth JWT.
- Ne jamais stocker de mot de passe en clair.
- Respecter la règle : un token JWT expire (par défaut 1h).
- Middleware d’auth obligatoire pour toutes les routes protégées.

## 4. Base de données
- Utiliser **mysql2/promise** pour la connexion.
- Utiliser des requêtes SQL préparées (jamais concaténer de strings).
- Créer des **models** pour interagir avec la DB (ex: `UserModel` avec méthodes `findByEmail`, `create`, etc.).
- Gérer les erreurs proprement (try/catch, logs).

## 5. Socket.io
- Authentifier la connexion Socket.io via le JWT.
- Mapper `{ userId: socketId }` pour retrouver les users connectés.
- Pas de logique SQL dans le handler socket → toujours passer par un service.
- Gérer proprement les erreurs d’émission (ex: si destinataire offline).

## 6. Bonnes pratiques
- Toujours valider les entrées (via `express-validator` ou logique simple).
- Ne pas exposer de données sensibles dans les réponses API.
- Retourner des réponses JSON cohérentes :
  ```json
  { "success": true, "data": { ... } }
  { "success": false, "error": "Message d'erreur" }
