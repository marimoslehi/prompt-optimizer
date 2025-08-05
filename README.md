# Prompt Optimizer

Enterprise AI Testing Platform - Compare AI model responses, optimize costs, and improve performance across multiple AI providers.

## Table of Contents
- [Introduction](#introduction)
- [Technology Used](#technology-used)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [License](#license)

## Introduction

Prompt Optimizer is an innovative AI testing and optimization platform designed for businesses and developers who want to maximize the efficiency and cost-effectiveness of their AI implementations. This tool enables users to compare responses from multiple AI models side-by-side, track costs in real-time, and optimize their AI workflows for better performance and reduced expenses.

With Prompt Optimizer, teams can easily test prompts across different AI providers including OpenAI's GPT models, Anthropic's Claude, Google's Gemini, and more. The platform provides comprehensive analytics, cost tracking, and performance metrics to help organizations make data-driven decisions about their AI usage.

## Technology Used

### Frontend
- **Next.js 15**: React framework with App Router for server-side rendering
- **React 19**: Latest React version with concurrent features
- **TypeScript**: Static typing for enhanced code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components
- **Lucide React**: Icon library for consistent visual design

### Backend
- **Node.js**: Runtime environment for server-side JavaScript
- **Express.js**: Web framework for building REST APIs
- **TypeScript**: Static typing for enhanced code quality
- **PostgreSQL**: Primary database for data persistence
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing for security

### Additional Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint & Prettier**: Code formatting and linting for code quality
- **Prisma**: Database ORM and migration tool
- **Git**: Version control system

## Project Structure

\`\`\`
promptOptimizer/
├── backend/my-app/             # Node.js + Express + PostgreSQL
│   ├── src/                    # Source code (controllers, services, routes)
│   ├── prisma/                 # Database ORM
│   └── .env                    # Backend config
└── frontend/                   # Next.js + React + TypeScript
    ├── app/                    # Pages (dashboard, auth, onboarding)
    ├── components/             # UI components
    ├── hooks/                  # API integration
    └── .env.local              # Frontend config
\`\`\`

## Contributors

- **Mari Moslehi** ([@marimoslehi](https://github.com/marimoslehi)) - Lead Developer & Designer

*Contributions welcome! Feel free to submit a Pull Request.*

## Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **pnpm** (v8 or higher) - Install with \`npm install -g pnpm\`
- **Git** for version control

### Backend Setup

\`\`\`bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
psql postgres
CREATE USER promptuser WITH PASSWORD 'promptpass123';
CREATE DATABASE promptoptimizer OWNER promptuser;
GRANT ALL PRIVILEGES ON DATABASE promptoptimizer TO promptuser;
\q

# Navigate to backend and install
cd backend/my-app
npm install

# Create .env file with database URL and JWT secret
echo 'DATABASE_URL="postgresql://promptuser:promptpass123@localhost:5432/promptoptimizer"' > .env
echo 'JWT_SECRET="'\$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"' >> .env
echo 'PORT=3001' >> .env
\`\`\`

### Frontend Setup

\`\`\`bash
# Navigate to frontend and install
cd frontend
pnpm install

# Create environment file
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001/api' > .env.local
\`\`\`

## Running the Project

### Development Mode

**Start Backend:**
\`\`\`bash
cd backend/my-app
npm run dev
\`\`\`
Backend available at \`http://localhost:3001\`

**Start Frontend:**
\`\`\`bash
cd frontend
pnpm dev
\`\`\`
Frontend available at \`http://localhost:3000\`

### Available Pages
- **Home**: \`http://localhost:3000/\`
- **Dashboard**: \`http://localhost:3000/dashboard\` - Main AI comparison interface
- **Landing**: \`http://localhost:3000/landing\` - Marketing landing page
- **Onboarding**: \`http://localhost:3000/onboarding\` - User onboarding flow
- **Part-time Dashboard**: \`http://localhost:3000/part-time\` - Work management features
- **Sign-in**: \`http://localhost:3000/sign-in\` - Authentication flow
- **API Key Setup**: \`http://localhost:3000/api-key-setup\` - Configure AI API keys

### API Health Check
\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

## License

This project is licensed under the **Business Source License 1.1**.

- ✅ **Free for non-commercial use** - Perfect for learning, personal projects, and small teams
- ✅ **Source code available** - Full transparency and community contributions welcome
- ⚠️ **Commercial use requires license** - Contact for enterprise licensing
- 🔄 **Becomes open source in 4 years** - Ensuring long-term availability

For commercial licensing inquiries, please contact: moslehimari@gmail.com

See the [LICENSE](LICENSE) file for full details.

---

**Built for the AI community** 🚀
