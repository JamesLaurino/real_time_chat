# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Définir les ARG (passables au build)
ARG NODE_ENV
ARG DB_HOST=82.29.172.74
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME=real_chat_db_dev
ARG JWT_SECRET

# Définir les ENV à partir des ARG
ENV NODE_ENV=${NODE_ENV}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV JWT_SECRET=${JWT_SECRET}

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./

EXPOSE 3000
CMD sh -c "npm run db:seed && npm start"
