FROM openjdk:17-jdk-slim

WORKDIR /app

# Copier le JAR généré par Maven
COPY target/demo-1.0.0.jar app.jar

EXPOSE 8080

# Lancer automatiquement l'application
ENTRYPOINT [ "java", "-jar", "app.jar" ]