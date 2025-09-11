pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/JamesLaurino/real_time_chat'
            }
        }
        stage('Build Docker image') {
            steps {
                sh 'sudo docker build -t my-webapp:latest .'
            }
        }
        stage('Run container') {
            steps {
                sh '''
                sudo docker rm -f my-webapp || truedocker run -d --name my-webapp -p 3000:3000 my-webapp:latest
                '''
            }
        }
    }
}
