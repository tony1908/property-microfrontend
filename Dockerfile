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