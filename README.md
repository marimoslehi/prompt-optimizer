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
- [Future Business Features](#future-business-features)
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
- One-click comparison across all major AI models
- Side-by-side quality scoring and cost analysis
- Smart recommendations based on your use case
- Complete usage analytics and optimization insights

## Key Features

### Core Features (Free Forever)
- **Multi-Model Comparison** - Test prompts across 10+ AI models simultaneously
- **Quality Scoring** - Automated evaluation of response quality
- **Cost Analysis** - Real-time cost calculation per prompt
- **Response Time Tracking** - Compare model speeds
- **Prompt Optimization Tips** - Improve your prompts based on results
- **Export Results** - Download comparisons as CSV or JSON
- **Usage History** - Track all your comparisons
- **Model Recommendations** - Get suggestions for your use case

### How It Works
1. Add your API keys (stored securely, never shared)
2. Enter your prompt once
3. Click "Compare All Models"
4. See results side-by-side with quality scores and costs
5. Export or save results for future reference

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
- **PostgreSQL** - Primary database
- **Prisma** - Type-safe database ORM
- **JWT** - Secure authentication

### Infrastructure
- **Vercel** - Frontend hosting (free tier)
- **Railway/Render** - Backend hosting (free tier)
- **Supabase** - PostgreSQL database (free tier)

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
- **Setting**: `/setting` - User setting page

## Contributors

**Mari Moslehi** ([@marimoslehi](https://github.com/marimoslehi)) - Lead Developer

*Contributions welcome! Submit a Pull Request.*

## License

**Business Source License 1.1**

**Free** for non-commercial use  
**Open source** - Full transparency  
**Commercial license** required for business use  
**Becomes MIT** in 4 years  

Contact: moslehimari@gmail.com

---

**Built for the AI community** 🚀