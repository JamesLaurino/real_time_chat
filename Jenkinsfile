pipeline {
    agent any
    environment {
        DB_HOST = '192.168.129.66'
        DB_NAME = 'real_chat_db_dev'
        NODE_ENV = 'development'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/JamesLaurino/real_time_chat'
            }
        }
       stage('Clean and Stop') {
            steps {
                script {
                    def containerExists = bat(script: "docker ps -a --filter \"name=real_time_chat_backend\" --format \"{{.Names}}\"", returnStdout: true).trim()
                    if (containerExists == 'real_time_chat_backend') {
                        echo 'Stopping and removing existing container...'
                        bat "docker stop real_time_chat_backend"
                        bat "docker rm real_time_chat_backend"
                    } else {
                        echo 'No existing container found. Skipping removal.'
                    }
                }
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
                      -t real_time_chat_backend:latest .
                    """
                }
            }
        }
        stage('Run container') {
            steps {
                bat """
                docker run -d ^
                  --name real_time_chat_backend ^
                  -p 3000:3000 ^
                  real_time_chat_backend:latest
                """
            }
        }
    }
}