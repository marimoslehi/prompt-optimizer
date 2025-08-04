import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
            };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Mock middleware for now
        req.user = {
            id: '1',
            email: 'user@example.com',
            name: 'Mock User'
        };
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
