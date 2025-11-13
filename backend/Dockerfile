# Étape 1 : Build du projet avec Maven (locale ou CI/CD)
# Si tu veux builder à l’intérieur du conteneur, garde cette étape.
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour le cache Maven
COPY pom.xml .
RUN apt-get update && apt-get install -y maven && mvn dependency:go-offline

# Copier le reste du code et compiler
COPY src ./src
RUN mvn clean package -DskipTests


# Étape 2 : Image finale légère
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Installer netcat pour le wait.sh
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Copier le JAR compilé depuis la première étape
COPY --from=builder /app/target/demo-0.0.1-SNAPSHOT.jar ./app.jar

# Copier le script d’attente
COPY wait.sh ./wait.sh
RUN chmod +x wait.sh

EXPOSE 8082

# Lancer Spring Boot après vérification des dépendances
ENTRYPOINT ["./wait.sh"]
