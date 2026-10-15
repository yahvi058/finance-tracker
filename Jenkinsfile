
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE:/app" \
                      -w /app \
                      node:22-alpine \
                      sh -c "npm install && npm run build"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t finance-tracker:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    sh '''
                        set +x
                        echo "$DOCKER_TOKEN" | docker login \
                          -u "$DOCKER_USER" --password-stdin
                        docker tag finance-tracker:latest \
                          yahvisingh/finance-tracker:latest
                        docker push yahvisingh/finance-tracker:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Verify Image') {
            steps {
                sh 'docker images yahvisingh/finance-tracker:latest'
            }
        }
    }

    post {
        success {
            echo 'Finance Tracker image pushed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
