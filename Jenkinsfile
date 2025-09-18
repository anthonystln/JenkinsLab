pipeline {
    agent any
    
    environment {
        DOCKER_USER = 'mndlr'
        DOCKER_PASS = credentials('dockerhub') // ID Jenkins dans les credentials
        IMAGE_NAME = 'java-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Maven') {
            steps {
                dir('app') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('app') {
                    sh 'docker build -t $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG .'
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to Local Docker') {
            steps {
                sh '''
                docker compose -f jenkins/deploy/docker-compose.yml down || true
                docker compose -f jenkins/deploy/docker-compose pull
                docker compose -f jenkins/deploy/docker-compose.yml up -d
                '''
            }
        }
    }
}
