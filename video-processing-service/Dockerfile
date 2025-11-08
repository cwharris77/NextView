# Build stage
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

COPY ../shared ./shared

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install ffmpeg in the container
RUN apk add --no-cache ffmpeg

# Set the working directory in the container
WORKDIR /app    

# Copy only the necessary files from the builder stage
COPY package*.json ./

# Copy production dependencies
RUN npm install --only=production

# Copy the built application code from the builder stage
COPY --from=builder /app/dist ./dist

# Make port 8080 available outside this container
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "serve" ]