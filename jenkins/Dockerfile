FROM jenkins/jenkins:lts

USER root

# Installer Java 17, Maven et Git et docker-compose
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven git docker.io curl && \
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose && \
    rm -rf /var/lib/apt/lists/*

# Définir JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Donner accès à Docker depuis l’utilisateur Jenkins
RUN usermod -aG docker jenkins

# Revenir à l’utilisateur Jenkins
USER jenkins
