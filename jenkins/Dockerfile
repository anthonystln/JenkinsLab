FROM jenkins/jenkins:lts

USER root

# Installer Java 17, Maven et Git
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven git docker.io && \
    rm -rf /var/lib/apt/lists/*

# Définir JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Revenir à l’utilisateur Jenkins
USER jenkins
