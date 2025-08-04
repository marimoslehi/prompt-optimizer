import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await rateLimiter.consume(req.ip);
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
