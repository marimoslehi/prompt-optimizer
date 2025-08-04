import { Request, Response } from 'express';

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: { id: '1', email, name },
          token: 'mock_token_here'
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: { id: '1', email },
          token: 'mock_token_here'
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: { id: '1', email: 'user@example.com', name: 'User' }
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        data: { token: 'new_mock_token' }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}
