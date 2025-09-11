# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (y compris devDependencies pour les builds si nécessaire)
RUN npm install

# Copier le reste du code source
COPY . .

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Définir l'environnement de production
ENV NODE_ENV=production
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASSWORD=1234
ENV DB_NAME=real_chat_db_dev
ENV JWT_SECRET=my_super_secret_dev_key

# Copier les dépendances de production depuis l'étape de build
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copier le code de l'application
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/db ./db

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
