# Saudi Cultural Identity - Frontend

## Project Overview

The **Saudi Cultural Identity** is an interactive web application designed to celebrate and educate users about Saudi Arabian culture, traditions, and heritage. The platform offers an engaging quiz experience that tests users' knowledge of Saudi customs, regional traditions, food, festivals, proverbs, and historical practices. Users can customize their quiz experience, track their progress through comprehensive analytics, and explore educational content about Saudi culture.

Built with modern web technologies, the application features a beautiful heritage-inspired design with custom color palettes reflecting Saudi aesthetics, smooth animations, and full support for both Arabic and English languages. The app includes a dark mode for enhanced user experience and responsive design that works seamlessly across all devices.

## Features and Pages

### Core Features

- **Customizable Quiz Experience**: Configure quizzes by language (Arabic/English), region (General, Western, Eastern, Northern, Southern, Central), question type (MCQ, multi-select, true/false, open-ended), and number of questions (5-30)
- **Multiple Question Types**: Support for single-choice, multiple-choice, true/false, and open-ended questions with image support
- **User Authentication**: Secure authentication powered by AWS Cognito with email verification
- **Performance Analytics**: Comprehensive dashboard with interactive charts showing:
  - Overall statistics (total submissions, average score, correct answers)
  - Score trends over time
  - Performance by region
  - Performance by question type
  - Performance by language
  - Strengths and weaknesses analysis
  - Recent activity history
- **Dark Mode**: Fully implemented dark theme with smooth transitions
- **Responsive Design**: Mobile-first approach ensuring optimal experience on all screen sizes
- **Bilingual Support**: Full support for Arabic and English content
- **Animated UI**: Smooth animations and transitions using Framer Motion and AOS

### Pages

#### 1. **Landing Page** (`/`)
The homepage features a stunning hero section with the tagline "عزنا بطبعنا" (Our pride is in our nature), providing an introduction to Saudi cultural heritage. Users can navigate to either take a quiz or explore learning resources.

#### 2. **Quiz Configuration Page** (`/quiz`)
An interactive setup page where users customize their quiz experience by selecting:
- Language preference
- Geographic region
- Question types
- Number of questions (with a visual slider)

#### 3. **Quiz Taking Page** (`/quiz/take`)
The main quiz interface that renders different question types dynamically with:
- Progress tracking
- Image support for questions
- Intuitive answer selection
- Navigation between questions

#### 4. **Quiz Results Page** (`/quiz/results`)
Displays comprehensive results after quiz completion, showing:
- Final score and percentage
- Correct vs incorrect answers breakdown
- Detailed question-by-question review

#### 5. **Dashboard Page** (`/dashboard`)
A comprehensive analytics dashboard featuring:
- Summary statistics cards
- Interactive charts (line, pie, bar charts using Recharts)
- Performance analysis by multiple dimensions
- Recent activity timeline
- Personalized strengths and weaknesses

#### 6. **Learn Page** (`/learn`)
Educational resources and content about Saudi culture, traditions, and heritage.

#### 7. **About Page** (`/about`)
Information about the project, its mission, and objectives.

#### 8. **Authentication Pages**
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): New user registration with email verification
- **Forgot Password** (`/forgot-password`): Password recovery

## Installation Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ahmad-ali-kamal/Saudi_Cultural_Identity_Project.git
   cd Saudi_Cultural_Identity_Project/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the frontend directory by copying the example:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and configure the following variables:
   ```env
   # Backend API URL
   API_BASE_URL=http://localhost:8080/api

   # AWS Cognito Configuration
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_client_id
   VITE_COGNITO_REGION=your_aws_region
   VITE_COGNITO_REDIRECT_URI=http://localhost:5173/callback
   ```

   **Note**: You'll need to set up AWS Cognito and obtain these credentials. Contact the project administrator if you don't have access.

## Running the Application

### Development Mode

To start the development server with hot module replacement (HMR):

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

The application will be available at: **http://localhost:5173**

The development server features:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Detailed error messages in the browser

### Using Convenience Scripts (Windows)

For Windows users, we provide convenience scripts:

**PowerShell:**
```powershell
.\start-dev.ps1
```

**Command Prompt:**
```cmd
start-dev.bat
```

### Preview Production Build Locally

To test the production build locally before deployment:

```bash
npm run preview
```

This serves the production build at **http://localhost:4173**

