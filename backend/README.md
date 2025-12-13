# Saudi Cultural Identity - Backend API

## Project Overview

The **Saudi Cultural Identity Backend API** is a robust RESTful API service built to power an educational platform celebrating Saudi Arabian cultural heritage. This Spring Boot application provides comprehensive endpoints for managing quiz questions, user submissions, and performance analytics.

The API features secure JWT-based authentication via AWS Cognito, MongoDB for flexible data storage, and comprehensive documentation through OpenAPI/Swagger. It supports multiple question types, regional filtering, bilingual content (Arabic/English), and detailed analytics to help users track their cultural knowledge journey.

Built with modern Java technologies, the backend emphasizes scalability, security, and maintainability with structured logging, health monitoring via Spring Actuator, and profile-based configuration for seamless environment transitions.

## Features

### Core Capabilities

- **RESTful API Architecture**: Clean, resource-oriented API design following REST principles
- **JWT Authentication**: Secure authentication and authorization via AWS Cognito
- **MongoDB Database**: Flexible NoSQL storage optimized for cultural content
- **Multi-Language Support**: Full support for Arabic and English content
- **Question Management**:
  - Multiple question types (single-choice, multiple-choice, true/false, open-ended)
  - Regional categorization (General, Western, Eastern, Northern, Southern, Central)
  - Category-based organization (Traditional Food, Clothing, Festivals, etc.)
  - Image support for visual questions
- **Quiz Functionality**:
  - Random question generation with filtering
  - Answer submission and automatic scoring
  - Submission history tracking
- **User Analytics**:
  - Overall performance statistics
  - Performance breakdowns by region, question type, and language
  - Strengths and weaknesses identification
  - Recent activity tracking
- **API Documentation**: Interactive Swagger UI for testing and exploration
- **Health Monitoring**: Spring Actuator endpoints for application health and metrics
- **Structured Logging**: JSON-formatted logs using Logstash encoder
- **Profile-Based Configuration**: Separate configurations for dev, test, and production

## API Endpoints

### Quiz Endpoints (`/api`)

#### Get Informational Questions
```http
GET /api/info?language={language}&category={category}&region={region}&search={search}&page={page}&size={size}
```
Retrieve paginated informational questions with filtering options.

**Parameters:**
- `language` (default: Arabic) - Content language
- `category` (optional) - Filter by category
- `region` (optional) - Filter by region
- `search` (optional) - Search across question text, answer, term
- `page` (default: 0) - Page number
- `size` (default: 20) - Items per page

**Response:** `200 OK` - Page of `InfoQuestionDTO` objects

---

#### Get Random Quiz Questions
```http
GET /api/quiz?category={category}&language={language}&region={region}&type={type}&size={size}
```
Retrieve randomized quiz questions for testing knowledge.

**Parameters:**
- `category` (optional) - Filter by category
- `language` (optional) - Filter by language
- `region` (optional) - Filter by region
- `type` (optional) - Question type (single_choice, multiple_choice, true_false, open_ended, all)
- `size` (default: 20) - Number of questions

**Response:** `200 OK` - List of `QuizQuestionDTO` objects

---

#### Submit Quiz Answers
```http
POST /api/quiz-submissions
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439011",
      "userAnswer": "الكبسة"
    }
  ]
}
```

**Response:** `201 CREATED` - `QuizSubmissionResponse` with score and results

---

#### Get User's Quiz Submissions
```http
GET /api/quiz-submissions
Authorization: Bearer {JWT_TOKEN}
```

**Response:** `200 OK` - List of user's quiz submissions ordered by date

---

