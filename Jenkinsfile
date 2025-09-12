pipeline {
    agent any
    environment {
        DB_HOST = 'localhost'
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
                bat 'docker build -t my-webapp:latest .'
            }
        }
        stage('Run container') {
            steps {
                withCredentials([
                    string(credentialsId: 'DB_USER', variable: 'DB_USER'),
                    string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    bat """
                    docker run -d \
                      --name my-webapp \
                      -p 3000:3000 \
                      -e DB_HOST=${DB_HOST} \
                      -e DB_NAME=${DB_NAME} \
                      -e DB_USER=root \
                      -e DB_PASSWORD=1234 \
                      -e JWT_SECRET=retrerererebbhjuiui \
                      my-webapp:latest
                    """
                }
            }
        }

    }
}
