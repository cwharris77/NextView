# NextView

A fullstack video streaming platform that demonstrates modern cloud-native architecture, serverless computing, and containerized microservices. NextView enables users to upload, process, and stream videos with enterprise-grade scalability and reliability.

## 🎯 Project Overview

NextView is a production-ready video streaming application that showcases expertise in fullstack development, cloud architecture, and DevOps practices. The platform handles the complete video lifecycle—from user upload through processing to delivery—using a decoupled, event-driven architecture that scales automatically with demand.

## 🏗️ Architecture & Design Philosophy

NextView was architected with scalability, maintainability, and cloud-native principles at its core. The application follows a microservices pattern, with each service designed for a specific responsibility and optimized for its unique requirements.

### Three-Tier Architecture

**Frontend Layer** - Next.js Web Application

- Built with React 19 and TypeScript for type safety and modern React features
- Server-side rendering capabilities for optimal performance and SEO
- Responsive design with Tailwind CSS
- Real-time authentication state management with Firebase Auth

**API Layer** - Firebase Functions (Serverless)

- Event-driven serverless functions that scale automatically
- Optimized for low-latency operations (upload URL generation, video metadata retrieval)
- Integrated authentication and authorization
- Cost-effective scaling that only charges for actual usage

**Processing Layer** - Containerized Video Service

- Dedicated Express.js service for CPU-intensive video transcoding
- Isolated from API layer to prevent blocking user requests
- Containerized for consistent execution across environments
- Designed to handle long-running processing tasks efficiently

### Design Decisions

**Why Serverless for API?**

- Firebase Functions provide automatic scaling without infrastructure management
- Pay-per-use pricing model reduces costs for variable traffic
- Built-in integration with Firebase services (Auth, Firestore)
- Eliminates server maintenance and scaling concerns

**Why Containers for Processing?**

- Video processing requires FFmpeg and significant compute resources
- Containerization ensures consistent environments across development and production
- Enables deployment to Cloud Run with automatic scaling based on demand
- Isolates resource-intensive operations from user-facing services

**Why Event-Driven Architecture?**

- Pub/Sub messaging decouples upload from processing
- Prevents user uploads from being blocked by processing queue
- Enables asynchronous processing with automatic retry capabilities
- Supports future expansion with additional processing pipelines

## ☁️ Google Cloud Platform Integration

NextView leverages Google Cloud Platform's comprehensive suite of services to create a robust, scalable infrastructure without managing traditional servers.

### Firebase Services

**Firebase Authentication**

- Seamless Google Sign-In integration
- Secure session management
- Automatic user profile creation on first login
- Zero-configuration authentication flow

**Firebase Firestore**

- NoSQL database optimized for real-time data synchronization
- Scalable document storage for user profiles and video metadata
- Automatic indexing for efficient querying
- Real-time updates capability for future enhancements

**Firebase Functions**

- Serverless compute for API endpoints
- Automatic HTTPS endpoints
- Integrated with Firebase Auth for secure endpoints
- Scales from zero to thousands of concurrent requests

### Google Cloud Platform Services

**Google Cloud Storage**

- **Raw Videos Bucket** - Receives direct uploads from clients via signed URLs
- **Processed Videos Bucket** - Stores transcoded videos with public access
- Highly available object storage with 99.99% durability
- Global CDN integration for fast video delivery

**Google Cloud Run**

- Serverless container platform for the video processing service
- Automatic scaling based on request volume
- Pay only for actual processing time
- Handles traffic spikes without manual intervention

**Google Cloud Build**

- CI/CD pipeline for automated deployments
- Builds Docker images from source code
- Pushes to Google Container Registry
- Deploys to Cloud Run automatically

**Google Cloud Pub/Sub**

- Event-driven messaging for video processing triggers
- Decouples upload completion from processing start
- Reliable message delivery with at-least-once semantics
- Enables future expansion with multiple processing workers

## 🐳 Docker Containerization Strategy

Containerization was implemented to ensure consistency, portability, and efficient resource utilization across all environments.

### Multi-Stage Builds

Both services utilize multi-stage Docker builds to optimize image size and build performance:

**Video Processing Service**

- **Build Stage**: Compiles TypeScript to JavaScript
- **Production Stage**: Includes only runtime dependencies and FFmpeg
- Result: Minimal image size with optimized layer caching
- Includes FFmpeg for video transcoding without bloating the base image

**Web Client**

- **Build Stage**: Compiles Next.js application with all dependencies
- **Production Stage**: Includes only production dependencies and built artifacts
- Result: Small production images with fast deployment times
- Separates build-time and runtime environments

### Benefits of Containerization

