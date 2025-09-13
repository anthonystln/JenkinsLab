# app/Dockerfile
FROM node:20-alpine

# Créer dossier de l'app
WORKDIR /usr/src/app

# Copier les fichiers et installer les dépendences
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Lancer l'app
CMD [ "npm", "start" ]