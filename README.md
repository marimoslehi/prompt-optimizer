# Prompt Optimizer

**AI Cost Intelligence Platform**  
Compare responses from multiple AI models, reduce costs, and discover the most efficient model for every task. 100% free with your own API keys.

## Table of Contents
- [Overview](#overview)
- [Why Prompt Optimizer](#why-prompt-optimizer)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Available Pages](#available-pages)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Overview

Prompt Optimizer helps developers and businesses optimize their AI usage by comparing multiple models side-by-side. Test prompts across GPT-4, Claude, Gemini, Llama, and other models to find the perfect balance of quality, speed, and cost.

**Everything is free forever for individual users. Bring your own API keys and start optimizing.**

## Why Prompt Optimizer

### The Problem
- Developers waste hours testing the same prompt across different AI models
- No easy way to compare quality vs. cost across models
- Businesses overspend by using expensive models for simple tasks
- Hard to track which model performs best for specific use cases

### Our Solution
- **Real Analytics Dashboard** - Track your actual usage, costs, and savings
- One-click comparison across all major AI models
- Side-by-side quality scoring and cost analysis
- Smart recommendations based on your use case
- Complete usage analytics and optimization insights

## Key Features

### Core Features (Free Forever)
- **Multi-Model Comparison** - Test prompts across 10+ AI models simultaneously
- **Real Dashboard Analytics** - Track prompts optimized, cost savings, performance boosts
- **Quality Scoring** - Automated evaluation of response quality
- **Cost Analysis** - Real-time cost calculation per prompt
- **Response Time Tracking** - Compare model speeds
- **Prompt Optimization Tips** - Improve your prompts based on results
- **Export Results** - Download comparisons as CSV or JSON
- **Usage History** - Track all your comparisons with real database storage
- **Model Recommendations** - Get suggestions for your use case

### How It Works
1. Sign up and create your account (stored in PostgreSQL database)
2. Add your API keys (stored securely, never shared)
3. Enter your prompt once
4. Click "Compare All Models"
5. See results side-by-side with quality scores and costs
6. View real analytics on your dashboard showing actual savings and usage

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type safety throughout
- **PostgreSQL** - Primary database with real user and analytics data
- **Prisma** - Type-safe database ORM with real schema
- **JWT** - Secure authentication with real token generation

### Infrastructure
- **Local Development** - PostgreSQL + Node.js + Next.js
- **Vercel** - Frontend hosting (free tier)
- **Railway/Render** - Backend hosting (free tier)
- **Supabase** - PostgreSQL database (free tier)

## Project Structure

```
promptOptimizer/
├── backend/my-app/             # Node.js + Express + PostgreSQL
│   ├── src/                    # Source code (controllers, services, routes)
│   │   ├── controllers/        # API request handlers
│   │   ├── services/           # Business logic (analytics, auth)
│   │   ├── middleware/         # Auth middleware
│   │   ├── routes/             # API route definitions
│   │   └── types/              # TypeScript type definitions
│   ├── prisma/                 # Database ORM and schema
│   │   └── schema.prisma       # Database schema with Users, PromptTests, ModelResults
│   └── .env                    # Backend config
└── frontend/                   # Next.js + React + TypeScript
    ├── app/                    # Pages (dashboard, auth, onboarding)
    ├── components/             # UI components
    ├── hooks/                  # API integration
    └── .env.local              # Frontend config
```

## Setup Instructions

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **pnpm** (`npm install -g pnpm`)
- **Git**

### 1. Database Setup

**Install PostgreSQL:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Verify PostgreSQL is running
brew services list | grep postgresql
```

**Create Database and User:**
```bash
# Connect to PostgreSQL
psql postgres

# In PostgreSQL shell, run these commands:
CREATE USER promptuser WITH PASSWORD 'promptpass123';
ALTER USER promptuser CREATEDB;
CREATE DATABASE promptoptimizer OWNER promptuser;
GRANT ALL PRIVILEGES ON DATABASE promptoptimizer TO promptuser;
\q
```

**Test Database Connection:**
```bash
# Should connect successfully
psql -U promptuser -d promptoptimizer
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
NODE_ENV=development
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Setup Prisma Database:**
```bash
# Install Prisma dependencies
npm install @prisma/client prisma jsonwebtoken
npm install -D @types/jsonwebtoken

# Generate Prisma client from schema
npx prisma generate

# Create database tables
npx prisma db push

# Verify tables were created
psql -U promptuser -d promptoptimizer -c "\dt"
```

You should see:
```
         List of relations
 Schema |        Name        | Type  |   Owner    
--------+--------------------+-------+------------
 public | model_results      | table | promptuser
 public | prompt_tests       | table | promptuser
 public | users              | table | promptuser
```

**Optional: Open Database Viewer:**
```bash
# Open Prisma Studio to view your database
npx prisma studio
# Opens at: http://localhost:5555
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
→ API Health: `http://localhost:3001/api/health`

### Start Frontend
```bash
cd frontend
pnpm dev
```
→ Frontend: `http://localhost:3000`

### Verify Everything Works
```bash
# Test backend health
curl http://localhost:3001/api/health

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Available Pages

- **Dashboard**: `/dashboard` - Real analytics dashboard with usage stats
- **Prompt Optimizer**: `/prompt-optimizer` - Main tool for comparing AI models
- **Landing**: `/` - Marketing landing page
- **Sign Up**: `/sign-up` - User registration (saves to database)
- **Sign In**: `/sign-in` - User authentication (real JWT tokens)
- **Onboarding**: `/onboarding` - User setup flow
- **Settings**: `/settings` - User settings and preferences

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts with authentication
- **prompt_tests** - Records of prompt comparison tests
- **model_results** - Individual AI model responses and metrics

## Features Implemented

✅ **Real User Registration** - Users saved to PostgreSQL database  
✅ **JWT Authentication** - Real token-based authentication  
✅ **Dashboard Analytics** - Real data from database (shows actual usage)  
✅ **Database Schema** - Complete Prisma schema with relationships  
✅ **API Endpoints** - Full REST API for users, tests, and analytics  

## Troubleshooting

### Common Issues

**Backend won't start - Port in use:**
```bash
# Kill process using port 3001
npx kill-port 3001
# OR manually find and kill
lsof -i :3001
kill -9 [PID]
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
brew services restart postgresql

# Test connection
psql -U promptuser -d promptoptimizer
```

**Prisma errors:**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database schema
npx prisma db push
```

**Frontend can't connect to backend:**
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Verify environment variables
cat frontend/.env.local
```

### Database Management

**View database data:**
```bash
# Open Prisma Studio
npx prisma studio

# Or use command line
psql -U promptuser -d promptoptimizer
SELECT * FROM users;
\q
```

**Reset database:**
```bash
# WARNING: This deletes all data
npx prisma migrate reset
```

## Contributors

**Mari Moslehi** ([@marimoslehi](https://github.com/marimoslehi)) - Lead Developer

*Contributions welcome! Submit a Pull Request.*

## License

**Business Source License 1.1**

- **Free** for non-commercial use  
- **Open source** - Full transparency  
- **Commercial license** required for business use  
- **Becomes MIT** in 4 years  

Contact: moslehimari@gmail.com

---

**Built for the AI community** 🚀

## Current Status

✅ **Database**: PostgreSQL with Prisma ORM  
✅ **Authentication**: Real user registration and JWT tokens  
✅ **Backend API**: Complete REST API with real data storage  
✅ **Frontend**: Next.js with real authentication flow  
✅ **Analytics**: Dashboard shows real usage data from database  

**Ready for prompt testing and real analytics tracking!**