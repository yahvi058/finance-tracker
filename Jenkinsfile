
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'finance-tracker'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out from GitHub'
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

        stage('Verify Image') {
            steps {
                sh 'docker images finance-tracker:latest'
                echo 'Docker image built successfully!'
            }
        }
    }

    post {
        success {
            echo 'Finance Tracker CI pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the Console Output.'
        }
    }
}
