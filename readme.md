# Lancer l'application avec Docker

### 0. Lancer la base  de donnée ###

- docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=real_chat_db_dev -v C:/Dev/Docker/volumes/mysql:/var/lib/mysql mysql:latest

### 1. docker build -t real-time-chat . ###

### 2. docker run -d -p 3000:3000 --env-file .env.production --name chat-app real-time-chat ###

### 3. Tenter un signup

 -  POST http://localhost:3000/auth/signup
    Content-Type: application/json
    {"username":"koba","email": "koba@hotmail.com", "password": "password789"} 