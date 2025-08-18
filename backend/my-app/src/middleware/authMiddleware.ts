import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
            };
        }
    }
}

interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No authorization header or invalid format');
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.substring(7);
        
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback-secret'
        ) as JWTPayload;

        if (!decoded.userId || !decoded.email) {
            console.log('❌ Invalid token payload:', decoded);
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload'
            });
        }

        // Add user info to request object
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.email.split('@')[0] // Fallback name from email
        };

        console.log('✅ Auth middleware - User authenticated:', decoded.userId, decoded.email);
        
        next();
    } catch (error: any) {
        console.error('❌ Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};