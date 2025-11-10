# NextView

A fullstack video streaming platform that demonstrates modern cloud-native architecture, serverless computing, and containerized microservices. NextView enables users to upload, process, and stream videos with enterprise-grade scalability and reliability.

## 🏗️ Architecture & Design Philosophy

NextView was architected with scalability, maintainability, and cloud-native principles at its core. The application follows a microservices pattern, with each service designed for a specific responsibility and optimized for its unique requirements.

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

## Technologies & Tools

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
