pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                dir('app') {
                    sh 'mvn clean install'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('app') {
                    sh 'docker build -t java-app:1.0.0 .'
                }
            }
        }
    }
}
