# Lancer l'application avec Docker

### 1. docker build -t real-time-chat . ###

### 2. docker run -d -p 3000:3000 --env-file .env.production --name chat-app real-time-chat ###

### 3. Tenter un signup

 -  POST http://localhost:3000/auth/signup
    Content-Type: application/json
    {"username":"koba","email": "koba@hotmail.com", "password": "password789"} 