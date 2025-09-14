FROM jenkins/jenkins:lts

USER root

# Installer Docker CLI, Git et Node.js
RUN apt-get update && apt-get install -y \
    git curl sudo \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && curl -fsSL https://get.docker.com -o get-docker.sh \
    && sh get-docker.sh \
    && rm get-docker.sh

# Revenir à l’utilisateur Jenkins
USER jenkins
