# Prompt Optimizer

Enterprise AI Testing Platform - Compare AI model responses, optimize costs, and improve performance across multiple AI providers.

## Table of Contents
- [Introduction](#introduction)
- [Technology Used](#technology-used)
- [Contributors](#contributors)
- [Setup](#setup)
- [Running the Project](#running-the-project)

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
- **In Progress**: Backend development is currently underway
- **Planned**: API integrations with OpenAI, Anthropic, and Google AI

### Additional Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint & Prettier**: Code formatting and linting for code quality
- **Vercel**: Deployment platform optimized for Next.js applications
- **Git**: Version control system

## Contributors

- **Mari Moslehi** ([@marimoslehi](https://github.com/marimoslehi)) - Lead Developer & Designer

*Contributions welcome! Feel free to submit a Pull Request.*

## Setup

### Backend
**In Progress** - Backend setup instructions will be available soon.

### Frontend

#### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - Install with `npm install -g pnpm`
- **Git** for version control

#### Installation
```bash
# Clone the repository
git clone https://github.com/marimoslehi/prompt-optimizer.git

# Navigate to project directory
cd prompt-optimizer

# Install dependencies
pnpm install
```

#### Environment Configuration
Create a `.env.local` file in the root directory:
```bash
# Future API integrations (when backend is ready)
# OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## Running the Project

### Development Mode
Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build
Build and start the production version:
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Available Pages
- **Home**: `http://localhost:3000/`
- **Dashboard**: `http://localhost:3000/dashboard` - Main AI comparison interface
- **Part-time Dashboard**: `http://localhost:3000/part-time` - Work management features
- **Sign-in**: `http://localhost:3000/sign-in` - Authentication flow

---

**Built for the AI community**