### User Endpoints (`/api/users`)

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer {JWT_TOKEN}
```
Retrieves or creates user profile from JWT, syncing with MongoDB.

**Response:** `200 OK` - `UserDTO` object

---

#### Get User Statistics
```http
GET /api/users/me/stats
Authorization: Bearer {JWT_TOKEN}
```
Returns comprehensive statistics about user's quiz performance.

**Response:** `200 OK` - `UserStatsResponse` with:
- Overall statistics (total submissions, average score, accuracy)
- Performance by question type
- Performance by region
- Performance by language
- Strengths and weaknesses
- Recent submissions

---

### Health & Monitoring

#### Health Check
```http
GET /actuator/health
```

#### Application Info
```http
GET /actuator/info
```

#### Metrics
```http
GET /actuator/metrics
GET /actuator/prometheus
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21** or higher - [Download OpenJDK](https://adoptium.net/)
- **Maven 3.8+** - [Download Maven](https://maven.apache.org/download.cgi) (or use included wrapper)
- **MongoDB** - Choose one:
  - Docker & Docker Compose (recommended for local development)
  - MongoDB Atlas account (recommended for cloud)
  - Local MongoDB installation
- **AWS Cognito User Pool** - Set up through AWS Console
- **Git** - [Download Git](https://git-scm.com/)


## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ahmad-ali-kamal/Saudi_Cultural_Identity_Project.git
cd Saudi_Cultural_Identity_Project/backend
```

### 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Configuration - Choose ONE option:

# OPTION 1: MongoDB Atlas (Recommended)
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/saudiculture?retryWrites=true&w=majority

# OPTION 2: Local Docker MongoDB
# MONGO_USERNAME=admin
# MONGO_PASSWORD=admin123
# MONGO_HOST=localhost
# MONGO_PORT=27017
# MONGO_DATABASE=saudiculture

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Server Configuration
SERVER_URL=http://localhost:8080

# AWS Cognito Configuration (Required)
AWS_COGNITO_USER_POOL_ID=your-user-pool-id
AWS_COGNITO_CLIENT_ID=your-app-client-id
AWS_COGNITO_CLIENT_SECRET=your-app-client-secret
AWS_COGNITO_REGION=us-east-1
```

### 3. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from: **Connect → Drivers**
4. Add your connection string to `.env` as `MONGO_URI`
5. Whitelist your IP address in Atlas Network Access (or use `0.0.0.0/0` for development)

#### Option B: Local Docker MongoDB

1. Start MongoDB container:
   ```bash
   docker-compose up -d
   ```

2. Verify MongoDB is running:
   ```bash
   docker ps
   ```

3. Keep the default local MongoDB settings in `.env`

**Detailed MongoDB Setup Guide**: See [MONGODB_SETUP.md](MONGODB_SETUP.md) for comprehensive instructions.

### 4. Set Up AWS Cognito

1. Sign in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **Amazon Cognito**
3. Create a new User Pool:
   - Configure sign-in experience (email)
   - Configure security requirements (password policy)
   - Configure sign-up experience
   - Configure message delivery (email)
   - Create app client (confidential client)
4. Copy the following to your `.env`:
   - User Pool ID
   - App Client ID
   - App Client Secret
   - Region

### 5. Install Dependencies

Using Maven wrapper (recommended):

```bash
./mvnw clean install
```

Or using your local Maven installation:

```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the project
- Run tests
- Package the application

## Running the Application

### Development Mode

Start the application with the development profile:

**Unix/Linux/macOS:**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Windows:**
```cmd
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at: **http://localhost:8080**

### Available Profiles

- **`dev`** - Development mode with verbose logging and hot reload
- **`test`** - Testing mode with separate database
- **`prod`** - Production mode with optimized settings

To run with a specific profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles={profile}
```

### Accessing the Application

Once running, you can access:

- **API Base URL**: http://localhost:8080/api
- **Swagger UI (API Documentation)**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/actuator/health
- **Application Info**: http://localhost:8080/actuator/info

## API Documentation

The backend includes comprehensive API documentation using **OpenAPI 3.0 (Swagger)**.

### Interactive API Explorer

Access the Swagger UI at: **http://localhost:8080/swagger-ui/index.html**

Features:
- Interactive API testing
- Request/response examples
- Schema documentation
- Authentication testing
- Try-it-out functionality

### Using Swagger UI

1. Start the backend application
2. Navigate to http://localhost:8080/swagger-ui/index.html
3. Explore available endpoints
4. Click "Try it out" to test endpoints
5. For protected endpoints:
   - Click "Authorize" button
   - Enter JWT token from Cognito
   - Format: `Bearer {your-jwt-token}`

## Testing

### Run All Tests

```bash
./mvnw test
```

### Run Specific Test Class

```bash
./mvnw test -Dtest=QuestionServiceTest
```

### Run with Coverage

```bash
./mvnw test jacoco:report
```

Coverage report will be generated in `target/site/jacoco/index.html`



## Build and Deployment

### Building for Production

Create an optimized production build:

```bash
./mvnw clean package -DskipTests
```

This generates: `target/saudiculture-api-0.0.1-SNAPSHOT.jar`

### Running the JAR

```bash
java -jar target/saudiculture-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Deployment Options

#### Option 1: Docker

Build Docker image:

```bash
docker build -t saudi-culture-api .
```

Run container:

```bash
docker run -p 8080:8080 \
  --env-file .env \
  saudi-culture-api
```

#### Option 2: AWS ECS (Fargate)

1. Build and push Docker image to ECR
2. Create ECS task definition
3. Create ECS service with Fargate launch type
4. Configure environment variables
5. Set up Application Load Balancer

#### Option 3: Traditional Server

1. Build JAR file: `./mvnw clean package`
2. Copy JAR to server
3. Create systemd service (Linux) or Windows Service
4. Configure environment variables
5. Start service


## Technologies Used

### Core Framework
- **Java 21** - Latest LTS version with modern language features
- **Spring Boot 3.5.6** - Enterprise-grade application framework
- **Spring Web** - RESTful web services
- **Spring Data MongoDB** - MongoDB integration and repositories
- **Spring Security** - Authentication and authorization
- **Spring OAuth2 Resource Server** - JWT token validation

### Database
- **MongoDB** - NoSQL document database for flexible data storage
- **MongoDB Atlas** - Cloud-hosted MongoDB (recommended)

### Authentication & Authorization
- **AWS Cognito** - User authentication and JWT token management
- **AWS SDK for Java (Cognito IDP)** - Cognito integration
- **Nimbus JOSE + JWT** - JWT token parsing and validation

### API Documentation
- **SpringDoc OpenAPI 3.0** - Automatic API documentation generation
- **Swagger UI** - Interactive API explorer

### Monitoring & Observability
- **Spring Boot Actuator** - Production-ready features (health, metrics, info)
- **Logstash Logback Encoder** - Structured JSON logging for log aggregation

### Utilities & Libraries
- **Lombok** - Reduces boilerplate code with annotations
- **Jakarta Validation** - Request validation with annotations
- **OpenCSV** - CSV parsing for data import scripts

### Testing
- **Spring Boot Test** - Comprehensive testing framework
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework for tests

### Build & Dependency Management
- **Maven 3.8+** - Build automation and dependency management
- **Maven Wrapper** - Ensures consistent Maven version across environments

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/saudiculture/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── OpenApiConfig.java      # Swagger/OpenAPI configuration
│   │   │   │   ├── WebConfig.java          # CORS and web configuration
│   │   │   │   └── SecurityConfig.java     # Spring Security configuration
│   │   │   ├── controllers/         # REST API controllers
│   │   │   │   ├── QuestionController.java # Quiz endpoints
│   │   │   │   ├── UserController.java     # User endpoints
│   │   │   │   └── AuthTestController.java # Auth testing endpoints
│   │   │   ├── models/              # Domain entities
│   │   │   │   ├── Question.java           # Question document model
│   │   │   │   ├── User.java               # User document model
│   │   │   │   ├── QuizSubmission.java     # Submission document model
│   │   │   │   └── QuizAnswer.java         # Answer subdocument
│   │   │   ├── repositories/        # MongoDB repositories
│   │   │   │   ├── QuestionRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── QuizSubmissionRepository.java
│   │   │   ├── services/            # Business logic services
│   │   │   │   ├── QuestionService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── QuizSubmissionService.java
│   │   │   │   └── UserStatsService.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── QuizQuestionDTO.java
│   │   │   │   ├── InfoQuestionDTO.java
│   │   │   │   ├── UserDTO.java
│   │   │   │   ├── QuizSubmissionRequest.java
│   │   │   │   ├── QuizSubmissionResponse.java
│   │   │   │   ├── UserStatsResponse.java
│   │   │   │   └── ErrorResponseDTO.java
│   │   │   ├── data/                # Data loading utilities
│   │   │   │   ├── DataLoader.java
│   │   │   │   ├── CulturalTermDataLoader.java
│   │   │   │   ├── QuestionValidator.java
│   │   │   │   ├── QuestionCsvRecord.java
│   │   │   │   └── CulturalTermCsvRecord.java
│   │   │   ├── exception/           # Exception handling
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── security/            # Security configuration
│   │   │   │   └── SecurityConfig.java
│   │   │   └── Application.java     # Main application entry point
│   │   └── resources/
│   │       ├── application.yaml            # Application configuration
│   │       └── logback-spring.xml          # Logging configuration
│   └── test/
│       └── java/com/saudiculture/
│           ├── services/            # Service layer tests
│           └── ApplicationTests.java
├── Scripts/                         # Data processing scripts
│   ├── Arabic_question_format.py
│   └── English_question_format.py
├── .ebextensions/                   # AWS Elastic Beanstalk config
├── target/                          # Build output directory
├── .env.example                     # Environment variables template
├── .env                             # Local environment variables (not in git)
├── .gitignore                       # Git ignore rules
├── docker-compose.yml               # Docker Compose for local MongoDB
├── mongo-init.js                    # MongoDB initialization script
├── Dockerfile                       # Docker image definition
├── Dockerrun.aws.json              # AWS EB Docker configuration
├── pom.xml                          # Maven build configuration
├── mvnw                             # Maven wrapper (Unix)
├── mvnw.cmd                         # Maven wrapper (Windows)
├── MONGODB_SETUP.md                 # MongoDB setup guide
└── README.md                        # This file
```

## Available Maven Commands

```bash
# Clean build artifacts
./mvnw clean

# Compile source code
./mvnw compile

# Run tests
./mvnw test

# Package application (creates JAR)
./mvnw package

# Install to local Maven repository
./mvnw install

# Run application
./mvnw spring-boot:run

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Skip tests during build
./mvnw package -DskipTests

# Run specific test
./mvnw test -Dtest=QuestionServiceTest

# Generate site documentation
./mvnw site
```

## Logging

### Log Levels

Configured in `application.yaml` per profile:

**Development:**
```yaml
logging:
  level:
    com.saudiculture: DEBUG
    org.springframework.web: DEBUG
```

**Production:**
```yaml
logging:
  level:
    com.saudiculture: INFO
    org.springframework.web: WARN
```

### Structured Logging

Logs are formatted as JSON using Logstash encoder for easy parsing and aggregation:

```json
{
  "@timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "logger_name": "com.saudiculture.controllers.QuestionController",
  "message": "Quiz submission request received",
  "userId": "user123",
  "questionCount": 20
}
```

### Log Files

Logs can be configured to write to files by adding to `application.yaml`:

```yaml
logging:
  file:
    name: logs/saudiculture-api.log
    max-size: 10MB
    max-history: 30
```


---

## License

This project is part of an educational initiative to celebrate and preserve Saudi cultural heritage.

---

## Acknowledgments

Built with modern Spring Boot technologies to provide a robust, scalable API for exploring Saudi Arabia's rich cultural heritage.

Special thanks to all contributors who have helped build and improve this application.

