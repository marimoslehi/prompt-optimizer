import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class AuthController {
  private auth = new AuthService();
  private users = new UserService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const { user, token } = await this.auth.register({ email, password, name });
      res.status(201).json({ success: true, data: { user, token } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.auth.login(email, password);
      if (!result) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  logout = async (_req: Request, res: Response) => {
    res.json({ success: true });
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.users.getById(Number(req.user?.id));
      res.status(200).json({ success: true, data: { user } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  refreshToken = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.users.getById(Number(req.user?.id));
      if (!user) throw new Error('User not found');
      const token = this.auth.generateToken(user);
      res.status(200).json({ success: true, data: { token } });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
