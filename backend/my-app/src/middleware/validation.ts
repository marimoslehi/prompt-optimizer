import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).max(50).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

export const validatePrompt = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        title: Joi.string().min(1).max(200).required(),
        content: Joi.string().min(10).required(),
        category: Joi.string().min(1).max(50).required(),
        tags: Joi.array().items(Joi.string()).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

export const validateTestRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        promptId: Joi.string().required(),
        models: Joi.array().items(Joi.string()).min(1).required(),
        parameters: Joi.object().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};
