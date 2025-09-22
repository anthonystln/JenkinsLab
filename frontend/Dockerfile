# Étape 1 : build React
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : servir avec Nginx
FROM nginx:alpine
ARG API_URL
ENV API_URL=${API_URL}
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]