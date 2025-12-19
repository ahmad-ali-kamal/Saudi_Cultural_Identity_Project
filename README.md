# Saudi Cultural Identity Project 🇸🇦

[![License](https://img.shields.io/badge/License-Educational-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.5-6db33f.svg)](backend/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47a248.svg)](https://www.mongodb.com/)



An interactive web application designed to celebrate, educate, and test knowledge about Saudi Arabian culture, traditions, and heritage. This full-stack platform offers an engaging quiz experience, comprehensive analytics, and educational content about Saudi customs, regional traditions, cuisine, festivals, proverbs, and historical practices.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

The Saudi Cultural Identity Project is a comprehensive educational platform that combines modern web technologies with rich cultural content. The platform enables users to:

- **Test their knowledge** through customizable quizzes with multiple question types
- **Track their progress** via detailed analytics and performance dashboards
- **Learn** about Saudi culture through informational content
- **Explore** regional variations and traditions across Saudi Arabia

Built with a modern tech stack, the application features a beautiful heritage-inspired design, bilingual support (Arabic/English), dark mode, and responsive layouts that work seamlessly across all devices.

### Project Goals

1. **Preserve Cultural Heritage**: Document and share Saudi cultural knowledge with younger generations
2. **Interactive Learning**: Engage users through gamified quiz experiences
3. **Educational Resource**: Provide comprehensive information about Saudi traditions and customs
4. **Performance Tracking**: Help users monitor their learning progress through detailed analytics
5. **Accessible Platform**: Ensure easy access through web browsers on any device

---

## ✨ Features

### For Users

- **🎮 Customizable Quizzes**
  - Multiple question types (MCQ, multi-select, true/false, open-ended)
  - Filter by language (Arabic/English)
  - Filter by region (General, Western, Eastern, Northern, Southern, Central)
  - Adjustable quiz length (5-30 questions)
  - Image-supported questions

- **📊 Performance Analytics**
  - Overall statistics (total quizzes, average score, accuracy)
  - Score trends over time
  - Performance breakdowns by region, question type, and language
  - Strengths and weaknesses identification
  - Recent activity history

- **📚 Educational Content**
  - Informational questions with detailed explanations
  - Cultural terms and meanings
  - Category-based organization (Traditional Food, Clothing, Festivals, etc.)
  - Searchable content library

- **🎨 User Experience**
  - Heritage-inspired design with custom Saudi color palette
  - Dark mode with smooth transitions
  - Smooth animations and transitions
  - Fully responsive mobile-first design
  - Bilingual interface (Arabic/English)

---

## 🏗️ Architecture

The project follows a modern **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  React 19 + Vite + TailwindCSS + Framer Motion             │
│  (User Interface, State Management, Routing)                │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/HTTPS (REST API)
                 │ JWT Authentication
┌────────────────┴────────────────────────────────────────────┐
│                         Backend Layer                        │
│  Spring Boot 3.5 + Spring Security + Spring Data           │
│  (Business Logic, Authentication, Data Access)              │
└────────────────┬────────────────────────────────────────────┘
                 │ MongoDB Protocol
                 │ Secure Connection
┌────────────────┴────────────────────────────────────────────┐
│                       Database Layer                         │
│  MongoDB / MongoDB Atlas                                    │
│  (Document Storage, Indexes, Aggregations)                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Communication

- **Frontend ↔ Backend**: RESTful API calls over HTTPS with JWT bearer tokens
- **Backend ↔ Database**: MongoDB wire protocol with authentication
- **Authentication**: AWS Cognito provides centralized user management and JWT token generation

### Key Design Decisions

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **Stateless Backend**: JWT-based authentication enables horizontal scaling
3. **NoSQL Database**: MongoDB's flexible schema suits cultural content with varying structures
4. **Cloud-First**: AWS Cognito and MongoDB Atlas enable easy cloud deployment
5. **API-First Design**: Backend API can support future mobile apps or third-party integrations

---

## 📁 Repository Structure

```
Saudi_Cultural_Identity_Project/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API and auth services
│   │   ├── context/            # React contexts (theme, etc.)
│   │   └── config/             # Configuration files
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── README.md               # Frontend documentation
│
├── backend/                     # Spring Boot backend API
│   ├── src/
│   │   ├── main/java/com/saudiculture/
│   │   │   ├── controllers/    # REST API controllers
│   │   │   ├── services/       # Business logic services
│   │   │   ├── repositories/   # MongoDB repositories
│   │   │   ├── models/         # Domain entities
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── config/         # Configuration classes
│   │   │   ├── security/       # Security configuration
│   │   │   └── data/           # Data loaders and utilities
│   │   └── resources/
│   │       └── application.yaml # Application configuration
│   ├── pom.xml                 # Maven dependencies
│   ├── docker-compose.yml      # Local MongoDB setup
│   ├── Dockerfile              # Docker image definition
│   └── README.md               # Backend documentation
│
├── Scripts/                     # Data management scripts
│   ├── Arabic_question_format.py
│   └── English_question_format.py
│
├── .gitignore                   # Git ignore rules
├── package.json                 # Root-level dependencies
└── README.md                    # This file
```

### Component Documentation

Each major component has its own detailed README:

- **[Frontend Documentation](frontend/README.md)** - Setup, development, and deployment guide for the React application
- **[Backend Documentation](backend/README.md)** - API reference, configuration, and deployment guide for the Spring Boot API

---

## 🚀 Quick Start

Get the entire application running locally in under 10 minutes!

### Prerequisites

- **Node.js 18+** and npm
- **Java 21** and Maven
- **MongoDB** (Docker/Atlas)
- **AWS Cognito** account (for authentication)
- **Git**

### Option 1: Quick Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmad-ali-kamal/Saudi_Cultural_Identity_Project.git
   cd Saudi_Cultural_Identity_Project
   ```

2. **Start MongoDB (using Docker)**
   ```bash
   cd backend
   docker-compose up -d
   cd ..
   ```

3. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB and AWS Cognito credentials
   ```

4. **Start Backend**
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   # Backend runs on http://localhost:8080
   ```

5. **Configure Frontend** (in a new terminal)
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with backend URL and AWS Cognito credentials
   ```

6. **Start Frontend**
   ```bash
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/swagger-ui/index.html

### Option 2: MongoDB Atlas Setup

If you prefer cloud-hosted MongoDB:

1. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a cluster and get your connection string
3. Update `backend/.env` with your Atlas URI:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/saudiculture
   ```
4. Follow steps 4-7 above

### Verifying the Setup

1. **Backend Health Check**: http://localhost:8080/actuator/health
2. **API Documentation**: http://localhost:8080/swagger-ui/index.html
3. **Frontend**: http://localhost:5173

If all services are running correctly, you should see:
- ✅ Backend health status: UP
- ✅ Swagger UI loads successfully
- ✅ Frontend homepage displays

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| Vite | 7.2.2 | Build tool & dev server |
| React Router | 7.9.5 | Client-side routing |
| TailwindCSS | 3.4.18 | Utility-first CSS |
| Framer Motion | 12.23.25 | Animations |
| Recharts | 3.4.1 | Data visualization |
| Axios | 1.13.1 | HTTP client |
| AWS Amplify | 6.15.8 | AWS integration |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming language |
| Spring Boot | 3.5.6 | Application framework |
| Spring Security | 3.5.6 | Authentication & authorization |
| Spring Data MongoDB | 3.5.6 | Database integration |
| MongoDB | Latest | NoSQL database |
| AWS Cognito | - | User authentication |
| SpringDoc OpenAPI | 2.8.13 | API documentation |

### Infrastructure & Tools

- **Docker & Docker Compose** - Containerization
- **Maven** - Build automation (backend)
- **npm** - Package management (frontend)
- **Git** - Version control
- **AWS Services** - Cognito (auth), potential S3/CloudFront deployment
- **MongoDB Atlas** - Cloud database hosting

---



## 🚢 Deployment

### Frontend Deployment

**Recommended Platforms:**
- **Vercel** (easiest): `vercel --prod`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **AWS S3 + CloudFront**: Static hosting with CDN
- **GitHub Pages**: Free hosting for public repos

See [Frontend README](frontend/README.md) for detailed deployment instructions.

### Backend Deployment

**Recommended Platforms:**
- **AWS Elastic Beanstalk**: Docker-based deployment
- **AWS ECS (Fargate)**: Container orchestration
- **Docker**: Containerized deployment on any server
- **Traditional Server**: JAR deployment with systemd/Windows Service

See [Backend README](backend/README.md) for detailed deployment instructions.

### Database Deployment

**Production Options:**
- **MongoDB Atlas** (recommended): Fully managed cloud database
- **AWS DocumentDB**: AWS-managed MongoDB-compatible service
- **Self-hosted**: MongoDB on EC2 or dedicated server

### Full Stack Deployment Examples

#### Option 1: AWS Full Stack
- Frontend: S3 + CloudFront
- Backend: Elastic Beanstalk or ECS
- Database: MongoDB Atlas or DocumentDB
- Auth: AWS Cognito

#### Option 2: Vercel + Cloud Backend
- Frontend: Vercel
- Backend: Railway, Render, or Heroku
- Database: MongoDB Atlas
- Auth: AWS Cognito

#### Option 3: Docker Compose (Single Server)
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - MONGO_URI=${MONGO_URI}
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
```

---


## 📄 License

This project is part of an educational initiative to celebrate and preserve Saudi cultural heritage.

---

##  Acknowledgments

### Technology Partners

Special thanks to the teams behind:
- **React Team** - For the amazing frontend framework
- **Spring Team** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **AWS** - For cloud services and authentication
- **Vercel & Netlify** - For excellent hosting platforms

### Cultural Content

This project aims to document and celebrate the rich cultural heritage of Saudi Arabia. Content is curated to be educational, respectful, and accurate.

### Dataset Attribution

This project uses high-quality research datasets focusing on Saudi cultural competence, dialects, and multimodal learning:

#### 1. PEARL: Multimodal Culturally-Aware Arabic Instruction Dataset

- **Source**: [UBC-NLP/PEARL on Hugging Face](https://huggingface.co/datasets/UBC-NLP/PEARL) | [arXiv:2505.21979](https://arxiv.org/abs/2505.21979)
- **Content**: Visual question-answering dataset with multilingual questions about Saudi culture, covering architecture, food, geography, and traditions
- **Usage**: Interactive quiz questions with images

**Citation**: Alwajih, F., Magdy, S. M., Mekki, A. E., Nacar, O., Nafea, Y., Abdelfadil, S. T., ... & Abdul-Mageed, M. (2025). Pearl: A Multimodal Culturally-Aware Arabic Instruction Dataset. *arXiv preprint arXiv:2505.21979*.

#### 2. Saudiculture: Cultural Competence Benchmark

- **Source**: [Springer Link](https://link.springer.com/article/10.1007/s44443-025-00137-9)
- **Content**: Benchmark for evaluating cultural competence within Saudi Arabia, including specialized questions about culture, traditions, and customs
- **Usage**: Cultural competence questions and knowledge about Saudi traditions

**Citation**: Ayash, L., Alhuzali, H., Alasmari, A., & Aloufi, S. (2025). Saudiculture: A benchmark for evaluating large language models' cultural competence within saudi arabia. *Journal of King Saud University Computer and Information Sciences, 37*(6), 123.

#### 3. Absher: Saudi Dialects Understanding Benchmark

- **Source**: [arXiv:2507.10216](https://arxiv.org/abs/2507.10216)
- **Content**: Benchmark for evaluating understanding of Saudi dialects, covering different dialects across regions of the Kingdom
- **Usage**: Questions related to Saudi dialects and regional linguistic diversity

**Citation**: Al-Monef, R., Alhuzali, H., Alturayeif, N., & Alasmari, A. (2025). Absher: A benchmark for evaluating large language models understanding of saudi dialects. *arXiv preprint arXiv:2507.10216*.

---

We are deeply grateful to these research teams for making their high-quality datasets publicly available for educational and research purposes. Their work contributes significantly to preserving and promoting Saudi cultural heritage and linguistic diversity.

### Contributors

Thank you to all contributors who have helped build and improve this application, making Saudi cultural education accessible to everyone.

---

<div align="center">

**عزنا بطبعنا**

*Our pride is in our nature*

🇸🇦

Made to celebrate Saudi cultural heritage

[⬆ Back to Top](#saudi-cultural-identity-project-)

</div>