- **Consistency** - Identical execution environment across development, staging, and production
- **Portability** - Deployable to any container platform (Cloud Run, Kubernetes, etc.)
- **Scalability** - Cloud Run automatically scales containers based on traffic
- **Isolation** - Each service runs in its own container with defined resource limits
- **Versioning** - Container images are versioned and tagged for rollback capabilities

## 📊 Data Flow & Processing Pipeline

1. **User Upload**

   - Client requests signed URL from Firebase Function
   - Direct upload to Cloud Storage (bypasses server)
   - Upload completion triggers Pub/Sub message

2. **Video Processing**

   - Pub/Sub message triggers Cloud Run service
   - Service downloads raw video from Cloud Storage
   - FFmpeg transcodes video to 360p resolution
   - Processed video uploaded to separate bucket
   - Video metadata updated in Firestore

3. **Video Delivery**
   - Processed videos served directly from Cloud Storage
   - Public URLs enable efficient CDN caching
   - Paginated video feed retrieved from Firestore
   - Optimized for fast page loads and smooth playback

## 🔒 Security & Best Practices

**Authentication & Authorization**

- Firebase Authentication provides secure user authentication
- Function endpoints validate user identity before processing
- User-specific data isolation in Firestore

**Secure File Uploads**

- Signed URLs with expiration prevent unauthorized access
- Direct client-to-storage upload reduces server load
- File naming convention includes user ID for traceability

**Service-to-Service Communication**

- IAM roles configured for least-privilege access
- Service accounts for secure inter-service communication
- Environment variables for sensitive configuration

**Error Handling**

- Comprehensive error handling at each service layer
- Failed processing jobs don't block user uploads
- Cleanup of temporary files on processing failure
- Status tracking in Firestore for monitoring

## 🚀 Scalability & Performance

**Horizontal Scaling**

- Firebase Functions scale automatically with request volume
- Cloud Run scales containers based on concurrent requests
- No manual intervention required for traffic spikes

**Optimized Resource Usage**

- Serverless functions scale to zero when not in use
- Containers scale down during low traffic periods
- Cost-effective for variable workloads

**Performance Optimizations**

- Direct client-to-storage uploads reduce latency
- Processed videos stored separately for efficient delivery
- Paginated video feeds reduce database query load
- Multi-stage Docker builds reduce image transfer times

## 📁 Project Structure

```
NextView/
├── next-view-web-client/          # Next.js frontend application
│   ├── app/                       # Next.js app directory with routing
│   │   ├── components/            # Reusable React components
│   │   ├── utils/                 # Firebase integration utilities
│   │   └── watch/                 # Video playback page
│   └── Dockerfile                 # Multi-stage production build
│
├── next-view-api-service/         # Firebase Functions API
│   ├── functions/
│   │   ├── src/
│   │   │   ├── index.ts          # Serverless API endpoints
│   │   │   └── types.ts          # Shared TypeScript types
│   │   └── package.json
│   └── firebase.json              # Firebase project configuration
│
├── video-processing-service/      # Video transcoding microservice
│   ├── src/
│   │   ├── index.ts              # Express server & processing endpoint
│   │   ├── storage.ts            # Cloud Storage operations
│   │   └── firestore.ts          # Firestore database operations
│   └── Dockerfile                # Multi-stage build with FFmpeg
│
└── cloudbuild.yaml               # CI/CD pipeline configuration
```

## 💡 Key Technical Achievements

- **Fullstack Expertise** - End-to-end development from frontend to backend to infrastructure
- **Cloud-Native Architecture** - Leveraged serverless and containerized services for optimal scalability
- **Event-Driven Design** - Implemented Pub/Sub messaging for decoupled, asynchronous processing
- **DevOps Practices** - Automated CI/CD pipeline with Google Cloud Build
- **Type Safety** - TypeScript throughout the stack for maintainable, error-free code
- **Production-Ready** - Error handling, security, and scalability considerations built-in

## 🎓 Technologies & Tools

**Frontend**

- Next.js 16 - React framework with SSR capabilities
- React 19 - Modern UI library
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Firebase SDK - Client-side Firebase integration

**Backend**

- Firebase Functions - Serverless compute platform
- Express.js - Web framework for processing service
- Node.js - JavaScript runtime

**Cloud Services**

- Google Cloud Storage - Object storage
- Google Cloud Run - Serverless containers
- Google Cloud Build - CI/CD platform
- Google Cloud Pub/Sub - Messaging service
- Firebase Auth - Authentication service
- Firebase Firestore - NoSQL database

**DevOps**

- Docker - Containerization platform
- Google Cloud Build - Continuous integration
- Multi-stage builds - Optimized container images

**Video Processing**

- FFmpeg - Video transcoding library
- Fluent-FFmpeg - Node.js wrapper for FFmpeg
