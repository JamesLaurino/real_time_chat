# Real Time Chat - Multichat Application

## 📂 FICHIER POUR GEMINI LLM

### 🎯 Fichier de documentation complet
**Nom du fichier:** `claude.md`
**Chemin complet:** `C:\Users\lungs\Documents\GitHub\real_time_chat\claude.md`

### 📋 Contenu du fichier
- ✅ Plan d'implémentation React Frontend (Multichat)
- ✅ Documentation complète des changements Backend (en français)
- ✅ Liste de tous les événements Socket.IO disponibles
- ✅ API REST endpoints
- ✅ Données de test (8 utilisateurs, 3 multichats)
- ✅ Instructions détaillées pour Gemini

### 🌿 Branche Git
**Branche actuelle:** `feature/milestone-multichat-premium`
(Contient tous les changements backend pour le multichat)

### ⚠️ Important
- **Backend = READ-ONLY** : Ne pas modifier les fichiers backend, tout est déjà fait
- **Frontend à créer** : Utiliser React 18+ avec Socket.IO Client
- **Lire `claude.md` en entier** avant de commencer

---

## 🚀 Lancer l'application avec Docker

### 0. Lancer la base de donnée

```bash
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=real_chat_db_dev -v C:/Dev/Docker/volumes/mysql:/var/lib/mysql mysql:latest
```

### 1. Build l'image Docker

```bash
docker build -t real-time-chat .
```

### 2. Lancer le conteneur

```bash
docker run -d -p 3000:3000 --env-file .env.production --name chat-app real-time-chat
```

### 3. Tester un signup

```bash
POST http://localhost:3000/auth/signup
Content-Type: application/json

{"username":"koba","email": "koba@hotmail.com", "password": "password789"}
```

---

## 🧪 Lancer en mode développement (sans Docker)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Charger les données de test
```bash
npm run seed
```

### 3. Lancer le serveur
```bash
npm start
```

Le serveur démarre sur **http://localhost:3000**

---

## 📚 Documentation

- **claude.md** - Guide complet pour Gemini (plan React + backend changes)
- **API_DOCUMENTATION.md** - Documentation API REST
- **FRONTEND_API_DOCS.md** - Documentation API Frontend
- **http/milestone5.http** - Exemples de requêtes HTTP 