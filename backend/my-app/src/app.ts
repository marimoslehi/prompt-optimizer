import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiRoutes } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Prompt Optimizer API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*',
            prompts: '/api/prompts/*',
            tests: '/api/tests/*',
            analytics: '/api/analytics/*'
        }
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

console.log('🔍 Environment Variables Debug:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- GOOGLE_AI_API_KEY exists:', !!process.env.GOOGLE_AI_API_KEY);
console.log('- GOOGLE_AI_API_KEY length:', process.env.GOOGLE_AI_API_KEY?.length || 0);
console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('- First 10 chars of Google key:', process.env.GOOGLE_AI_API_KEY?.substring(0, 10) || 'NONE');

export default app;
