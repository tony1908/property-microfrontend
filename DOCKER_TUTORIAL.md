# Docker Production Setup Tutorial

This tutorial explains how to dockerize a React + Vite microfrontend application for production deployment.

## Overview

This project uses a multi-stage Docker build to create an optimized production container that:
- Builds the React application with Vite
- Serves static files using the `serve` package
- Supports Module Federation (microfrontend architecture)
- Implements security best practices with non-root user
- Enables CORS for cross-origin microfrontend loading

## Files Created

### 1. Dockerfile (Multi-stage Build)

```dockerfile
# Multi-stage Dockerfile for Microfrontend Production

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the microfrontend
RUN npm run build

# Stage 2: Production - Simple static file server
FROM node:20-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

# Create app user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

# Create app directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start serve with CORS enabled for microfrontend
CMD ["serve", "-s", "dist", "-l", "3000", "--cors"]
```

### 2. .dockerignore

```
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist
build

# Development
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage
.nyc_output
test-results
playwright-report

# IDE and editor files
.vscode
.idea
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
README.md
*.md

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# ESLint cache
.eslintcache

# TypeScript cache
*.tsbuildinfo

# Playwright
test-results/
playwright-report/
playwright/.cache/
```

### 3. docker-compose.yml

```yaml
version: '3.8'

services:
  property-service:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 3s
      start_period: 5s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.property-service.rule=Host(\`property-service.local\`)"
      - "traefik.http.services.property-service.loadbalancer.server.port=3000"
```

## Key Features Explained

### Multi-Stage Build Benefits

1. **Builder Stage**: Full development environment for building the application with all dependencies
2. **Production Stage**: Minimal runtime with only built assets and static file server

### Security Implementations

- **Non-root user**: Container runs as `appuser` (UID 1001) for security
- **Minimal dependencies**: Only includes `serve` package and built assets
- **Alpine Linux**: Lightweight and secure base image

### Microfrontend Support

- **CORS enabled**: `--cors` flag allows cross-origin requests for module federation
- **Static file serving**: Serves all built assets including `remoteEntry.js`
- **SPA routing**: `-s` flag supports single-page application routing
- **Port 3000**: Standard development port for consistency

### Performance Optimizations

- **Lightweight server**: `serve` package is minimal and fast
- **Static assets**: Pre-built files for optimal performance
- **Health checks**: Built-in container health monitoring
- **Multi-stage build**: Smaller final image without build dependencies

## Configuration Fix Applied

### Vite Configuration Update

Added TypeScript reference for Vitest to resolve build issues:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
// ... rest of config
```

This was necessary because the build process was failing due to TypeScript not recognizing the `test` configuration block.

## Usage Instructions

### Building the Docker Image

```bash
# Build the production image
docker build -t property-service:latest .

# Build with specific tag
docker build -t property-service:v1.0.0 .
```

### Running the Container

```bash
# Run with port mapping
docker run -d -p 3001:3000 --name property-service property-service:latest

# Run with docker-compose (recommended)
docker-compose up -d

# View logs
docker-compose logs -f property-service
```

### Testing the Deployment

```bash
# Test main application
curl http://localhost:3001

# Test federation entry point
curl http://localhost:3001/assets/remoteEntry.js

# Check health status
docker-compose ps
```

### Stopping the Service

```bash
# Stop docker-compose services
docker-compose down

# Stop individual container
docker stop property-service
docker rm property-service
```

## Production Deployment Considerations

### Environment Variables

Consider adding these environment variables for production:

```yaml
environment:
  - NODE_ENV=production
  - PORT=80
  - API_BASE_URL=https://api.yourdomain.com
```

### Reverse Proxy Setup

The container includes Traefik labels for easy reverse proxy setup:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.property-service.rule=Host(\`property-service.yourdomain.com\`)"
  - "traefik.http.routers.property-service.tls=true"
  - "traefik.http.routers.property-service.tls.certresolver=letsencrypt"
```

### Scaling Considerations

For horizontal scaling:

