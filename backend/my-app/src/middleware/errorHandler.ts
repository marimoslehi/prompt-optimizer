import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', error);

    // Default error
    let status = 500;
    let message = 'Internal Server Error';

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    }
    // Validation errors
    else if (error.name === 'ValidationError') {
        status = 400;
        message = error.message;
    }
    // Database errors
    else if (error.code === '23505') { // Unique constraint violation
        status = 409;
        message = 'Resource already exists';
    }
    // Custom errors
    else if (error.status) {
        status = error.status;
        message = error.message;
    }

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            error: error.toString()
        })
    });
};
