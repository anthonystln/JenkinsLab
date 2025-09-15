FROM openjdk:17-jdk-slim

WORKDIR /app

# Copier le JAR généré par Maven
COPY target/java-app-1.0.0.jar app.jar

# Lancer automatiquement l'application
CMD [ "java", "-jar", "app.jar" ]