```yaml
version: '3.8'
services:
  property-service:
    # ... existing config
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

## Troubleshooting

### Common Issues

1. **Build fails with Node version errors**: Ensure Node 20+ is used (addressed in Dockerfile)
2. **Federation not working**: Check CORS headers on remoteEntry.js endpoint
3. **Permission denied**: Verify non-root user has proper file ownership
4. **Health check fails**: Ensure wget is available in container (included in alpine base)

### Debug Commands

```bash
# Access container shell
docker exec -it property-service sh

# Check nginx configuration
docker exec property-service nginx -t

# View nginx logs
docker exec property-service tail -f /var/log/nginx/error.log

# Check file permissions
docker exec property-service ls -la /usr/share/nginx/html
```

This setup provides a robust, secure, and scalable foundation for deploying React microfrontends in production environments.

## Jenkins CI/CD Pipeline

### Overview

The Jenkins pipeline (`Jenkinsfile`) provides a complete CI/CD workflow that:
- Runs comprehensive tests (lint, unit, E2E)
- Performs security audits
- Builds and tests Docker images
- Deploys to Docker Hub
- Supports multiple environments (staging/production)

### Pipeline Stages

1. **Checkout**: Gets source code from repository
2. **Install Dependencies**: Installs Node.js packages with `npm ci`
3. **Lint**: Runs ESLint for code quality
4. **Unit Tests**: Executes Vitest tests with coverage reporting
5. **Build Application**: Creates production build with Vite
6. **E2E Tests**: Runs Playwright end-to-end tests
7. **Security Scan**: Performs npm audit for vulnerabilities
8. **Build Docker Image**: Creates Docker image with proper tagging
9. **Test Docker Image**: Validates the built container
10. **Push to Docker Hub**: Publishes image to Docker registry
11. **Deploy**: Automated deployment to staging/production

### Prerequisites

#### Jenkins Setup

1. **Required Plugins**:
   ```
   - Docker Pipeline
   - NodeJS Plugin
   - HTML Publisher
   - JUnit Plugin
   - Credentials Plugin
   ```

2. **Tools Configuration**:
   - Configure Node.js 20+ in Jenkins Global Tool Configuration
   - Install Docker on Jenkins agents

#### Credentials Setup

Create these credentials in Jenkins:

1. **dockerhub-credentials** (Username with password):
   - Username: Your Docker Hub username
   - Password: Docker Hub access token

2. **deploy-token** (Secret text - optional):
   - For staging deployment webhook

3. **prod-deploy-token** (Secret text - optional):
   - For production deployment webhook

#### Docker Hub Repository

Create a repository on Docker Hub:
```
https://hub.docker.com/repository/create
Repository name: property-service
Visibility: Public or Private
```

### Pipeline Configuration

#### Branch-based Deployment Strategy

- **develop branch**: Deploys to staging with `dev` tag
- **main branch**: Creates `stable` tag (manual production deployment)
- **tags**: Triggers production deployment with version tag

#### Image Tagging Strategy

```
Format: username/property-service:tag

Examples:
- myuser/property-service:123 (build number)
- myuser/property-service:dev (develop branch)
- myuser/property-service:stable (main branch)
- myuser/property-service:v1.0.0 (git tag)
- myuser/property-service:latest (releases)
```

### Usage

#### Setting up the Pipeline

1. **Create Jenkins Pipeline Job**:
   ```
   New Item → Pipeline → Enter name → OK
   ```

2. **Configure Pipeline**:
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your Git repository URL
   - **Script Path**: Jenkinsfile

3. **Configure Webhooks** (optional):
   - GitHub: Settings → Webhooks → Add webhook
   - Payload URL: `http://jenkins-url/github-webhook/`
   - Content type: application/json
   - Events: Push, Pull requests

#### Running the Pipeline

**Automatic Triggers**:
- Push to any branch triggers the pipeline
- Only `main`, `develop`, and tags build/deploy Docker images

**Manual Triggers**:
- Click "Build Now" in Jenkins interface
- Production deployments require manual approval

#### Monitoring

**Jenkins Dashboard**:
- Build status and history
- Test results and coverage reports
- Deployment logs