## Build and Deployment

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This command:
- Creates an optimized build in the `dist/` directory
- Minifies JavaScript and CSS
- Optimizes assets and images
- Generates source maps

The production build is optimized for:
- Minimal file sizes
- Fast loading times
- Browser caching
- SEO optimization

### Build Output

After building, you'll find:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized JS, CSS, and image files

### Deployment Options

#### Option 1: Static Hosting (Recommended)

The built application is a static site and can be deployed to:

- **Vercel**:
  ```bash
  npm install -g vercel
  vercel --prod
  ```

- **Netlify**:
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir=dist
  ```

- **AWS S3 + CloudFront**: Upload the `dist` folder to an S3 bucket and configure CloudFront for CDN

- **GitHub Pages**: Use the `gh-pages` package to deploy

#### Option 2: Docker Deployment

Create a `Dockerfile` in the frontend directory:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t saudi-quiz-frontend .
docker run -p 80:80 saudi-quiz-frontend
```

### Environment Variables for Production

When deploying to production, create a `.env.production` file with production values:

```env
API_BASE_URL=https://your-production-api.com/api
VITE_COGNITO_USER_POOL_ID=prod_user_pool_id
VITE_COGNITO_CLIENT_ID=prod_client_id
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_REDIRECT_URI=https://your-domain.com/callback
```

**Important**: Never commit `.env` files with sensitive credentials to version control.

## Technologies Used

### Core Framework
- **React 19.1.1** - Latest version of the React library for building user interfaces
- **React Router DOM 7.9.5** - Declarative routing for React applications
- **Vite 7.2.2** - Next-generation frontend build tool for lightning-fast development

### UI & Styling
- **TailwindCSS 3.4.18** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12.23.25** - Production-ready animation library for React
- **AOS (Animate On Scroll) 2.3.4** - Scroll animations library
- **Lucide React 0.555.0** - Beautiful and consistent icon set

### Data Visualization
- **Recharts 3.4.1** - Composable charting library built on React components


### Authentication & Backend
- **AWS Amplify 6.15.8** - AWS cloud services integration
- **@aws-amplify/ui-react 6.13.1** - Cloud-connected UI components
- **Axios 1.13.1** - Promise-based HTTP client



## Project Structure

```
frontend/
├── public/                      # Static assets
│   └── images/                 # Images used throughout the app
├── src/
│   ├── components/             # Reusable components
│   │   ├── ui/                # UI component library (Button, Card, Input, Select)
│   │   ├── quiz/              # Quiz-specific components
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Footer.jsx         # Footer component
│   │   └── ScrollToTop.jsx    # Scroll restoration utility
│   ├── pages/                 # Page components
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── QuizPage.jsx       # Quiz configuration
│   │   ├── QuizTakePage.jsx   # Quiz interface
│   │   ├── QuizResultsPage.jsx # Results display
│   │   ├── DashboardPage.jsx  # Analytics dashboard
│   │   ├── LearnPage.jsx      # Learning resources
│   │   ├── AboutPage.jsx      # About information
│   │   ├── LoginPage.jsx      # Login form
│   │   ├── SignupPage.jsx     # Registration form
│   │   └── ForgotPasswordPage.jsx # Password recovery
│   ├── services/              # API and authentication services
│   │   ├── api.js             # API client and endpoints
│   │   └── auth.js            # Authentication service
│   ├── context/               # React contexts
│   │   └── ThemeContext.jsx   # Dark mode theme provider
│   ├── config/                # Configuration files
│   │   └── amplify.js         # AWS Amplify configuration
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Global styles
│   └── App.css                # App-specific styles
├── .env.example               # Environment variables template
├── .env                       # Local environment variables (not in git)
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
└── package.json               # Dependencies and scripts
```

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Create production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```



## Contact or Support Information

### Project Team

- **Project Repository**: [GitHub Repository](https://github.com/ahmad-ali-kamal/Saudi_Cultural_Identity_Project)
- **Issue Tracker**: [Report Issues](https://github.com/ahmad-ali-kamal/Saudi_Cultural_Identity_Project/issues)

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bug reports or feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion


---

## License

This project is part of an educational initiative to celebrate and preserve Saudi cultural heritage.

---

## Acknowledgments

Special thanks to all contributors who have helped build and improve this application, celebrating the rich cultural heritage of Saudi Arabia.


