# Todo List — Frontend

Interface web de la Todo List, écrite en TypeScript avec Vite et servie par nginx dans un conteneur Docker.

L'API et la base de données se trouvent dans le dépôt du backend. Le navigateur ne parle qu'à ce service : nginx sert les fichiers statiques et relaie les requêtes `/api/*` vers le backend.

## Lancer le frontend

```bash
docker compose up --build -d
```

L'application est disponible sur http://localhost:8090. Sans backend joignable, la page s'affiche mais les appels à l'API échouent.

## Configuration

Pour changer les valeurs par défaut, copier `.env.example` vers `.env`. Le fichier `.env` n'est pas versionné.

| Variable        | Défaut                | Rôle                                         |
| --------------- | --------------------- | -------------------------------------------- |
| `FRONTEND_PORT` | `8090`                | Port de l'application sur la machine         |
| `BACKEND_URL`   | `http://backend:3000` | Adresse de l'API vue depuis le conteneur     |

La valeur par défaut de `BACKEND_URL` désigne le service `backend` du même réseau Docker. Pour viser une API lancée directement sur la machine, utiliser `http://host.docker.internal:3000`.

Dans le conteneur, nginx écoute sur le port donné par la variable `PORT` (80 par défaut), que les hébergeurs définissent eux-mêmes.

## Déploiement sur Render

Le backend doit être déployé en premier, pour connaître son adresse publique.

1. *New > Web Service*, sélectionner ce dépôt. Render détecte le `Dockerfile` (langage *Docker*). Choisir le plan *Free*.
2. Ajouter la variable d'environnement `BACKEND_URL` avec l'adresse publique du backend, sans barre oblique finale : `https://<nom-du-backend>.onrender.com`.

L'application est ensuite disponible sur `https://<nom-du-service>.onrender.com`. Après une période d'inactivité, le premier affichage puis le premier appel à l'API prennent chacun environ une minute, le temps que les deux services gratuits se réveillent.

## Application complète

Pour lancer le frontend avec l'API, cloner les deux dépôts côte à côte dans des dossiers nommés `backend` et `frontend`, puis créer dans le dossier parent un fichier `docker-compose.yml` :

```yaml
include:
  - backend/docker-compose.yml
  - frontend/docker-compose.yml
```

`docker compose up --build -d` lancé depuis ce dossier parent démarre alors les trois services sur le même réseau.

## Développement hors Docker

```bash
npm install
npm run dev
```

Le serveur Vite (http://localhost:5173) redirige `/api` vers `http://localhost:3000` : le backend doit donc tourner sur ce port.

## Structure

| Fichier               | Rôle                                           |
| --------------------- | ---------------------------------------------- |
| `src/main.ts`         | Affichage et gestion des événements            |
| `src/api.ts`          | Appels HTTP vers l'API                         |
| `nginx.conf.template` | Configuration nginx, complétée au démarrage    |
| `Dockerfile`          | Build en deux étapes : Node puis nginx         |
