pipeline {
    agent any
    
    environment {
        DOCKER_USER = 'mndlr'
        DOCKER_PASS = credentials('dockerhub') // ID Jenkins dans les credentials
        IMAGE_BACK    = 'java-app'
        IMAGE_FRONT   = 'react-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Maven (Backend)') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $DOCKER_USER/$IMAGE_BACK:$IMAGE_TAG .'
                }
            }
        }
        
        stage('Push Backend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_USER/$IMAGE_BACK:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $DOCKER_USER/$IMAGE_FRONT:$IMAGE_TAG .'
                }
            }
        }

        stage('Push Frontend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKER_USER/$IMAGE_FRONT:$IMAGE_TAG'
                }
            }
        }

        stage('Deploy to Local Docker') {
            steps {
                sh '''
                docker-compose -f jenkins/deploy/docker-compose.yml down || true
                docker-compose -f jenkins/deploy/docker-compose.yml pull
                docker-compose -f jenkins/deploy/docker-compose.yml up -d --remove-orphans
                '''
            }
        }
    }
}
