# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files for workspace resolution
COPY package*.json ./

# Copy shared package
COPY shared ./shared

# Copy video-processing-service package
COPY video-processing-service ./video-processing-service

# Install ALL dependencies from root
RUN npm install

# Explicitly install shared dependencies
WORKDIR /app/shared
RUN npm install

# Build shared
RUN npm run build

# Explicitly install video-processing-service dependencies
WORKDIR /app/video-processing-service
RUN npm install

# Build video-processing-service
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install ffmpeg in the container
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy the workspace directories (needed for npm to recognize workspaces)
COPY shared/package*.json ./shared/
COPY video-processing-service/package*.json ./video-processing-service/

# Install production dependencies
RUN npm install --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/video-processing-service/dist ./video-processing-service/dist

# Set working directory to the service
WORKDIR /app/video-processing-service

# Make port 8080 available
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "serve" ]