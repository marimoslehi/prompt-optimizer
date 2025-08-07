import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (replace with rate-limiter-flexible if needed)
interface RateLimiterOptions {
    points: number;
    duration: number;
}

class SimpleRateLimiter {
    private requests: Map<string, number[]> = new Map();
    private options: RateLimiterOptions;

    constructor(options: RateLimiterOptions) {
        this.options = options;
    }

    async consume(key: string): Promise<void> {
        const now = Date.now();
        const windowStart = now - (this.options.duration * 1000);
        
        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(time => time > windowStart);
        
        if (validRequests.length >= this.options.points) {
            const oldestRequest = Math.min(...validRequests);
            const msBeforeNext = (oldestRequest + (this.options.duration * 1000)) - now;
            throw { msBeforeNext };
        }
        
        validRequests.push(now);
        this.requests.set(key, validRequests);
    }
}

const rateLimiter = new SimpleRateLimiter({
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        await rateLimiter.consume(clientIP);
        next();
    } catch (rejRes: any) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
        });
    }
};

export { rateLimiterMiddleware as rateLimiter };