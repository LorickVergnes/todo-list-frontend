# Étape 1 : compilation TypeScript et build des fichiers statiques
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape 2 : image finale légère qui ne contient que nginx et les fichiers statiques
FROM nginx:1.29-alpine

# Adresse du backend, modifiable au lancement du conteneur
ENV BACKEND_URL=http://backend:3000

# L'image nginx génère /etc/nginx/conf.d/default.conf à partir de ce modèle au démarrage
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
