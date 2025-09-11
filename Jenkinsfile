pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/JamesLaurino/real_time_chat'
            }
        }
        stage('Build Docker image') {
            steps {
                sh 'docker build -t my-webapp:latest .'
            }
        }
        stage('Run container') {
            steps {
                sh '''
                docker rm -f my-webapp || truedocker run -d --name my-webapp -p 3000:3000 my-webapp:latest
                '''
            }
        }
    }
}
