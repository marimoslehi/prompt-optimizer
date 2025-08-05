# Prompt Optimizer

Enterprise AI Testing Platform - Compare AI model responses, optimize costs, and improve performance across multiple AI providers.

## Table of Contents
- [Introduction](#introduction)
- [Technology Used](#technology-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Contributors](#contributors)
- [License](#license)

## Introduction

Prompt Optimizer helps businesses and developers maximize AI efficiency and cost-effectiveness. 

**Key Features:**
- Compare AI model responses side-by-side
- Real-time cost tracking and analytics
- Performance optimization across providers
- Support for OpenAI, Anthropic, Google AI, and more

Perfect for teams making data-driven AI decisions.

## Technology Used

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Static typing for code quality
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Primary database
- **JWT + bcryptjs** - Authentication & security

### Tools
- **pnpm** - Fast package manager
- **Prisma** - Database ORM
- **ESLint & Prettier** - Code quality tools

## Project Structure

```
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
```

## Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **pnpm** (`npm install -g pnpm`)
- **Git**

## Setup

### 1. Database Setup

**Install PostgreSQL:**
```bash
# macOS
brew install postgresql
brew services start postgresql
```

**Create Database:**
```sql
psql postgres

CREATE USER promptuser WITH PASSWORD 'promptpass123';
CREATE DATABASE promptoptimizer OWNER promptuser;
GRANT ALL PRIVILEGES ON DATABASE promptoptimizer TO promptuser;
\q
```

### 2. Backend Setup

```bash
cd backend/my-app
npm install
```

**Create `.env` file:**
```bash
DATABASE_URL="postgresql://promptuser:promptpass123@localhost:5432/promptoptimizer"
JWT_SECRET="your-generated-secret-here"
PORT=3001
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend Setup

```bash
cd frontend
pnpm install
```

**Create `.env.local` file:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Running the Project

### Start Backend
```bash
cd backend/my-app
npm run dev
```
→ Backend: `http://localhost:3001`

### Start Frontend
```bash
cd frontend
pnpm dev
```
→ Frontend: `http://localhost:3000`

### Health Check
```bash
curl http://localhost:3001/api/health
```

## Available Pages

- **Dashboard**: `/dashboard` - AI model comparison
- **Landing**: `/landing` - Marketing page
- **Onboarding**: `/onboarding` - User setup
- **Auth**: `/sign-in` - Authentication
- **API Setup**: `/api-key-setup` - Configure AI keys
- **Part-time**: `/part-time` - Work management

## Contributors

**Mari Moslehi** ([@marimoslehi](https://github.com/marimoslehi)) - Lead Developer

*Contributions welcome! Submit a Pull Request.*

## License

**Business Source License 1.1**

✅ **Free** for non-commercial use  
✅ **Open source** - Full transparency  
⚠️ **Commercial license** required for business use  
🔄 **Becomes MIT** in 4 years  

Contact: moslehimari@gmail.com

---

**Built for the AI community** 🚀