pipeline {
    agent any
    environment {
        DB_HOST = '82.29.172.74'
        DB_NAME = 'real_chat_db_dev'
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
                withCredentials([
                    string(credentialsId: 'DB_USER', variable: 'DB_USER'),
                    string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    sh """
                    docker run -d \
                      --name my-webapp \
                      -p 3000:3000 \
                      -e DB_HOST=${DB_HOST} \
                      -e DB_NAME=${DB_NAME} \
                      -e DB_USER=${DB_USER} \
                      -e DB_PASSWORD=${DB_PASSWORD} \
                      -e JWT_SECRET=${JWT_SECRET} \
                      my-webapp:latest
                    """
                }
            }
        }

    }
}
