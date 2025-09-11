pipeline {
    agent any
    environment {
        DB_HOST = 'host.docker.internal'
        DB_USER = 'root'
        DB_PASSWORD = '1234'
        DB_NAME= 'real_chat_db_dev'
        JWT_SECRET='testinhg'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/JamesLaurino/real_time_chat'
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
                docker run -d --name my-webapp -p 3000:3000 my-webapp:latest
                '''
            }
        }
    }
}
