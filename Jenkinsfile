pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_NAME = 'property-service'
        DOCKER_REGISTRY = 'docker.io'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        NODE_VERSION = '20'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                sh 'npm run lint'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'eslint-report.html',
                        reportName: 'ESLint Report'
                    ])
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                echo 'Running unit tests with Vitest...'
                sh 'npm run test -- --reporter=junit --outputFile=test-results.xml'
            }
            post {
                always {
                    junit 'test-results.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building React application...'
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('E2E Tests') {
            steps {
                echo 'Running E2E tests with Playwright...'
                sh '''
                    # Install Playwright browsers if not cached
                    npx playwright install --with-deps
                    
                    # Start preview server in background
                    npm run preview &
                    PREVIEW_PID=$!
                    
                    # Wait for server to start
                    sleep 5
                    
                    # Run E2E tests
                    npm run test:e2e
                    
                    # Kill preview server
                    kill $PREVIEW_PID || true
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security audit...'
                sh '''
                    npm audit --audit-level=high --json > npm-audit.json || true
                    # Install audit-ci for better CI integration
                    npx audit-ci --moderate
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit.json', allowEmptyArchive: true
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    buildingTag()
                }
            }
            steps {
                script {
                    echo 'Building Docker image...'
                    
                    // Generate image tags
                    def imageTag = env.BUILD_NUMBER
                    def latestTag = 'latest'
                    
                    if (env.BRANCH_NAME == 'main') {
                        latestTag = 'stable'
                    } else if (env.BRANCH_NAME == 'develop') {
                        latestTag = 'dev'
                    } else if (env.TAG_NAME) {
                        imageTag = env.TAG_NAME
                        latestTag = 'latest'
                    }
                    
                    // Build image with multiple tags
                    sh """
                        docker build -t ${DOCKER_IMAGE_NAME}:${imageTag} .
                        docker tag ${DOCKER_IMAGE_NAME}:${imageTag} ${DOCKER_IMAGE_NAME}:${latestTag}
                        docker tag ${DOCKER_IMAGE_NAME}:${imageTag} ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${imageTag}
                        docker tag ${DOCKER_IMAGE_NAME}:${imageTag} ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${latestTag}
                    """
                    
                    // Store tags for next stage
                    env.IMAGE_TAG = imageTag
                    env.LATEST_TAG = latestTag
                }
            }
        }
        
        stage('Test Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    buildingTag()
                }
            }
            steps {
                script {
                    echo 'Testing Docker image...'
                    sh """
                        # Run container in background
                        docker run -d --name test-container -p 8080:3000 ${DOCKER_IMAGE_NAME}:${env.IMAGE_TAG}
                        
                        # Wait for container to start
                        sleep 10
                        
                        # Test health endpoint
                        curl -f http://localhost:8080/ || exit 1
                        
                        # Test federation endpoint
                        curl -f http://localhost:8080/assets/remoteEntry.js || exit 1
                        
                        # Cleanup
                        docker stop test-container
                        docker rm test-container
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    buildingTag()
                }
            }
            steps {
                script {
                    echo 'Pushing Docker image to Docker Hub...'
                    sh """
                        echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin
                        
                        docker push ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${env.IMAGE_TAG}
                        docker push ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${env.LATEST_TAG}
                        
                        docker logout
                    """
                }
            }
            post {
                always {
                    sh '''
                        # Cleanup local images
                        docker rmi ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} || true
                        docker rmi ${DOCKER_IMAGE_NAME}:${LATEST_TAG} || true
                        docker rmi ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${IMAGE_TAG} || true
                        docker rmi ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${LATEST_TAG} || true
                    '''
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    # Example deployment to staging
                    echo "Deploying ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:dev to staging"
                    
                    # Update docker-compose or Kubernetes manifests
                    # kubectl set image deployment/property-service property-service=${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:dev
                    
                    # Or trigger deployment webhook
                    # curl -X POST "https://staging-deploy-webhook.com/deploy" -H "Authorization: Bearer $DEPLOY_TOKEN" -d "{\"image\": \"${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:dev\"}"
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                buildingTag()
            }
            steps {
                script {
                    echo 'Deploying to production environment...'
                    
                    // Manual approval for production deployments
                    input message: 'Deploy to production?', ok: 'Deploy'
                    
                    sh '''
                        echo "Deploying ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${TAG_NAME} to production"
                        
                        # Update production deployment
                        # kubectl set image deployment/property-service property-service=${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${TAG_NAME}
                        
                        # Or trigger production deployment
                        # curl -X POST "https://prod-deploy-webhook.com/deploy" -H "Authorization: Bearer $PROD_DEPLOY_TOKEN" -d "{\"image\": \"${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${TAG_NAME}\"}"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
            // Send success notification
            // slackSend channel: '#deployments', color: 'good', message: "✅ ${env.JOB_NAME} - ${env.BUILD_NUMBER} deployed successfully"
        }
        failure {
            echo '❌ Pipeline failed!'
            // Send failure notification
            // slackSend channel: '#deployments', color: 'danger', message: "❌ ${env.JOB_NAME} - ${env.BUILD_NUMBER} failed"
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings!'
        }
    }
}