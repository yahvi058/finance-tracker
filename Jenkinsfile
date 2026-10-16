
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_NAME = 'yahvisingh/finance-tracker'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                stash name: 'k8s-manifests', includes: 'k8s/**'
            }
        }

        stage('Build React App') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'supabase-url',
                        variable: 'VITE_SUPABASE_URL'
                    ),
                    string(
                        credentialsId: 'supabase-key',
                        variable: 'VITE_SUPABASE_KEY'
                    )
                ]) {
                    sh '''
                        set +x
                        docker run --rm \
                          -v "$WORKSPACE:/app" \
                          -w /app \
                          -e VITE_SUPABASE_URL \
                          -e VITE_SUPABASE_KEY \
                          node:22-alpine \
                          sh -c "npm install && npm run build"
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'supabase-url',
                        variable: 'SUPABASE_URL'
                    ),
                    string(
                        credentialsId: 'supabase-key',
                        variable: 'SUPABASE_KEY'
                    )
                ]) {
                    sh '''
                        set +x
                        docker build \
                          --build-arg VITE_SUPABASE_URL="$SUPABASE_URL" \
                          --build-arg VITE_SUPABASE_KEY="$SUPABASE_KEY" \
                          -t "$IMAGE_NAME:$IMAGE_TAG" .
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$DOCKER_TOKEN" | docker login \
                          -u "$DOCKER_USER" --password-stdin
                        docker push "$IMAGE_NAME:$IMAGE_TAG"
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Minikube') {
            agent {
                label 'windows-minikube'
            }

            steps {
                unstash 'k8s-manifests'

                powershell '''
                    $ErrorActionPreference = "Stop"

                    kubectl apply -f k8s/deployment.yaml
                    if ($LASTEXITCODE -ne 0) {
                        throw "Deployment manifest failed"
                    }

                    kubectl apply -f k8s/service.yaml
                    if ($LASTEXITCODE -ne 0) {
                        throw "Service manifest failed"
                    }

                    kubectl rollout restart deployment/finance-tracker
                    if ($LASTEXITCODE -ne 0) {
                        throw "Rollout restart failed"
                    }

                    kubectl rollout status deployment/finance-tracker --timeout=180s
                    if ($LASTEXITCODE -ne 0) {
                        throw "Deployment rollout failed"
                    }

                    kubectl get pods
                    kubectl get services
                '''
            }
        }

        stage('Verify Image') {
            steps {
                sh 'docker images "$IMAGE_NAME:$IMAGE_TAG"'
            }
        }
    }

    post {
        success {
            echo 'Finance Tracker image built, pushed, and deployed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