**Reports Available**:
- ESLint code quality report
- Vitest unit test results
- Coverage reports
- Playwright E2E test results
- Security audit results

### Environment-Specific Deployment

#### Staging (develop branch)

Automatically deploys to staging environment:
```bash
# Example Kubernetes deployment
kubectl set image deployment/property-service \
  property-service=myuser/property-service:dev
```

#### Production (tags)

Requires manual approval and uses version tags:
```bash
# Production deployment with version tag
kubectl set image deployment/property-service \
  property-service=myuser/property-service:v1.0.0
```

### Customization Options

#### Adding Slack Notifications

Uncomment and configure Slack integration:
```groovy
// In post section
slackSend channel: '#deployments', 
          color: 'good', 
          message: "✅ ${env.JOB_NAME} deployed successfully"
```

#### Custom Deployment Scripts

Replace the deployment stages with your specific deployment logic:
```groovy
stage('Deploy to Production') {
    steps {
        script {
            // Custom deployment logic
            sh './deploy-scripts/production-deploy.sh'
        }
    }
}
```

#### Environment Variables

Add environment-specific variables:
```groovy
environment {
    STAGING_API_URL = 'https://api-staging.yourdomain.com'
    PROD_API_URL = 'https://api.yourdomain.com'
    DOCKER_REGISTRY = 'your-private-registry.com'
}
```

### Troubleshooting

#### Common Issues

1. **Docker permission denied**:
   ```bash
   # Add jenkins user to docker group
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

2. **Node.js not found**:
   - Verify Node.js plugin installation
   - Check Global Tool Configuration

3. **Tests failing**:
   - Check test environment setup
   - Verify Playwright browser installation

4. **Docker Hub push fails**:
   - Verify credentials configuration
   - Check repository permissions

#### Debug Commands

```bash
# Check Docker on Jenkins agent
docker --version
docker info

# Verify Node.js installation
node --version
npm --version

# Test Docker Hub credentials
echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
```

This Jenkins pipeline provides a production-ready CI/CD workflow with comprehensive testing, security scanning, and automated deployment capabilities.

## GitHub Actions CI/CD Pipeline

### Overview

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) provides a simplified CI/CD pipeline focused on core functionality:

- **Test & Build**: Lint, test, and build the application
- **Docker Build**: Build and push Docker images to Docker Hub
- **Deploy**: Simple deployment to staging and production

### Workflow Jobs

1. **test**: Runs linting, unit tests, and builds the application
2. **docker**: Builds, pushes, and tests Docker images
3. **deploy**: Deploys to staging (develop branch) or production (tags)

### Prerequisites

#### Required Secrets

Add these secrets in repository Settings → Secrets and variables → Actions:

```
DOCKERHUB_USERNAME - Your Docker Hub username
DOCKERHUB_TOKEN - Your Docker Hub access token
```

#### Docker Hub Setup

1. Create a Docker Hub repository: `https://hub.docker.com/repository/create`
2. Generate an access token: Account Settings → Security → New Access Token

### How It Works

- **Pull Requests**: Run tests and build
- **develop branch**: Test, build, push Docker image, deploy to staging
- **main branch**: Test, build, push Docker image with `latest` tag
- **tags (v*)**: Test, build, push Docker image, deploy to production

### Docker Tags

- `develop` → `username/property-service:dev`
- `main` → `username/property-service:latest`
- `v1.0.0` → `username/property-service:v1.0.0`

### Usage

#### Deploying to Production

```bash
# Create and push a tag to trigger production deployment
git tag v1.0.0
git push origin v1.0.0
```

#### Customizing Deployment

Edit the deployment steps in the workflow file:

```yaml
- name: Deploy to production
  if: startsWith(github.ref, 'refs/tags/v')
  run: |
    TAG_NAME=${GITHUB_REF#refs/tags/}
    # Add your deployment commands here
    # kubectl set image deployment/property-service property-service=myuser/property-service:${TAG_NAME}
```

This simplified GitHub Actions workflow provides essential CI/CD functionality with minimal complexity.