pipeline {
    agent any
    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'real_chat_db_dev'
        NODE_ENV = 'development'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/JamesLaurino/real_time_chat'
            }
        }
        stage('Build Docker image') {
            steps {
                withCredentials([
                    string(credentialsId: 'DB_USER', variable: 'DB_USER'),
                    string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    bat """
                    docker build ^
                      --build-arg NODE_ENV=${NODE_ENV} ^
                      --build-arg DB_HOST=${DB_HOST} ^
                      --build-arg DB_NAME=${DB_NAME} ^
                      --build-arg DB_USER=${DB_USER} ^
                      --build-arg DB_PASSWORD=${DB_PASSWORD} ^
                      --build-arg JWT_SECRET=${JWT_SECRET} ^
                      -t my-webapp:latest .
                    """
                }
            }
        }
        stage('Run container') {
            steps {
                bat """
                docker run -d ^
                  --name my-webapp ^
                  -p 3000:3000 ^
                  my-webapp:latest
                """
            }
        }
    }
}
